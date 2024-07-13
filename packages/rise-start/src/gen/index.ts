import fs from 'node:fs'

import chokidar from 'chokidar'

export const genAction = async () => {
  const watcher = chokidar.watch('app/**/model.tsx', {
    ignored: ['**/_*'],
  })

  const importScripts: string[] = []
  const modelObject: string[] = []
  let types = 'export type Model ='

  watcher.on('add', async (modelPath) => {
    console.log(modelPath)
    const modelName = modelPath.split('/').slice(1, -1).join(':')
    const modelVar = modelName.replace(/[^a-zA-Z0-9]/g, '_') || 'default_model'
    importScripts.push(`import ${modelVar} from './${modelPath.split('.').slice(0, -1)}'`)
    modelObject.push(`'${modelName}': ${modelVar}`)
    types += `'${modelName}'|`
  })

  watcher.on('ready', () => {
    fs.writeFileSync(
      'models.ts',
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
