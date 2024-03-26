import { config } from '@react-native-templates/demo-ui'

type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

// TBD: do not use demo-ui Tamagui configuration, but prefer custom one unless rendering demo-ui (which is not the case)
export default config
