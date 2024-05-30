import { event, setStateAction, state } from '@final-ui/react'
import {
  Button,
  Sheet,
  SheetFrame,
  SheetHandle,
  SheetOverlay,
  YStack,
} from '@final-ui/tamagui/server'
import React from 'react'

type DropdownButtonProps = {
  id?: string
  onSelect?: (key: string) => void
  // tbd: fix
  buttonProps?: any
  options?: {
    key: string
    label: string
    icon?: any
  }[]
}

export function DropdownButton(props: DropdownButtonProps) {
  const isOpen = state(false)
  return (
    <>
      <Button {...props.buttonProps} onPress={setStateAction(isOpen, true)} />
      <Sheet
        forceRemoveScrollEnabled={isOpen}
        modal={true}
        open={isOpen}
        onOpenChange={setStateAction(isOpen)}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="medium"
      >
        <SheetOverlay animation="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <SheetHandle />
        <SheetFrame padding="$4" justifyContent="center" space="$5">
          <YStack gap="$3">
            {props.options?.map((item) => {
              return (
                <Button
                  key={item.key}
                  onPress={event(
                    () => {
                      props.onSelect?.(item.key)
                    },
                    setStateAction(isOpen, false)
                  )}
                >
                  {item.label}
                </Button>
              )
            })}
          </YStack>
        </SheetFrame>
      </Sheet>
    </>
  )
}
