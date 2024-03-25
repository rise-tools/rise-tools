import { config } from '@my/config'

export type Conf = typeof config

declare module '@react-native-templates/demo-ui' {
  interface TamaguiCustomConfig extends Conf {}
}
