// import zrok from '@openziti/zrok'

// export const createTunnel = () => {
//   const startTunnel = async () => {
//     const root = zrok.Load()
//     await zrok.init(root).catch((err: Error) => {
//       console.error(err)
//       return process.exit(1)
//     })
//     const shr = await zrok.CreateShare(
//       root,
//       new zrok.ShareRequest(zrok.TCP_TUNNEL_BACKEND_MODE, zrok.PRIVATE_SHARE_MODE, 'pastebin', [])
//     )

//     zrok.listener(
//       shr.Token,
//       (data: any) => {
//         // listenCallback
//       },
//       (data: any) => {
//         // listenClientCallback
//       },
//       (data: any) => {
//         // clientConnectCallback
//         // when we receive a client connection, then write the data to them
//         zrok.write(data.client, buf, (data: any) => {
//           // writeCallback
//         })
//       },
//       (data: any) => {
//         // clientDataCallback
//       }
//     )
//   }

//   return {
//     startTunnel,
//   }
// }

// createTunnel().startTunnel().then(console.log)

import ziti from '@openziti/ziti-sdk-nodejs'

async function main() {
  // Somehow provide path to identity file, e.g. via env var
  const zitiIdentityFile = process.env.ZITI_IDENTITY_FILE
  // Authenticate ourselves onto the Ziti network
  await ziti.init(zitiIdentityFile).catch((err) => {
    /* probably exit */
  })

  const on_resp_data = (obj) => {
    console.log(`response is: ${obj.body.toString('utf8')}`)
  }

  // Perform an HTTP GET request to a dark OpenZiti web service
  ziti.httpRequest(
    'myDarkWebService', // OpenZiti Service name or HTTP origin part of the URL
    undefined, // schemeHostPort parm is mutually-exclusive with serviceName parm
    'GET',
    '/', // path part of the URL including query params
    ['Accept: application/json'], // headers
    undefined, // optional on_req cb
    undefined, // optional on_req_data cb
    on_resp_data // optional on_resp_data cb
  )
}
main()
