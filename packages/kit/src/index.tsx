import { AnimatedProgress, animatedProgressPropsSchema } from './client/AnimatedProgress'
import { BottomSheet, BottomSheetCloseButton, BottomSheetTriggerButton } from './client/BottomSheet'
import { RNDraggableFlatList } from './client/DraggableFlatList'
import { RNFlatList } from './client/FlatList'
import { SmoothSlider, smoothSliderPropsSchema } from './client/SmoothSlider'

export const RiseComponents = {
  'rise-tools/kit/FlatList': {
    component: RNFlatList,
  },
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
  'rise-tools/kit/AnimatedProgress': {
    component: AnimatedProgress,
    validate: animatedProgressPropsSchema.parse,
  },
  'rise-tools/kit/SmoothSlider': {
    component: SmoothSlider,
    validate: smoothSliderPropsSchema.parse,
  },
}
