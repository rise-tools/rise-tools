import { BottomSheet, BottomSheetClose, BottomSheetTrigger } from './client/BottomSheet'
import { RNDraggableFlatList } from './client/DraggableFlatList'
import { RNFlatList } from './client/FlatList'

export const RiseComponents = {
  '@rise-tools/kit/FlatList': {
    component: RNFlatList,
  },
  '@rise-tools/kit/RNDraggableFlatList': {
    component: RNDraggableFlatList,
  },
  '@rise-tools/kit/BottomSheet': {
    component: BottomSheet,
  },
  '@rise-tools/kit/BottomSheetClose': {
    component: BottomSheetClose,
  },
  '@rise-tools/kit/BottomSheetTrigger': {
    component: BottomSheetTrigger,
  },
}
