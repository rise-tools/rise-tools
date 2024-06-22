import { createComponentDefinition } from '@rise-tools/react'

import type RNQRCode from 'react-native-qrcode-svg'

import type {
  BottomSheet as KitBottomSheet,
  BottomSheetCloseButton as KitBottomSheetCloseButton,
  BottomSheetTriggerButton as KitBottomSheetTriggerButton,
} from './client/BottomSheet'
import type { RNDraggableFlatList } from './client/DraggableFlatList'

export const DraggableFlatList =
  createComponentDefinition<typeof RNDraggableFlatList>('RNDraggableFlatList')

export const BottomSheet = createComponentDefinition<typeof KitBottomSheet>(
  '@rise-tools/kit/BottomSheet'
)
export const BottomSheetCloseButton = createComponentDefinition<typeof KitBottomSheetCloseButton>(
  '@rise-tools/kit/BottomSheetClose'
)
export const BottomSheetTriggerButton = createComponentDefinition<
  typeof KitBottomSheetTriggerButton
>('@rise-tools/kit/BottomSheetTrigger')
