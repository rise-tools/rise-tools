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
