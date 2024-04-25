import { ServerDataState } from '@final-ui/react'

import inventory, { Item } from './inventory'

export function getAllScreens(): Record<string, ServerDataState> {
  return {
    // "''" indicates the home screen
    '': getHomeScreen(),
    // "item:${item.key}" indicates the screen for a specific item
    ...Object.fromEntries(inventory.map((item) => [`item:${item.key}`, getItemScreen(item)])),
  }
}

export function getHomeScreen(): ServerDataState {
  return {
    $: 'component',
    component: 'YStack',
    children: {
      $: 'component',
      component: 'Text',
      children: 'Welcome to the inventory app',
    },
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
