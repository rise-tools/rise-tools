import { Icon } from './Icon'
import { QRCode } from './QRCode'
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
  RiseSortableList: {
    component: SortableList,
    validator: SortableList.validate,
  },
  RiseSwitchField: {
    component: SwitchField,
    validator: SwitchField.validate,
  },
}
