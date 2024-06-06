import {
  DraggableFlatList,
  DropdownButton,
  SelectField,
  Slider,
  SwitchField,
} from '@final-ui/kit/server'
import { action, event, lookup, ref, response, setStateAction, state } from '@final-ui/react'
import { Button, H2, Image, Paragraph, SizableText, XStack, YStack } from '@final-ui/tamagui/server'

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
  const selectedValue = state<string>('')
  const sliderValue = state(0)
  const sliderValueMultiFirst = state(25)
  const sliderValueMultiEnd = state(75)
  const isChecked = state(false)

  const inv = inventory.map((item) => ({
    key: item.key,
    label: item.title,
    onPress: action(['navigate', `inventory:${item.key}:details`]),
  }))

  // @ts-ignore
  const inventoryItems = state(inv)

  return (
    <YStack backgroundColor={'$background'}>
      <DropdownButton value={selectedValue} button={<H2>Inventory</H2>} options={inv} />
      <SelectField
        value={selectedValue}
        onValueChange={setStateAction(selectedValue)}
        unselectedLabel={'Select an item'}
        options={inv}
      />
      <Slider
        value={[sliderValue]}
        onValueChange={setStateAction(sliderValue, lookup([0, 0]))}
        onSlideEnd={(_event, value) => {
          console.log('value', _event, value)
        }}
        min={0}
        max={100}
        step={1}
      />
      <YStack marginBottom="$3" />
      <Slider
        value={[sliderValueMultiFirst, sliderValueMultiEnd]}
        onValueChange={[
          setStateAction(sliderValueMultiFirst, lookup([0, 0])),
          setStateAction(sliderValueMultiEnd, lookup([0, 1])),
        ]}
        onSlideEnd={async (_event, value) => {
          console.log('value', _event, value)
          // artificial stop
          await new Promise((resolve) => setTimeout(resolve, 2000))
          return response(null)
            .action(setStateAction(sliderValueMultiFirst, 25))
            .action(setStateAction(sliderValueMultiEnd, 60))
        }}
        min={0}
        max={100}
        step={1}
      />
      <SwitchField
        value={isChecked}
        onCheckedChange={event(
          (...args) => {
            console.log(args)
          },
          { actions: [setStateAction(isChecked)] }
        )}
        label="Switch me on"
      />
      <DraggableFlatList
        // @ts-ignore this error will go away once former ts-ignore is removed
        items={inventoryItems}
        onReorder={setStateAction(inventoryItems)}
        header={<H2>Header</H2>}
        footer={<H2>Footer</H2>}
      />
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
