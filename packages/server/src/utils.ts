import {
  clearTerminal,
  debug,
  generateQRCode,
  getConnectionURL,
  getHost,
  highlight,
  link,
  logo,
  safePromise,
  startTunnel,
} from '@rise-tools/cli'
import dedent from 'dedent'

export async function printInstructions({ protocol, port }: { protocol: string; port: number }) {
  const host = (await getHost()) || 'localhost'

  const [tunnelHost, tunnelError] = await safePromise(startTunnel(port))

  const localUrl = `${protocol}://${host}:${port}`

  const remoteUrl = `${protocol}://${tunnelHost}`

  clearTerminal()

  console.log(logo())

  const deepLink = await getConnectionURL(remoteUrl ?? localUrl)

  console.log(dedent`
    Listening on ${highlight(localUrl)}
    Access anywhere on ${tunnelError ? debug('Tunnel available. ' + tunnelError.message) : highlight(remoteUrl)}

    To preview your app in the Rise Playground, scan the QR code:
    ${await generateQRCode(deepLink)}

    Or open the following link on your device:
    ${link(deepLink)}
  `)
}
