import bs58 from 'bs58'
import { Buffer } from 'buffer'
import * as Linking from 'expo-linking'
import QRCode from 'react-native-qrcode-svg'
import { Text, YStack } from 'tamagui'

import { Connection } from '../connection'

export function QRCodeScreen({ connection }: { connection: Connection }) {
  const connectionInfo = bs58.encode(Buffer.from(JSON.stringify(connection)))
  const deepLink = Linking.createURL('connection', { queryParams: { connectionInfo } })
  return (
    <YStack>
      <Text>Share</Text>
      <QRCode value={deepLink} size={200} />
      <Text>{deepLink}</Text>
    </YStack>
  )
}
