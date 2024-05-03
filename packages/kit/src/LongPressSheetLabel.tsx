import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo, useRef } from 'react'
import { Label, YStack } from 'tamagui'
import { z } from 'zod'

const LongPressSheetLabelProps = z.object({
  children: z.any().optional(),
  labelProps: z.any().optional(),
  sheet: z.any().optional(),
})

export function LongPressSheetLabel(props: z.infer<typeof LongPressSheetLabelProps>) {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  // variables
  const snapPoints = useMemo(() => ['50%'], [])

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <YStack>
      <Label {...props.labelProps} onPress={handlePresentModalPress}>
        {props.children}
      </Label>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        enableContentPanningGesture={true}
        activeOffsetY={[-1, 1]}
        failOffsetX={[-5, 5]}
        snapPoints={snapPoints}
      >
        <BottomSheetView>
          <YStack padding="$2">{props.sheet}</YStack>
        </BottomSheetView>
      </BottomSheetModal>
    </YStack>
  )
}

LongPressSheetLabel.validate = (props: any) => {
  return LongPressSheetLabelProps.parse(props)
}
