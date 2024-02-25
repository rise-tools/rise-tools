import { Connection, useConnection } from 'app/provider/storage'
import { useDataSource } from 'app/src/data-sources'
import React from 'react'
import { createParam } from 'solito'
import { NotFoundScreen } from './not-found'
import { Template } from '@react-native-templates/core'
import { demoComponents } from 'app/demoComponents'
import { useRouter } from 'solito/router'

const { useParam, useParams } = createParam<{ id: string; path: string }>()

export function ConnectionScreen() {
  const [id] = useParam('id')
  // const router = useRouter()
  const [connection] = useConnection(id)
  if (!connection) return <NotFoundScreen />
  return <ActiveConnectionScreen connection={connection} />
}
function ActiveConnectionScreen({ connection }: { connection: Connection }) {
  const router = useRouter()
  const { params } = useParams()
  const [path] = useParam('path')

  const dataSource = useDataSource(connection.id, connection.host, (event) => {
    if (event.value?.[0] === 'navigate') {
      router.push(`/connection/${params.id}?path=${event.value?.[1]}`)
      return true
    }
    return false
  })
  if (!dataSource) return null
  return (
    <Template
      components={demoComponents}
      dataSource={dataSource}
      onEvent={dataSource.sendEvent}
      path={path || ''}
      // onEvent={(payload) => {
      //   console.log('onEvent', payload)
      // }}
    />
  )
}
