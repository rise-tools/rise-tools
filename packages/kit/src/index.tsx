import { assert } from 'typia'

import { Icon, IconProps } from './Icon'
import { QRCode, QRCodeProps } from './QRCode'
import { SelectField, SelectFieldProps } from './SelectField'
import { Slider, SliderField, SliderFieldProps, SliderProps } from './Slider'
import { SortableList, SortableListProps } from './SortableList'
import { SwitchField, SwitchFieldProps } from './SwitchField'

export const RiseComponents = {
  RiseQRCode: {
    component: QRCode,
    validator: (props: any) => assert<QRCodeProps>(props),
  },
  RiseIcon: {
    component: Icon,
    validator: (props: any) => assert<IconProps>(props),
  },
  RiseSelectField: {
    component: SelectField,
    validator: (props: any) => assert<SelectFieldProps>(props),
  },
  RiseSlider: {
    component: Slider,
    validator: (props: any) => assert<SliderProps>(props),
  },
  RiseSliderField: {
    component: SliderField,
    validator: (props: any) => assert<SliderFieldProps>(props),
  },
  RiseSortableList: {
    component: SortableList,
    validator: (props: any) => assert<SortableListProps>(props),
  },
  RiseSwitchField: {
    component: SwitchField,
    validator: (props: any) => assert<SwitchFieldProps>(props),
  },
}
