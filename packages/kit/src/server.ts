import { createComponentDefinition } from '@final-ui/react'

import type { DropdownButton } from './DropdownButton'
import type { Form, SubmitButton, TextField } from './Form'
import type { Icon } from './Icon'
import type { QRCode } from './QRCode'
import type { SelectField } from './SelectField'
import type { Slider, SliderField } from './Slider'
import type { SortableList } from './SortableList'
import type { SwitchField } from './SwitchField'

export const RiseQRCode = createComponentDefinition<typeof QRCode>('RiseQRCode')
export const RiseIcon = createComponentDefinition<typeof Icon>('RiseIcon')
export const RiseSelectField = createComponentDefinition<typeof SelectField>('RiseSelectField')
export const RiseDropdownButton =
  createComponentDefinition<typeof DropdownButton>('RiseDropdownButton')
export const RiseSlider = createComponentDefinition<typeof Slider>('RiseSlider')
export const RiseSliderField = createComponentDefinition<typeof SliderField>('RiseSliderField')
export const RiseSortableList = createComponentDefinition<typeof SortableList>('RiseSortableList')
export const RiseSwitchField = createComponentDefinition<typeof SwitchField>('RiseSwitchField')
export const RiseForm = createComponentDefinition<typeof Form>('RiseForm')
export const RiseTextField = createComponentDefinition<typeof TextField>('RiseTextField')
export const RiseSubmitButton = createComponentDefinition<typeof SubmitButton>('RiseSubmitButton')
