import { Paragraph, YStack } from '@react-native-templates/demo-ui'
import React from 'react'

export function NotFoundScreen() {
  return (
    <YStack f={1} jc="center" ai="center" space>
      <Paragraph ta="center" fow="700">
        Not Found
      </Paragraph>
    </YStack>
  )
}
