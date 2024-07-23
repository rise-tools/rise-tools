import { navigate } from '@rise-tools/kit-react-navigation/server'
import { Button, YStack } from '@rise-tools/kitchen-sink/server'

export function Home() {
  return (
    <YStack padding="$4">
      <Button
        onPress={navigate('controls', { title: 'UI Controls' })}
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
      >
        🎨 UI Controls
      </Button>
      <Button onPress={navigate('inventory', { title: 'Inventory' })}>
        🏭 Car Parts Inventory
      </Button>
      <Button
        onPress={navigate('delivery', { title: 'Super Delivery' })}
        borderTopLeftRadius={0}
        borderTopRightRadius={0}
      >
        🚚 Super Delivery
      </Button>
    </YStack>
  )
}
