import fs from 'node:fs'
import path from 'node:path'

import { type AnyModels, handleGetRequest } from '@rise-tools/server'
import chokidar from 'chokidar'
import Fastify from 'fastify'
import internalIp from 'internal-ip'
import qrcode from 'qrcode-terminal'
import { WebSocketServer } from 'ws'
import z from 'zod'

// TODO
import { connectWebSocket, createWSServerContext } from '../../../server/src/ws-connection'

interface IndexedModels {
  [key: string]: any
}

const WATCH_PATH = 'models/**/model.tsx'
const IGNORED_PATH = ['**/_*']

export const devArgsSchema = z.object({
  ws: z.boolean().optional().default(false),
  prod: z.boolean().optional().default(false),
  port: z.number(),
  host: z.string(),
  cwd: z.string().optional(),
})

export type DevArgs = z.infer<typeof devArgsSchema>

class ModelManager {
  models: AnyModels & IndexedModels = {}
  cwd: string = process.cwd()

  constructor(cwd: string) {
    this.cwd = cwd
  }

  parseModelPath(modelPath: string) {
    const key = modelPath.split('/').slice(1, -1).join(':')
    const path = modelPath.split('.').slice(0, -1).join('.')
    return { key, path }
  }

  async updateModel(modelPath: string) {
    const { key, path: basePath } = this.parseModelPath(modelPath)
    const cwd = this.cwd!
    this.models[key] = await import(path.join(cwd, basePath))
  }

  removeModel(modelPath: string) {
    const { key } = this.parseModelPath(modelPath)
    this.models[key]
  }

  getModels() {
    return this.models
  }
}

export class DevServer {
  options: DevArgs
  modelManager: ModelManager

  constructor(options: DevArgs) {
    this.options = options
    this.modelManager = new ModelManager(options.cwd!)

    this.start()
  }

  async start() {
    const port = this.options.port
    const host = this.getHost()

    const fsWatcher = await this.watchFiles()

    if (this.options.prod) {
      // Close the watcher if we are in prod mode after adding all models
      fsWatcher.close()
    }

    this.startServer()

    console.log('Server started on', `${host}:${port}`)
    console.log('Scan the QR from rise playground')

    this.createDevQR(`rise-playground://${host}:${port}`)
  }

  getIpAddress(): string {
    return internalIp.v4.sync() || '127.0.0.1'
  }

  getHost() {
    switch (this.options.host) {
      case 'localhost':
        return 'localhost'
      case 'lan':
        return this.getIpAddress()
    }
  }

  createDevQR(url: string) {
    qrcode.generate(url, { small: true }, function (qrcode) {
      console.log(qrcode)
    })
  }

  httpServer(port: number) {
    const modelManager = this.modelManager
    const server = Fastify()

    server.get('*', async function handler(request, reply) {
      const path = request.url.split('/').filter(Boolean)
      const models = modelManager.getModels()
      const resp = await handleGetRequest(models, { path })
      if (!resp) return reply.code(404).send({ error: 'not found' })
      return resp
    })

    server.listen({ port }).then(() => {})
    return {
      close() {
        server.close()
      },
    }
  }

  wsServer(port: number) {
    const wss = new WebSocketServer({ port })
    const models = this.modelManager.getModels()

    const context = createWSServerContext(models)

    wss.on('connection', (ws) => {
      connectWebSocket(context, ws)
    })

    return {
      close() {
        wss.close()
      },
    }
  }

  startServer() {
    if (this.options.ws) {
      return this.wsServer(this.options.port)
    } else {
      return this.httpServer(this.options.port)
    }
  }

  watchFiles(): Promise<{ close: () => void }> {
    return new Promise((resolve) => {
      const watcher = chokidar.watch(WATCH_PATH, {
        persistent: true,
        followSymlinks: true,
        ignored: IGNORED_PATH,
      })

      watcher.on('all', async (eventName, path) => {
        switch (eventName) {
          case 'add':
          case 'change':
            await this.modelManager.updateModel(path)
            break
          case 'unlink':
            this.modelManager.removeModel(path)
            break
        }
        this.updateNavigatePathInterface()
      })

      watcher.on('ready', () => {
        resolve({
          close() {
            watcher.close()
          },
        })
      })
    })
  }

  updateNavigatePathInterface() {
    const imports = `import '@rise-tools/kit-react-navigation/server'\n\n`
    const models = this.modelManager.getModels()

    const types =
      "declare module '@rise-tools/kit-react-navigation/server' {\n" +
      'export interface NavigatePath {\n' +
      Object.keys(models)
        .map((key) => `'${key}':string`)
        .join(',\n') +
      '}\n}'

    fs.writeFileSync('navigate.d.ts', imports + types)
  }
}
