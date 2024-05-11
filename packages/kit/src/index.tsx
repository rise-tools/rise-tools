import { DropdownButton } from './DropdownButton'
import { Form, SubmitButton, TextField } from './Form'
import { Icon } from './Icon'
import { QRCode } from './QRCode'
import { SelectField } from './SelectField'
import { Slider, SliderField } from './Slider'
import { SortableList } from './SortableList'
import { SwitchField } from './SwitchField'

// tbd: enforce same components are exported
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
  RiseDropdownButton: {
    component: DropdownButton,
    validator: DropdownButton.validate,
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
  RiseForm: {
    component: Form,
    validator: Form.validate,
  },
  RiseTextField: {
    component: TextField,
    validator: TextField.validate,
  },
  RiseSubmitButton: {
    component: SubmitButton,
    validator: SubmitButton.validate,
  },
}
