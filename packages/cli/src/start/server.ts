import { createServer } from '@rise-tools/server'
import chokidar from 'chokidar'

import { IGNORED_PATH, WATCH_PATH } from '../config/constants'
import { buildNavigateInterface } from './buildNavigateInterface'
import { createDevQR } from './createDevQR'
import { getHost } from './getHost'
import { setupModelSource } from './setupModelSource'
import { DevArgs } from './types'

export function createDevServer(options: DevArgs) {
  const { host: hostType, port, prod, root } = options

  const dataSource = setupModelSource({ root })

  async function start() {
    const host = getHost(hostType)

    const watcher = chokidar.watch(WATCH_PATH, {
      persistent: true,
      followSymlinks: true,
      ignored: IGNORED_PATH,
    })

    await new Promise((resolve) =>
      watcher
        .on('add', (path) => dataSource.updateModel(path))
        .on('change', (path) => dataSource.updateModel(path))
        .on('unlink', (path) => dataSource.removeModel(path))
        .on('all', () => buildNavigateInterface(dataSource.getModels()))
        .on('ready', () => {
          resolve('')
        })
    )

    const server = await createServer(dataSource.getModels(), port)

    if (prod) {
      // Close the watcher if we are in prod mode after adding all models
      watcher.close()
    }

    console.log('Server started on', `${host}:${port}`)
    console.log('Scan the QR from rise playground')

    createDevQR(`rise-playground://${host}:${port}`)

    const cleanup = () => {
      server.close()
      watcher.close()
    }

    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)
    process.on('exit', cleanup)
  }

  return { start }
}
