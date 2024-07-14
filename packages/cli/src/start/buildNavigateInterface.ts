import fs from 'node:fs'

import { type AnyModels } from '@rise-tools/server'

import { IndexedModels } from './types'

export function buildNavigateInterface(models: AnyModels & IndexedModels) {
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
