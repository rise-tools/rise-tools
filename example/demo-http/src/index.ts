import { createHTTPDataSource } from '@final-ui/http-server'

import { models } from './ui'

function setupDataSource() {
  const dataSource = createHTTPDataSource()
  for (const [key, model] of Object.entries(models)) {
    dataSource.update(key, model)
  }
  return dataSource
}

const dataSource = setupDataSource()

export default {
  async fetch(request) {
    return dataSource.handleRequest(request)
  },
} satisfies ExportedHandler
