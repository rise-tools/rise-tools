import { createComponentDefinition } from '@final-ui/react'
import type RNQRCode from 'react-native-qrcode-svg'

import type { RNDraggableFlatList } from '../client/DraggableFlatList'
import type { LucideIcon } from '../client/Icon'

/** bindings to client-side components */
export const QRCode = createComponentDefinition<typeof RNQRCode>('RNQRCode')
export const DraggableFlatList =
  createComponentDefinition<typeof RNDraggableFlatList>('RNDraggableFlatList')
export const Icon = createComponentDefinition<typeof LucideIcon>('LucideIcon')

/** fully server-side components */
export { DropdownButton } from './DropdownButton'
export { SelectField } from './SelectField'
export { Slider } from './Slider'
export { SwitchField } from './SwitchField'
