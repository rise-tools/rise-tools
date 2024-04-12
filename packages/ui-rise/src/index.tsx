import { Icon } from './Icon'
import { QRCode } from './QRCode'
import { SelectField } from './SelectField'
import { Slider, SliderField } from './Slider'
import { SortableList } from './SortableList'
import { SwitchField } from './SwitchField'

export const RiseComponents = {
  RiseQRCode: {
    component: QRCode,
    validator: QRCode.validate,
  },
  RiseIcon: {
    component: Icon,
    validator: Icon.validate,
  },
  RiseSelectField: {
    component: SelectField,
    validator: SelectField.validate,
  },
  RiseSlider: {
    component: Slider,
    validator: Slider.validate,
  },
  RiseSliderField: {
    component: SliderField,
    validator: SliderField.validate,
  },
  RiseSortableList: {
    component: SortableList,
    validator: SortableList.validate,
  },
  RiseSwitchField: {
    component: SwitchField,
    validator: SwitchField.validate,
  },
}

export { Icon, QRCode, SelectField, Slider, SliderField, SortableList, SwitchField }
