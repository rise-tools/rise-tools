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
                action: ['navigate', `inventory:item:${item.key}`],
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
            },
          })
        ),
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
