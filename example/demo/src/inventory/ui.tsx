import { action, ref, ServerDataState, UI } from '@final-ui/react'
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
} from '@final-ui/tamagui/server'

import { UIContext } from '../types'
import inventory, { Item } from './inventory'

export function InventoryExample(ctx: UIContext) {
  const inventoryItems = Object.fromEntries(inventory.map((item) => [item.key, item]))
  return {
    inventory: HomeScreen,
    ['inventory-items']: inventoryItems,
    ...Object.fromEntries(
      inventory.map((item) => [
        `inventory:${item.key}:details`,
        () => <Item item={item} ctx={ctx} />,
      ])
    ),
  }
}

function HomeScreen() {
  return (
    <YStack backgroundColor={'$background'}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {inventory.map((item, idx) => (
          <Button
            unstyled
            onPress={action(['navigate', `inventory:${item.key}:details`])}
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

export function Item({ item, ctx }: { item: Item; ctx: UIContext }) {
  return (
    <YStack flex={1} backgroundColor={'$background'} gap="$3">
      <Image
        key="photo"
        source={{
          uri: ref([`inventory-items`, item.key, 'photo']),
        }}
        style={{
          width: '100%',
          height: 200,
          backgroundColor: 'white',
        }}
        resizeMode="contain"
      />
      <YStack key="info" paddingHorizontal="$4" gap="$3">
        <H2 key="title" children={ref([`inventory-items`, item.key, 'title'])} />
        <Paragraph key="description" children={ref([`inventory-items`, item.key, 'description'])} />
        <XStack key="adjustments" gap="$3" alignItems="center">
          <XStack key="quantity" gap="$2">
            <SizableText size="$5">Quantity:</SizableText>
            <SizableText size="$5" children={ref([`inventory-items`, item.key, 'quantity'])} />
          </XStack>
          <Button
            key="dec"
            theme="red"
            onPress={() => {
              ctx.update(`inventory-items`, (data: Record<string, Item>) => ({
                ...data,
                [item.key]: {
                  ...data[item.key],
                  quantity: data[item.key]!.quantity - 1,
                },
              }))
            }}
            children="-"
          />
          <Button
            key="inc"
            theme="blue"
            onPress={() => {
              ctx.update(`inventory-items`, (data: Record<string, Item>) => ({
                ...data,
                [item.key]: {
                  ...data[item.key],
                  quantity: data[item.key]!.quantity + 1,
                },
              }))
            }}
            children="+"
          />
        </XStack>
      </YStack>
    </YStack>
  )
}
