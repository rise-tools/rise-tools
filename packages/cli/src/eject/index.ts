import fs from 'node:fs'

import chokidar from 'chokidar'
import prettier from 'prettier'

import { IGNORED_PATH, WATCH_PATH } from '../config/constants'

export const ejectAction = async () => {
  const watcher = chokidar.watch(WATCH_PATH, {
    ignored: IGNORED_PATH,
  })

  const importScripts: string[] = []
  const modelObject: string[] = []

  watcher.on('add', async (modelPath) => {
    const modelName = modelPath.split('/').slice(1, -1).join(':')
    const modelVar = modelName.replace(/[^a-zA-Z0-9]/g, '_') || 'default_model'
    importScripts.push(`import ${modelVar} from './${modelPath.split('.').slice(0, -1)}';`)
    modelObject.push(`'${modelName}': ${modelVar},`)
  })

  watcher.on('ready', async () => {
    console.log("Created 'server.ts' file")
    const output = `
      ${importScripts.join('\n')}

      export const models = {
        ${modelObject.join('\n')}
      }`

    const formattedOutput = await prettier.format(output, {
      parser: 'typescript',
    })

    fs.writeFileSync('server.ts', formattedOutput)

    watcher.close()
  })
}
