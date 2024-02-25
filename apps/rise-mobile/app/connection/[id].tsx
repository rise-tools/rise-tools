import { useConnection } from 'app/provider/storage'
import { ConnectionScreen } from 'app/screens/connection'
import { Stack } from 'expo-router'
import { createParam } from 'solito'

const { useParam } = createParam<{ id: string; path: string }>()

export default function Screen() {
  const [id] = useParam('id')
  const [path] = useParam('path')
  const [connection] = useConnection(id)

  return (
    <>
      <Stack.Screen
        options={{
          title: path || connection?.label,
        }}
      />
      <ConnectionScreen />
    </>
  )
}
