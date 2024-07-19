import bs58 from 'bs58'
import { findUp } from 'find-up'
import { internalIpV4 } from 'internal-ip'
import qr from 'qrcode-terminal'
import { fs } from 'zx'

export async function getHost() {
  return internalIpV4()
}

export async function generateQRCode(url: string) {
  return new Promise((resolve) => qr.generate(url, { small: true }, resolve))
}

async function getConnectionInfo() {
  const packageJsonPath = await findUp('package.json')
  if (!packageJsonPath) {
    throw new Error('Could not find package.json. Are you in a project directory?')
  }

  const { name } = await fs.readJSON(packageJsonPath)
  return {
    label: name,
    id: name,
    path: '',
  }
}

export async function getConnectionURL(host: string) {
  const connectionInfo = bs58.encode(
    Buffer.from(
      JSON.stringify({
        ...(await getConnectionInfo()),
        host,
      })
    )
  )
  return `rise://connect?connectInfo=${connectionInfo}`
}
