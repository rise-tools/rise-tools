import {
  clearTerminal,
  debug,
  generateQRCode,
  getConnectionURL,
  getHost,
  highlight,
  link,
  logo,
  spinner,
  startTunnel,
} from '@rise-tools/cli'
import dedent from 'dedent'

export async function setupRiseTools({
  protocol,
  port,
  tunnel,
}: {
  protocol: string
  port: number
  tunnel?: boolean
}) {
  const host = (await getHost()) || 'localhost'

  const localUrl = `${protocol}://${host}:${port}`

  clearTerminal()

  console.log(logo())
  console.log(`Listening on ${highlight(localUrl)}`)

  let deepLinkUrl = localUrl
  if (tunnel) {
    try {
      const tunnelUrl = await spinner('Starting the tunnel...', () => startTunnel(port))
      console.log(`Access anywhere on ${highlight(tunnelUrl)}`)

      deepLinkUrl = tunnelUrl
    } catch (e) {
      console.log(
        debug(
          'Failed to connect to Rise Proxy. You can access the server only on your local network.'
        )
      )
    }
  }

  console.log('')

  const deepLink = await getConnectionURL(deepLinkUrl)

  console.log(dedent`
    To preview your app in the Rise Playground, scan the QR code:
    ${await generateQRCode(deepLink)}

    Or open the following link on your device:
    ${link(deepLink)}
  `)
}
