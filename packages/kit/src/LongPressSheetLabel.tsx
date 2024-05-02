import React from 'react'
import { Label, Sheet, YStack } from 'tamagui'
import { z } from 'zod'

const LongPressSheetLabelProps = z.object({
  children: z.any().optional(),
  labelProps: z.any().optional(),
  sheet: z.any().optional(),
})

export function LongPressSheetLabel(props: z.infer<typeof LongPressSheetLabelProps>) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Label
        {...props.labelProps}
        onPress={() => {
          setOpen(true)
        }}
      >
        {props.children}
      </Label>

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
          <YStack gap="$3">{props.sheet}</YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}

LongPressSheetLabel.validate = (props: any) => {
  return LongPressSheetLabelProps.parse(props)
}
