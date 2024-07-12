// import { createWSServer } from '@rise-tools/server'
import fs from 'node:fs'
import path from 'node:path'

import { glob } from 'node-glob'

// import qrcode from 'qrcode-terminal'

const baseDir = path.resolve(__dirname, '../')

async function main() {
  const modelPaths = await glob('app/**/model.tsx', {
    ignore: { ignored: (p) => !!p.parent?.name.startsWith('_') },
  })

  const importScripts: string[] = []
  const modelObject: string[] = []
  let types = 'export type Model ='

  for (const modelPath of modelPaths) {
    const modelName = modelPath.split('/').slice(1, -1).join(':')
    const modelVar = modelName.replace(/[^a-zA-Z0-9]/g, '_') || 'default_model'
    importScripts.push(`import ${modelVar} from '../${modelPath.split('.').slice(0, -1)}'`)
    modelObject.push(`'${modelName}': ${modelVar}`)
    types += `'${modelName}'|`
  }

  fs.writeFileSync(
    'script/models.ts',
    importScripts.join('\n') +
      '\n\n' +
      'export const models={\n' +
      modelObject.join(',\n') +
      '\n}\n' +
      types +
      '(string & {})'
  )

  // qrcode.generate('This will be a small QRCode, eh!', { small: true }, function (qrcode) {
  //   console.log(qrcode)
  // })

  console.log(modelPaths, importScripts, modelObject)
}

main()

// import { models } from './models'

// console.log(models)
