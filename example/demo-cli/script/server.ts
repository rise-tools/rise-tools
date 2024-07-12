import fs from 'node:fs'

import { type AnyModels, handleGetRequest } from '@rise-tools/server'
import chokidar from 'chokidar'
import Fastify from 'fastify'
import qrcode from 'qrcode-terminal'

const PORT = Number(process.env.PORT || '3005')
const log = console.log.bind(console)

const server = Fastify()

const watcher = chokidar.watch('app/**/model.tsx', {
  persistent: true,
})

interface IndexedModels {
  [key: string]: any
}

const models: AnyModels & IndexedModels = {}

watcher.on('all', (eventName, path) => {
  switch (eventName) {
    case 'add':
    case 'addDir':
    case 'change':
      log(`File ${path} has been added`)
      updateModel(path)
      break
    case 'unlink':
    case 'unlinkDir':
      log(`File ${path} has been removed`)
      removeModel(path)
      break
  }
  updateNavigatePathInterface()
})

server.get('*', async function handler(request, reply) {
  const path = request.url.split('/').filter(Boolean)
  const resp = await handleGetRequest(models, { path })
  if (!resp) return reply.code(404).send({ error: 'not found' })
  return resp
})

server.listen({ port: PORT }).then(() => {
  console.log('Server started on port', PORT)
  log('Scan the QR from rise playground')
  qrcode.generate('rise-playground://127.0.0.1:' + PORT, { small: true }, function (qrcode) {
    console.log(qrcode)
  })
})

async function updateModel(modelPath: string) {
  const modelName = modelPath.split('/').slice(1, -1).join(':')
  models[modelName] = await import(`../${modelPath.split('.').slice(0, -1)}`)
}

function removeModel(modelPath: string) {
  delete models[modelPath.split('/').slice(1, -1).join(':')]
}

function updateNavigatePathInterface() {
  const imports = `import '@rise-tools/kit-react-navigation/server'\n\n`

  const types =
    "declare module '@rise-tools/kit-react-navigation/server' {\n" +
    'export interface NavigatePath {\n' +
    Object.keys(models)
      .map((key) => `'${key}':string`)
      .join(',\n') +
    '}\n}'

  fs.writeFileSync('navigate.d.ts', imports + types)
}
