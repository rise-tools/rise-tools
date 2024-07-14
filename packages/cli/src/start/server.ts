import fs from 'node:fs'
import path from 'node:path'

import { createServer } from '@rise-tools/server'
import chokidar from 'chokidar'

import { IGNORED_PATH, WATCH_PATH } from '../config/constants'
import { createDeepLink } from '../utils/createDeepLink'
import { createDevQR } from '../utils/createDevQR'
import { getHost } from '../utils/getHost'
import { buildNavigateInterface } from './buildNavigateInterface'
import { setupModelSource } from './setupModelSource'
import { DevArgs } from './types'

const readPkgJSON = (root: string) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'))
  } catch (error) {
    return {}
  }
}

export function createDevServer(options: DevArgs) {
  const { host: hostType, port, prod, root } = options

  const dataSource = setupModelSource({ root })
  const host = getHost(hostType)
  const pkg = readPkgJSON(root)

  async function start() {
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

    const link = createDeepLink({
      id: 'CLI_' + Date.now(),
      host,
      label: pkg.name || 'Rise Playground',
      path: '/',
    })

    createDevQR(link)

    return () => {
      server.close()
      watcher.close()
    }
  }

  return { start }
}
