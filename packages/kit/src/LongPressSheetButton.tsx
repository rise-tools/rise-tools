import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo, useRef } from 'react'
import { Button, YStack } from 'tamagui'
import { z } from 'zod'

const LongPressSheetButtonProps = z.object({
  children: z.any().optional(),
  buttonProps: z.any().optional(),
  onPress: z.any().optional(),
  sheet: z.any().optional(),
})

export function LongPressSheetButton(props: z.infer<typeof LongPressSheetButtonProps>) {
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
      <Button {...props.buttonProps} onLongPress={handlePresentModalPress} onPress={props.onPress}>
        {props.children}
      </Button>
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

LongPressSheetButton.validate = (props: any) => {
  return LongPressSheetButtonProps.parse(props)
}
