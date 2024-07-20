import {
  clearTerminal,
  generateQRCode,
  getConnectionURL,
  getHost,
  highlight,
  link,
  logo,
  startTunnel,
} from '@rise-tools/cli'
import dedent from 'dedent'

export async function printInstructions({ protocol, port }: { protocol: string; port: number }) {
  const host = (await getHost()) || 'localhost'
  const localUrl = `${protocol}://${host}:${port}`

  const remoteUrl = `${protocol}://${await startTunnel(port)}`

  clearTerminal()

  console.log(logo())

  const deepLink = await getConnectionURL(remoteUrl)

  console.log(dedent`
    Listening on ${highlight(localUrl)}
    Access anywhere on ${highlight(remoteUrl)}  

    To preview your app in the Rise Playground, scan the QR code:
    ${await generateQRCode(deepLink)}

    Or open the following link on your device:
    ${link(deepLink)}  
  `)
}
