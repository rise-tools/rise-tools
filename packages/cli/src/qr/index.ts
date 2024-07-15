import bs58 from 'bs58'
import { Buffer } from 'buffer'
import qrcode from 'qrcode-terminal'

export type ConnectionPayload = {
  id: string
  label: string
  host: string
  path: string
}

export const createConnectionQR = (connection: ConnectionPayload) => {
  return new Promise((resolve) => {
    const connectInfo = bs58.encode(Buffer.from(JSON.stringify(connection)))
    const url = `rise://connect?connectInfo=${connectInfo}`
    qrcode.generate(url, { small: true }, function (qrcode) {
      resolve(qrcode)
    })
  })
}
