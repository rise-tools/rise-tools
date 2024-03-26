import { createWSDataSource } from '@react-native-templates/ws-client'

const dataSources = new Map<string, ReturnType<typeof createWSDataSource>>()

export function useDataSource(id: string, url: string, interceptEvent?: (event: any) => boolean) {
  const dataSourceKey = `${id}${url}`
  if (dataSources.has(dataSourceKey)) return dataSources.get(dataSourceKey)
  const newDataSource = createWSDataSource(url, interceptEvent)
  dataSources.set(dataSourceKey, newDataSource)
  return newDataSource
}
