import { createHTTPDataSource } from '@final-ui/http-client'
import { createWSDataSource } from '@final-ui/ws-client'

const dataSources = new Map<string, ReturnType<typeof createDataSource>>()

function createDataSource(url: string) {
  if (['ws:', 'wss:'].includes(new URL(url).protocol)) {
    return createWSDataSource(url)
  }
  return createHTTPDataSource(url)
}

export function useDataSource(id: string, url: string) {
  const dataSourceKey = `${id}${url}`
  if (dataSources.has(dataSourceKey)) {
    return dataSources.get(dataSourceKey)
  }
  const newDataSource = createDataSource(url)
  dataSources.set(dataSourceKey, newDataSource)
  return newDataSource
}
