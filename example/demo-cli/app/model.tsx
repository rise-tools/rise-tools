import { YStack } from '@rise-tools/kitchen-sink/server'
import React from 'react'

import { Groceries } from './_sections/Groceries'
import { Restaurants } from './_sections/Restaurants'
import { Survey } from './_sections/Survey'
import { Taxi } from './_sections/Taxi'

export default function UI() {
  return (
    <YStack gap="$4" backgroundColor="$background">
      <Survey />
      <Groceries />
      <Restaurants />
      <Taxi />
    </YStack>
  )
}
