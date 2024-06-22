import QRCode from 'react-native-qrcode-svg'

import { BottomSheet, BottomSheetClose, BottomSheetTrigger } from './client/BottomSheet'
import { RNDraggableFlatList } from './client/DraggableFlatList'

export const RiseComponents = {
  RNDraggableFlatList: {
    component: RNDraggableFlatList,
  },
  RNQRCode: {
    component: QRCode,
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
