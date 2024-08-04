import { channel } from 'expo-updates'

export const DEMO_WS_URL =
  channel === 'production' ? 'wss://demo.rise.tools' : 'ws://localhost:3005'

export const PRIVACY_POLICY_URL = 'https://app.getterms.io/view/Val1H/privacy/en-us'
