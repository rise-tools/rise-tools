import React from 'react'
import RNQRCode from 'react-native-qrcode-svg'
import { Spinner } from 'tamagui'
import { z } from 'zod'

const QRCodeProps = z.object({
  value: z.string().nullable().optional(),
})

// tbd: provide web support
export function QRCode(props: z.infer<typeof QRCodeProps>) {
  if (!props.value) return <Spinner />
  return <RNQRCode color="white" backgroundColor="black" value={props.value} />
}

QRCode.validate = (props: any) => {
  return QRCodeProps.parse(props)
}
