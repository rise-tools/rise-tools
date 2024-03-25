import { useConnection } from 'app/src/provider/storage'
import { ConnectScreen } from 'app/screens/connect'
import { Stack } from 'expo-router'
import { createParam } from 'solito'

const { useParam } = createParam<{ connectInfo: string }>()

export default function Screen() {
  const [connectInfo] = useParam('connectInfo')

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Connection',
        }}
      />
      <ConnectScreen connectInfo={connectInfo} />
    </>
  )
}
