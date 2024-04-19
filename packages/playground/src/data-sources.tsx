import { createWSDataSource } from '@final-ui/ws-client'

const dataSources = new Map<string, ReturnType<typeof createWSDataSource>>()

export function useDataSource(id: string, url: string) {
  const dataSourceKey = `${id}${url}`
  if (dataSources.has(dataSourceKey)) {
    return dataSources.get(dataSourceKey)
  }
  const newDataSource = createWSDataSource(url)
  dataSources.set(dataSourceKey, newDataSource)
  return newDataSource
}
