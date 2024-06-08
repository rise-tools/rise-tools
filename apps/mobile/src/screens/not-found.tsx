import React from 'react'
import { Paragraph, YStack } from 'tamagui'

export function NotFoundScreen() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
      <Paragraph textAlign="center" fontWeight="700">
        Not Found
      </Paragraph>
    </YStack>
  )
}
