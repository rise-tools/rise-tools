import { event, setStateAction, state } from '@final-ui/react'
import {
  Button,
  Sheet,
  SheetFrame,
  SheetHandle,
  SheetOverlay,
  YStack,
} from '@final-ui/tamagui/server'

type Props = {
  onSelect?: (key: string) => void
  button?: JSX.Element
  options?: {
    key: string
    label: string
  }[]
}

export function DropdownButton(props: Props) {
  const isOpen = state(false)
  return (
    <>
      <Button asChild={true} onPress={setStateAction(isOpen, true)}>
        {props.button}
      </Button>
      <Sheet
        forceRemoveScrollEnabled={isOpen}
        modal={true}
        open={open}
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
                  onPress={
                    typeof props.onSelect === 'function'
                      ? event(props.onSelect, { actions: [setStateAction(isOpen, false)] })
                      : setStateAction(isOpen, false)
                  }
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
