import { ComponentRegistry } from '@rise-tools/react'
import * as RN from 'react-native'

import { RNFlatList, RNSectionList } from './lists'

export const ReactNativeComponents: ComponentRegistry = {
  'rise-tools/kit-react-native/ActivityIndicator': {
    component: RN.ActivityIndicator,
  },
  'rise-tools/kit-react-native/Button': {
    component: RN.Button,
  },
  'rise-tools/kit-react-native/Modal': {
    component: RN.Modal,
  },
  'rise-tools/kit-react-native/KeyboardAvoidingView': {
    component: RN.KeyboardAvoidingView,
  },
  'rise-tools/kit-react-native/Pressable': {
    component: RN.Pressable,
  },
  'rise-tools/kit-react-native/RefreshControl': {
    component: RN.RefreshControl,
  },
  'rise-tools/kit-react-native/ScrollView': {
    component: RN.ScrollView,
  },
  'rise-tools/kit-react-native/Image': {
    component: RN.Image,
  },
  'rise-tools/kit-react-native/ImageBackground': {
    component: RN.ImageBackground,
  },
  'rise-tools/kit-react-native/StatusBar': {
    component: RN.StatusBar,
  },
  'rise-tools/kit-react-native/Switch': {
    component: RN.Switch,
  },
  'rise-tools/kit-react-native/FlatList': {
    component: RNFlatList,
  },
  'rise-tools/kit-react-native/SectionList': {
    component: RNSectionList,
  },
  'rise-tools/kit-react-native/Text': {
    component: RN.Text,
  },
  'rise-tools/kit-react-native/TextInput': {
    component: RN.TextInput,
  },
  'rise-tools/kit-react-native/TouchableHighlight': {
    component: RN.TouchableHighlight,
  },
  'rise-tools/kit-react-native/TouchableOpacity': {
    component: RN.TouchableOpacity,
  },
  'rise-tools/kit-react-native/TouchableNativeFeedback': {
    component: RN.TouchableNativeFeedback,
  },
  'rise-tools/kit-react-native/TouchableWithoutFeedback': {
    component: RN.TouchableWithoutFeedback,
  },
  'rise-tools/kit-react-native/View': {
    component: RN.View,
  },
}
