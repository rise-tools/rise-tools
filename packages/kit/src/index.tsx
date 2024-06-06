import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import QRCode from 'react-native-qrcode-svg'

import { Icon } from './Icon'

export const RiseComponents = {
  RNDraggableFlatList: {
    component: DraggableFlatList,
  },
  RNScaleDecorator: {
    component: ScaleDecorator,
  },
  RNQRCode: {
    component: QRCode,
  },
  RiseIcon: {
    component: Icon,
    validator: Icon.validate,
  },
}
