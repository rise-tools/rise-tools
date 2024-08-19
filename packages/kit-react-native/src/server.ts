import { createComponentDefinition } from '@rise-tools/react'
import * as RN from 'react-native'

export const ActivityIndicator = createComponentDefinition<typeof RN.ActivityIndicator>(
  'rise-tools/kit-react-native/ActivityIndicator'
)

export const Button = createComponentDefinition<typeof RN.Button>(
  'rise-tools/kit-react-native/Button'
)

export const Modal = createComponentDefinition<typeof RN.Modal>('rise-tools/kit-react-native/Modal')

export const KeyboardAvoidingView = createComponentDefinition<typeof RN.KeyboardAvoidingView>(
  'rise-tools/kit-react-native/KeyboardAvoidingView'
)

export const Pressable = createComponentDefinition<typeof RN.Pressable>(
  'rise-tools/kit-react-native/Pressable'
)

export const RefreshControl = createComponentDefinition<typeof RN.RefreshControl>(
  'rise-tools/kit-react-native/RefreshControl'
)

export const ScrollView = createComponentDefinition<typeof RN.ScrollView>(
  'rise-tools/kit-react-native/ScrollView'
)

export const SectionList = createComponentDefinition<typeof RN.SectionList>(
  'rise-tools/kit-react-native/SectionList'
)

export const StatusBar = createComponentDefinition<typeof RN.StatusBar>(
  'rise-tools/kit-react-native/StatusBar'
)

export const Switch = createComponentDefinition<typeof RN.Switch>(
  'rise-tools/kit-react-native/Switch'
)

export const Text = createComponentDefinition<typeof RN.Text>('rise-tools/kit-react-native/Text')

export const TextInput = createComponentDefinition<typeof RN.TextInput>(
  'rise-tools/kit-react-native/TextInput'
)

export const TouchableHighlight = createComponentDefinition<typeof RN.TouchableHighlight>(
  'rise-tools/kit-react-native/TouchableHighlight'
)

export const TouchableOpacity = createComponentDefinition<typeof RN.TouchableOpacity>(
  'rise-tools/kit-react-native/TouchableOpacity'
)

export const TouchableWithoutFeedback = createComponentDefinition<
  typeof RN.TouchableWithoutFeedback
>('rise-tools/kit-react-native/TouchableWithoutFeedback')

export const TouchableNativeFeedback = createComponentDefinition<typeof RN.TouchableNativeFeedback>(
  'rise-tools/kit-react-native/TouchableNativeFeedback'
)

export const View = createComponentDefinition<typeof RN.View>('rise-tools/kit-react-native/View')

export const VirtualizedList = createComponentDefinition<typeof RN.VirtualizedList>(
  'rise-tools/kit-react-native/VirtualizedList'
)
