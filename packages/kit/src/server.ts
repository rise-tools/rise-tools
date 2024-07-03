import { createComponentDefinition } from '@rise-tools/react'

import type {
  BottomSheet as KitBottomSheet,
  BottomSheetCloseButton as KitBottomSheetCloseButton,
  BottomSheetTriggerButton as KitBottomSheetTriggerButton,
} from './client/BottomSheet'
import type { RNDraggableFlatList } from './client/DraggableFlatList'
import { RNFlatList } from './client/FlatList'

export const DraggableFlatList = createComponentDefinition<typeof RNDraggableFlatList>(
  'rise-tools/kit/RNDraggableFlatList'
)
export const FlatList = createComponentDefinition<typeof RNFlatList>('rise-tools/kit/FlatList')
export const BottomSheet = createComponentDefinition<typeof KitBottomSheet>(
  'rise-tools/kit/BottomSheet'
)
export const BottomSheetCloseButton = createComponentDefinition<typeof KitBottomSheetCloseButton>(
  'rise-tools/kit/BottomSheetCloseButton'
)
export const BottomSheetTriggerButton = createComponentDefinition<
  typeof KitBottomSheetTriggerButton
>('rise-tools/kit/BottomSheetTriggerButton')
