import React from 'react'
import RNQRCode from 'react-native-qrcode-svg'
import { Spinner } from 'tamagui'

import { QRCodeProps } from '.'

// tbd: provide web support
export function QRCode(props: QRCodeProps) {
  if (!props.value) return <Spinner />
  return <RNQRCode color="white" backgroundColor="black" value={props.value} />
}
