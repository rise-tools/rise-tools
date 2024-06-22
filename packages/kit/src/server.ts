import { createComponentDefinition } from '@rise-tools/react'

import type {
  BottomSheet as KitBottomSheet,
  BottomSheetClose as KitBottomSheetClose,
  BottomSheetTrigger as KitBottomSheetTrigger,
} from './client/BottomSheet'
import type { RNDraggableFlatList } from './client/DraggableFlatList'
import { RNFlatList } from './client/FlatList'

export const DraggableFlatList = createComponentDefinition<typeof RNDraggableFlatList>(
  '@rise-tools/kit/RNDraggableFlatList'
)
export const FlatList = createComponentDefinition<typeof RNFlatList>('@rise-tools/kit/FlatList')

export const BottomSheet = createComponentDefinition<typeof KitBottomSheet>(
  '@rise-tools/kit/BottomSheet'
)
export const BottomSheetClose = createComponentDefinition<typeof KitBottomSheetClose>(
  '@rise-tools/kit/BottomSheetClose'
)
export const BottomSheetTrigger = createComponentDefinition<typeof KitBottomSheetTrigger>(
  '@rise-tools/kit/BottomSheetTrigger'
)
