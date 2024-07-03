import { Link, QrCode as QRCodeIcon } from '@tamagui/lucide-icons'
import bs58 from 'bs58'
import { Buffer } from 'buffer'
import * as FileSystem from 'expo-file-system'
import * as Linking from 'expo-linking'
import { useRef } from 'react'
import { Share } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, XStack, YStack } from 'tamagui'

import { Connection } from '../connection'

type QRCodeRef = {
  toDataURL: (cb: (dataURL: string) => void) => void
}

export function QRCodeScreen({ connection }: { connection: Connection }) {
  const connectInfo = bs58.encode(Buffer.from(JSON.stringify(connection)))
  const deepLink = Linking.createURL('connect', { queryParams: { connectInfo } })

  const qrCodeRef = useRef<QRCodeRef>()

  const shareQRCode = async () => {
    if (!qrCodeRef.current) return
    /*
     * In order to share base64 string (such as QR Code), we must first
     * store it on the filesystem.
     * Source: https://github.com/expo/expo/issues/8448
     */
    const qrCodeUri = FileSystem.cacheDirectory + `qr-code-${connection.id}.png`

    const fileInfo = await FileSystem.getInfoAsync(qrCodeUri)
    if (fileInfo.exists) {
      Share.share({ url: qrCodeUri })
      return
    }

    qrCodeRef.current.toDataURL(async (dataURL) => {
      await FileSystem.writeAsStringAsync(qrCodeUri, dataURL, {
        encoding: FileSystem.EncodingType.Base64,
      })
      Share.share({ url: qrCodeUri })
    })
  }

  const shareLink = () => {
    Share.share({ message: deepLink })
  }

  return (
    <YStack flex={1} backgroundColor="$backgroundStrong">
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1}>
          <XStack flex={1} justifyContent="center" alignItems="center">
            <QRCode
              // QRCode does not accept ref as a prop, but exposes this prop instead
              getRef={(ref) => (qrCodeRef.current = ref)}
              value={deepLink}
              size={250}
            />
          </XStack>
          <XStack paddingHorizontal="$4" gap="$4" justifyContent="space-between">
            <Button flex={1} onPress={shareQRCode} theme="blue">
              <QRCodeIcon />
              Share Image
            </Button>
            <Button flex={1} onPress={shareLink} theme="gray">
              <Link />
              Share Link
            </Button>
          </XStack>
        </YStack>
      </SafeAreaView>
    </YStack>
  )
}
