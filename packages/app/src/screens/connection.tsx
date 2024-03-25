import { Template } from '@react-native-templates/core'
import { useDataSource } from 'app/src/data-sources'
import { demoComponents } from 'app/src/index'
import { Connection, useConnection } from 'app/src/provider/storage'
import React from 'react'
import { createParam } from 'solito'
import { useRouter } from 'solito/router'

import { NotFoundScreen } from './not-found'

const { useParam, useParams } = createParam<{ id: string; path: string }>()

export function ConnectionScreen() {
  const [id] = useParam('id')
  // const router = useRouter()
  const [connection] = useConnection(id)
  if (!connection) return <NotFoundScreen />
  return <ActiveConnectionScreen connection={connection} />
  // return <SizableText>Hellow</SizableText>
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
    if (event.value?.[0] === 'navigate-back') {
      router.back()
    }
    return false
  })
  if (!dataSource) return null
  return (
    <Template
      // @ts-ignore
      components={demoComponents}
      dataSource={dataSource}
      // @ts-ignore
      onEvent={dataSource.sendEvent}
      path={path || ''}
    />
  )
}
