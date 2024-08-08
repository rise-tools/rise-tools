import { navigate } from '@rise-tools/kit-react-navigation/server'
import {
  Button,
  H2,
  H4,
  Image,
  Paragraph,
  ScrollView,
  SizableText,
  XStack,
  YStack,
} from '@rise-tools/kitchen-sink/server'
import { ref } from '@rise-tools/react'
import { lookup, state, StateSetter, view } from '@rise-tools/server'

import defaultInventory, { Inventory, Item } from './inventory'

// models
const [inventoryItems, setInventoryState] = state(defaultInventory)
const inventoryHome = view((get) => <HomeScreen inventory={get(inventoryItems)} />)
const inventoryItem = lookup((key) =>
  view((get) => {
    const inventoryItem = get(inventoryItems)?.find((i) => i.key === key)
    if (!inventoryItem) return <NotFound />
    return <ItemScreen item={inventoryItem} onUpdateInventory={setInventoryState} />
  })
)

export const models = {
  inventory: inventoryHome,
  inventoryItem,
  inventoryItems,
}

function HomeScreen({ inventory }: { inventory?: Inventory }) {
  return (
    <YStack backgroundColor="$background">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {inventory?.map((item, idx) => (
          <Button
            unstyled
            onPress={navigate(`inventoryItem/${item.key}`, { title: item.title })}
            pressStyle={{ opacity: 0.8 }}
          >
            <XStack
              gap={10}
              paddingHorizontal={20}
              paddingVertical={10}
              alignItems="center"
              borderBottomWidth={idx === inventory.length - 1 ? 0 : 1}
              borderBottomColor="$gray4"
            >
              <Image
                source={{ uri: item.photo }}
                style={{ width: 75, height: 75 }}
                resizeMode="contain"
              />
              <YStack>
                <H4 children={item.title} />
                <XStack gap={10}>
                  <XStack gap="$1">
                    <SizableText size="$4">Quantity:</SizableText>
                    <SizableText size="$4" children={item.quantity} />
                  </XStack>
                  <XStack gap="$1">
                    <SizableText size="$4">Price:</SizableText>
                    <SizableText size="$4" children={item.price} />
                  </XStack>
                </XStack>
              </YStack>
            </XStack>
          </Button>
        ))}
      </ScrollView>
    </YStack>
  )
}

export function ItemScreen({
  item,
  onUpdateInventory,
}: {
  item: Item
  onUpdateInventory: StateSetter<Item[]>
}) {
  return (
    <YStack flex={1} backgroundColor={'$background'} gap="$3">
      <Image
        key="photo"
        source={{
          uri: ref([`inventoryItems`, item.key, 'photo']),
        }}
        style={{
          width: '100%',
          height: 200,
          backgroundColor: 'white',
        }}
        resizeMode="contain"
      />
      <YStack key="info" paddingHorizontal="$4" gap="$3">
        <H2 key="title" children={ref([`inventoryItems`, item.key, 'title'])} />
        <Paragraph key="description" children={ref([`inventoryItems`, item.key, 'description'])} />
        <XStack key="adjustments" gap="$3" alignItems="center">
          <XStack key="quantity" gap="$2">
            <SizableText size="$5">Quantity:</SizableText>
            <SizableText size="$5" children={ref([`inventoryItems`, item.key, 'quantity'])} />
          </XStack>
          <Button
            key="dec"
            theme="red"
            onPress={() => {
              onUpdateInventory((inventory: Inventory) =>
                inventory.map((item) => {
                  if (item.key === item.key) {
                    return {
                      ...item,
                      quantity: item.quantity - 1,
                    }
                  }
                  return item
                })
              )
            }}
            children="-"
          />
          <Button
            key="inc"
            theme="blue"
            onPress={() => {
              onUpdateInventory((inventory: Inventory) =>
                inventory.map((item) => {
                  if (item.key === item.key) {
                    return {
                      ...item,
                      quantity: item.quantity + 1,
                    }
                  }
                  return item
                })
              )
            }}
            children="+"
          />
        </XStack>
      </YStack>
    </YStack>
  )
}

function NotFound() {
  return (
    <YStack backgroundColor={'$background'}>
      <SizableText size="$5">Not Found</SizableText>
    </YStack>
  )
}
