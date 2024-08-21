import { AnimatedProgress, animatedProgressPropsSchema } from './client/AnimatedProgress'
import {
  BottomSheet,
  BottomSheetCloseButton,
  BottomSheetSubmitButton,
  BottomSheetTriggerButton,
} from './client/BottomSheet'
import { RNDraggableFlatList } from './client/DraggableFlatList'
import { SmoothSlider, smoothSliderPropsSchema } from './client/SmoothSlider'

export const RiseComponents = {
  'rise-tools/kit/RNDraggableFlatList': {
    component: RNDraggableFlatList,
  },
  'rise-tools/kit/BottomSheet': {
    component: BottomSheet,
  },
  'rise-tools/kit/BottomSheetCloseButton': {
    component: BottomSheetCloseButton,
  },
  'rise-tools/kit/BottomSheetTriggerButton': {
    component: BottomSheetTriggerButton,
  },
  'rise-tools/kit/BottomSheetSubmitButton': {
    component: BottomSheetSubmitButton,
  },
  'rise-tools/kit/AnimatedProgress': {
    component: AnimatedProgress,
    validate: animatedProgressPropsSchema.parse,
  },
  'rise-tools/kit/SmoothSlider': {
    component: SmoothSlider,
    validate: smoothSliderPropsSchema.parse,
  },
}
