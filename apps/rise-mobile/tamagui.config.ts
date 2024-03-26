import { config } from '@react-native-templates/demo-ui'

type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

export default config
