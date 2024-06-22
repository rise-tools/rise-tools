import { createComponentDefinition } from '@rise-tools/react'
import type RNQRCode from 'react-native-qrcode-svg'

import type { RNDraggableFlatList } from '../client/DraggableFlatList'

/** Bindings to client-side components */
export const QRCode = createComponentDefinition<typeof RNQRCode>('RNQRCode')
export const DraggableFlatList =
  createComponentDefinition<typeof RNDraggableFlatList>('RNDraggableFlatList')
