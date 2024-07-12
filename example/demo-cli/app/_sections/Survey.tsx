import { navigate } from '@rise-tools/kit-react-navigation/server'
import { Button, H3, LucideIcon, Theme, XStack, YStack } from '@rise-tools/kitchen-sink/server'
import React from 'react'

export function Survey() {
  return (
    <Theme name="green_active">
      <XStack backgroundColor="$backgroundFocus" padding="$4" gap="$4" alignItems="center">
        <LucideIcon icon="MessageCircleHeart" size="$6" color="white" />
        <YStack justifyContent="flex-start" gap="$2">
          <H3 color="white">Do you like the App?</H3>
          <Button
            fontSize="$5"
            fontWeight="bold"
            color="white"
            onPress={navigate('delivery:feedback-form')}
          >
            Send Feedback
          </Button>
        </YStack>
      </XStack>
    </Theme>
  )
}
