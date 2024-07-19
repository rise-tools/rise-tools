import { generateQRCode, getConnectionURL, getHost, highlight, link, logo } from '@rise-tools/cli'
import dedent from 'dedent'

export async function printInstructions({ protocol, port }: { protocol: string; port: number }) {
  const host = (await getHost()) || 'localhost'
  const url = `${protocol}://${host}:${port}`

  console.log(logo())

  if (host === 'localhost') {
    console.log(`Listening on ${highlight(url)}`)
    return
  }

  const deepLink = await getConnectionURL(url)

  console.log(dedent`
    Listening on ${highlight(url)}

    To preview your app in the Rise Playground, scan the QR code:
    ${await generateQRCode(deepLink)}

    Or open the following link on your device:
    ${link(deepLink)}  
  `)
}
