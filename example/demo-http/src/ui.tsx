import { Text, View } from '@final-ui/tamagui/server'

import { db } from './db'

export const routes = {
  '/': Root,
  '/item': Item,
}

async function Item() {
  return (
    <View>
      <Text>Item</Text>
    </View>
  )
}

async function Root() {
  const { data, error } = await db.from('inventory').select()
  if (error) {
    return (
      <View>
        <Text>There was an error loading: {error.message}</Text>
      </View>
    )
  }
  return (
    <View>
      <Text>Items in inventory: {JSON.stringify(data)}</Text>
    </View>
  )
}
