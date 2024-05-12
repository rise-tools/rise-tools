import React from 'react'
import { Button, Sheet, YStack } from 'tamagui'
import { z } from 'zod'

const DropdownButtonProps = z.object({
  id: z.string().optional(),
  onSelect: z.function().args(z.string()).optional(),
  buttonProps: z.any().optional(),
  options: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        icon: z.any().optional(),
      })
    )
    .optional(),
})

export function DropdownButton(props: z.infer<typeof DropdownButtonProps>) {
  const { options } = props
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button
        {...props.buttonProps}
        onPress={() => {
          setOpen(true)
        }}
      />
      <Sheet
        forceRemoveScrollEnabled={open}
        modal={true}
        open={open}
        onOpenChange={setOpen}
        // snapPoints={[50]}
        // snapPointsMode={snapPointsMode}
        dismissOnSnapToBottom
        // position={position}
        // onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay animation="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" justifyContent="center" space="$5">
          <YStack gap="$3">
            {options?.map((item) => {
              return (
                <Button
                  key={item.key}
                  onPress={() => {
                    setOpen(false)
                    props.onSelect?.(item.key)
                  }}
                >
                  {item.label}
                </Button>
              )
            })}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

DropdownButton.validate = (props: any) => {
  return DropdownButtonProps.parse(props)
}
