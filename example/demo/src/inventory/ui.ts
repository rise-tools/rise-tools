import { ServerDataState } from '@final-ui/react'

import inventory, { Item } from './inventory'

export function getInventoryExample(): Record<string, ServerDataState> {
  return {
    inventory: getHomeScreen(),
    ...Object.fromEntries(
      inventory.map((item) => [`inventory:item:${item.key}`, getItemScreen(item)])
    ),
  }
}

export function getHomeScreen(): ServerDataState {
  return {
    $: 'component',
    component: 'YStack',
    children: [
      {
        $: 'component',
        key: 'items',
        component: 'ScrollView',
        props: {
          contentContainerStyle: {
            gap: 20,
          },
        },
        children: [
          {
            $: 'component',
            key: 'header',
            component: 'Text',
            children: 'Welcome to the inventory app',
          },
          ...inventory.map(
            (item): ServerDataState => ({
              $: 'component',
              key: item.key,
              component: 'XStack',
              props: {
                gap: 10,
                paddingHorizontal: 20,
                alignItems: 'center',
                onPress: {
                  $: 'event',
                  action: ['navigate', `inventory:item:${item.key}`],
                },
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
                  },
                },
                {
                  $: 'component',
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
            })
          ),
        ],
      },
    ],
  }
}

export function getItemScreen(item: Item): ServerDataState {
  return {
    $: 'component',
    component: 'YStack',
    children: {
      $: 'component',
      component: 'Text',
      children: item.title,
    },
  }
}
