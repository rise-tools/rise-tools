import internalIp from 'internal-ip'

import { getTunnelAddress, isTunnel } from './tunnel'

function getIpAddress(): string {
  return internalIp.v4.sync() || '127.0.0.1'
}

export function getHost(): string {
  if (isTunnel) {
    return getTunnelAddress()
  } else {
    return getIpAddress()
  }
}
