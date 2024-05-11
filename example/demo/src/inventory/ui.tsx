import { action, ServerDataState } from '@final-ui/react'

import { UIContext } from '../types'
import inventory, { Item } from './inventory'

export function getInventoryExample(ctx: UIContext): Record<string, ServerDataState> {
  const inventoryItems = Object.fromEntries(inventory.map((item) => [item.key, item]))
  return {
    inventory: getHomeScreen(),
    ['inventory-items']: inventoryItems,
    ...Object.fromEntries(
      inventory.map((item) => [`inventory:${item.key}:details`, getItemScreen(item, ctx)])
    ),
  }
}

export function getHomeScreen(): ServerDataState {
  return {
    $: 'component',
    component: 'YStack',
    props: {
      backgroundColor: '$background',
    },
    children: [
      {
        $: 'component',
        key: 'items',
        component: 'ScrollView',
        props: {
          contentContainerStyle: {
            paddingBottom: 20,
          },
        },
        children: inventory.map(
          (item, idx): ServerDataState => ({
            $: 'component',
            key: item.key,
            component: 'Button',
            props: {
              unstyled: true,
              onPress: action(['navigate', `inventory:${item.key}:details`]),
              pressStyle: {
                opacity: 0.8,
              },
            },
            children: {
              $: 'component',
              component: 'XStack',
              props: {
                gap: 10,
                paddingHorizontal: 20,
                paddingVertical: 10,
                alignItems: 'center',
                borderBottomWidth: idx === inventory.length - 1 ? 0 : 1,
                borderBottomColor: '$gray4',
              },
              children: [
                {
                  $: 'component',
                  key: 'photo',
                  component: 'Image',
                  props: {
                    source: {
                      uri: {
                        $: 'ref',
                        ref: [`inventory-items`, item.key, 'photo'],
                      },
                    },
                    style: {
                      width: 75,
                      height: 75,
                    },
                    resizeMode: 'contain',
                  },
                },
                {
                  $: 'component',
                  key: 'info',
                  component: 'YStack',
                  children: [
                    {
                      $: 'component',
                      key: 'title',
                      component: 'H4',
                      children: {
                        $: 'ref',
                        ref: [`inventory-items`, item.key, 'title'],
                      },
                    },
                    {
                      $: 'component',
                      key: 'details',
                      component: 'XStack',
                      props: {
                        gap: 10,
                      },
                      children: [
                        {
                          $: 'component',
                          key: 'quantity',
                          component: 'XStack',
                          props: {
                            gap: '$1',
                          },
                          children: [
                            {
                              $: 'component',
                              key: 'label',
                              component: 'SizableText',
                              props: {
                                size: '$4',
                              },
                              children: `Quantity:`,
                            },
                            {
                              $: 'component',
                              key: 'value',
                              component: 'SizableText',
                              props: {
                                size: '$4',
                              },
                              children: {
                                $: 'ref',
                                ref: [`inventory-items`, item.key, 'quantity'],
                              },
                            },
                          ],
                        },
                        {
                          $: 'component',
                          key: 'price',
                          component: 'XStack',
                          props: {
                            gap: '$1',
                          },
                          children: [
                            {
                              $: 'component',
                              key: 'label',
                              component: 'SizableText',
                              props: {
                                size: '$4',
                              },
                              children: `Price:`,
                            },
                            {
                              $: 'component',
                              key: 'value',
                              component: 'SizableText',
                              props: {
                                size: '$4',
                              },
                              children: {
                                $: 'ref',
                                ref: [`inventory-items`, item.key, 'price'],
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          })
        ),
      },
    ],
  }
}

export function getItemScreen(item: Item, ctx: UIContext): ServerDataState {
  // @ts-ignore return type of JSX factory needs to be changed
  return (
    <YStack flex={1} backgroundColor={'$background'} gap="$3">
      <Image
        key="photo"
        // @ts-ignore ref needs to be valid prop
        source={{
          uri: {
            $: 'ref',
            ref: [`inventory-items`, item.key, 'photo'],
          },
        }}
        style={{
          width: '100%',
          height: 200,
          backgroundColor: 'white',
        }}
        resizeMode="contain"
      />
      <YStack key="info" paddingHorizontal="$4" gap="$3">
        <H2
          key="title"
          children={{
            $: 'ref',
            ref: [`inventory-items`, item.key, 'title'],
          }}
        />
        <Paragraph
          key="description"
          children={{
            $: 'ref',
            ref: [`inventory-items`, item.key, 'description'],
          }}
        />
        <XStack key="adjustments" gap="$3" alignItems="center">
          <XStack key="quantity" gap="$2">
            <SizableText size="$5">Quantity:</SizableText>
            <SizableText
              size="$5"
              children={{
                $: 'ref',
                ref: [`inventory-items`, item.key, 'quantity'],
              }}
            />
          </XStack>
          <Button
            key="inc"
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
            key="dec"
            theme="red"
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
