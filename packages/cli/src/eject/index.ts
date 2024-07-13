import fs from 'node:fs'

import chokidar from 'chokidar'

import { IGNORED_PATH, WATCH_PATH } from '../config/constants'

export const ejectAction = async () => {
  const watcher = chokidar.watch(WATCH_PATH, {
    ignored: IGNORED_PATH,
  })

  const importScripts: string[] = []
  const modelObject: string[] = []
  let types = 'export type Model ='

  watcher.on('add', async (modelPath) => {
    const modelName = modelPath.split('/').slice(1, -1).join(':')
    const modelVar = modelName.replace(/[^a-zA-Z0-9]/g, '_') || 'default_model'
    importScripts.push(`import ${modelVar} from './${modelPath.split('.').slice(0, -1)}'`)
    modelObject.push(`'${modelName}': ${modelVar}`)
    types += `'${modelName}'|`
  })

  watcher.on('ready', () => {
    console.log("Created 'server.ts' file")
    fs.writeFileSync(
      'server.ts',
      importScripts.join('\n') +
        '\n\n' +
        'export const models={\n' +
        modelObject.join(',\n') +
        '\n}\n' +
        types +
        '(string & {})'
    )

    watcher.close()
  })
}
