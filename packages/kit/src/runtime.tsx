import React from 'react'

import {
  IconSchema,
  QRCodeSchema,
  SelectFieldSchema,
  SliderFieldSchema,
  SliderSchema,
  SortableListSchema,
  SwitchFieldSchema,
} from '.'
import { Icon } from './Icon'
import { QRCode } from './QRCode'
import { SelectField } from './SelectField'
import { Slider, SliderField } from './Slider'
import { SortableList } from './SortableList'
import { SwitchField } from './SwitchField'

// tbd: this could/should be a function with async imports to optimise dev (at least)
export const RiseComponents = {
  RiseQRCode: {
    component: QRCode,
    validator: QRCodeSchema.parse,
  },
  RiseIcon: {
    component: Icon,
    validator: IconSchema.parse,
  },
  RiseSelectField: {
    component: SelectField,
    validator: SelectFieldSchema.parse,
  },
  RiseSlider: {
    component: Slider,
    validator: SliderSchema.parse,
  },
  RiseSliderField: {
    component: SliderField,
    validator: SliderFieldSchema.parse,
  },
  RiseSortableList: {
    component: SortableList,
    validator: SortableListSchema.parse,
  },
  RiseSwitchField: {
    component: SwitchField,
    validator: SwitchFieldSchema.parse,
  },
}
