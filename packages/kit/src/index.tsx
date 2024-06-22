import QRCode from 'react-native-qrcode-svg'

import { BottomSheet, BottomSheetCloseButton, BottomSheetTriggerButton } from './client/BottomSheet'
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
  '@rise-tools/kit/BottomSheetCloseButton': {
    component: BottomSheetCloseButton,
  },
  '@rise-tools/kit/BottomSheetTriggerButton': {
    component: BottomSheetTriggerButton,
  },
}
