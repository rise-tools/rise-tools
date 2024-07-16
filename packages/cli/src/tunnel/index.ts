export const isTunnel = false

export const getTunnelAddress = () => {
  return 'localhost'
}

export const getIsTunnelConnected = () => {
  return !!isTunnel
}

export const connectTunnel = () => {
  isTunnel = true
  return isTunnel
}
