import { handler, ServerDataState } from '@final-ui/react'

import { UIContext } from '../types'
import inventory, { Item } from './inventory'

export function getInventoryExample(ctx: UIContext): Record<string, ServerDataState> {
  return {
    inventory: getHomeScreen(),
    ...Object.fromEntries(
      inventory.flatMap((item) => [
        [`inventory:${item.key}:details`, getItemScreen(item, ctx)],
        [`inventory:${item.key}`, item],
      ])
    ),
  }
}

export function getHomeScreen(): ServerDataState {
  return {
    $: 'component',
    component: 'YStack',
    props: {
      backgroundColor: 'white',
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
              onPress: {
                $: 'event',
                action: ['navigate', `inventory:${item.key}:details`],
              },
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
                borderBottomColor: '#cdcdcd',
              },
              children: [
                {
                  $: 'component',
                  key: 'photo',
                  component: 'Image',
                  props: {
                    source: {
                      uri: item.photo,
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
                      children: item.title,
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
                          component: 'SizableText',
                          props: {
                            size: '$4',
                          },
                          children: `Quantity: ${item.quantity}`,
                        },
                        {
                          $: 'component',
                          key: 'price',
                          component: 'SizableText',
                          props: {
                            size: '$4',
                          },
                          children: `Price: $${item.price}`,
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
  return {
    $: 'component',
    component: 'YStack',
    props: {
      flex: 1,
      backgroundColor: '$background',
      gap: '$3',
    },
    children: [
      {
        $: 'component',
        component: 'Image',
        key: 'photo',
        props: {
          source: {
            uri: {
              $: 'ref',
              ref: [`inventory:${item.key}`, 'photo'],
            },
          },
          style: {
            width: '100%',
            height: 200,
            backgroundColor: 'white',
          },
          resizeMode: 'contain',
        },
      },
      {
        $: 'component',
        component: 'YStack',
        key: 'info',
        props: {
          paddingHorizontal: '$4',
          gap: '$3',
        },
        children: [
          {
            $: 'component',
            component: 'H2',
            key: 'title',
            children: {
              $: 'ref',
              ref: [`inventory:${item.key}`, 'title'],
            },
          },
          {
            $: 'component',
            component: 'XStack',
            key: 'adjustments',
            props: {
              gap: '$3',
              alignItems: 'center',
            },
            children: [
              {
                $: 'component',
                component: 'SizableText',
                key: 'quantity',
                props: {
                  size: '$5',
                },
                children: {
                  $: 'ref',
                  ref: [`inventory:${item.key}`, 'quantity'],
                },
              },
              {
                $: 'component',
                component: 'Button',
                key: 'decrement',
                props: {
                  onPress: handler(() => {
                    ctx.update(`inventory:${item.key}`, (data: Item) => ({
                      ...data,
                      quantity: data.quantity > 0 ? data.quantity - 1 : 0,
                    }))
                  }),
                },
                children: '-',
              },
              {
                $: 'component',
                component: 'Button',
                key: 'increment',
                props: {
                  onPress: handler(() => {
                    ctx.update(`inventory:${item.key}`, (data: Item) => ({
                      ...data,
                      quantity: data.quantity + 1,
                    }))
                  }),
                },
                children: '+',
              },
            ],
          },
        ],
      },
    ],
  }
}
