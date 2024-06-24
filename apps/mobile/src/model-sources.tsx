import { createHTTPModelSource } from '@rise-tools/http-client'
import { createWSModelSource } from '@rise-tools/ws-client'

const modelSources = new Map<string, ReturnType<typeof createModelSource>>()

function createModelSource(url: string) {
  if (['ws:', 'wss:'].includes(new URL(url).protocol)) {
    return createWSModelSource(url)
  }
  return createHTTPModelSource(url)
}

export function useModelSource(id: string, url: string) {
  const key = `${id}${url}`
  if (modelSources.has(key)) {
    return modelSources.get(key)!
  }
  const newModelSource = createModelSource(url)
  modelSources.set(key, newModelSource)
  return newModelSource
}
