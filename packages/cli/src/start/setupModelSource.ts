import path from 'node:path'

import { type AnyModels } from '@rise-tools/server'

import { IndexedModels } from './types'

interface SetupModelSourceOptions {
  root: string
}

export function setupModelSource({ root }: SetupModelSourceOptions) {
  const models: AnyModels & IndexedModels = {}

  function parseModelPath(modelPath: string) {
    const key = modelPath.split('/').slice(1, -1).join(':')
    const path = modelPath.split('.').slice(0, -1).join('.')
    return { key, path }
  }

  async function updateModel(modelPath: string) {
    const { key, path: basePath } = parseModelPath(modelPath)
    // TODO
    models[key] = await import(path.join(root, basePath))
  }

  function removeModel(modelPath: string) {
    const { key } = parseModelPath(modelPath)
    models[key]
  }

  function getModels() {
    return models
  }

  return {
    updateModel,
    removeModel,
    getModels,
  }
}
