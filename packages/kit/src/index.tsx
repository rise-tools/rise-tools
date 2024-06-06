import QRCode from 'react-native-qrcode-svg'

import { RNDraggableFlatList } from './client/DraggableFlatList'
import { Icon } from './client/Icon'

export const RiseComponents = {
  RNDraggableFlatList: {
    component: RNDraggableFlatList,
  },
  RNQRCode: {
    component: QRCode,
  },
  RiseIcon: {
    component: Icon,
    validator: Icon.validate,
  },
}
