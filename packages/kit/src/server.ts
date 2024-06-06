import { createComponentDefinition } from '@final-ui/react'
import type RNDraggableFlatList from 'react-native-draggable-flatlist'
import type { ScaleDecorator as RNSCaleDecorator } from 'react-native-draggable-flatlist'
import type RNQRCode from 'react-native-qrcode-svg'

import type { Icon } from './Icon'

/** bindings to client-side components */
export const QRCode = createComponentDefinition<typeof RNQRCode>('RNQRCode')
export const DraggableFlatList =
  createComponentDefinition<typeof RNDraggableFlatList>('RNDraggableFlatList')
export const ScaleDecorator = createComponentDefinition<typeof RNSCaleDecorator>('RNSCaleDecorator')

export const RiseIcon = createComponentDefinition<typeof Icon>('RiseIcon')

/** fully server-side components */
export { DropdownButton } from './DropdownButton'
export { SelectField } from './SelectField'
export { Slider } from './Slider'
export { SwitchField } from './SwitchField'
