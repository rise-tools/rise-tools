import { bringOnline } from 'prolink-connect'

console.info('Bringing ProLink online')
bringOnline().then((network) => {
  console.info('ProLink is online')
  console.log('isConnected', network.isConnected())
  setInterval(() => {
    // console.log('isConnected', network.isConnected())
  }, 1000)
  network.deviceManager.on('disconnected', (device) => {
    console.log('device gone')
  })
  network.deviceManager.on('announced', (device) => {
    console.log('announced device', device.name, device.type)
  })
  // Once online we can listen for appearning on the network
  network.deviceManager.on('connected', (device) => {
    console.log('New device on network:', device)
  })
})

export const prolink = {
  handleBeat: (handler: () => void) => {},
}
