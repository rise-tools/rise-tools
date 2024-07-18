import bs58 from 'bs58'
import { internalIpV4 } from 'internal-ip'
import qr from 'qrcode-terminal'

export async function getHost() {
  return internalIpV4()
}

export function generateQRCode(url: string) {
  return new Promise((resolve) => qr.generate(url, { small: true }, resolve))
}

export function getConnectionURL(host: string) {
  const connectionInfo = bs58.encode(
    Buffer.from(
      JSON.stringify({
        host,
        // tbd: get this value from package.json
        id: '',
        label: '',
        path: '',
      })
    )
  )
  return `rise://connect?connectInfo=${connectionInfo}`
}
