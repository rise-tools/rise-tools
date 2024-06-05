import { createComponentDefinition } from '@final-ui/react'

import type { Icon } from './Icon'
import type { QRCode } from './QRCode'
import type { SortableList } from './SortableList'
import type { SwitchField } from './SwitchField'

export const RiseQRCode = createComponentDefinition<typeof QRCode>('RiseQRCode')
export const RiseIcon = createComponentDefinition<typeof Icon>('RiseIcon')
export const RiseSortableList = createComponentDefinition<typeof SortableList>('RiseSortableList')
export const RiseSwitchField = createComponentDefinition<typeof SwitchField>('RiseSwitchField')

/** fully server-side components */
export { DropdownButton as RiseDropdownButton } from './DropdownButton'
export { SelectField as RiseSelectField } from './SelectField'
export { Slider as RiseSlider } from './Slider'
