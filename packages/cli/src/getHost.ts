import internalIp from 'internal-ip'

import { getTunnelAddress } from './tunnel'

export enum HostType {
  lan = 'lan',
  localhost = 'localhost',
  tunnel = 'tunnel',
}

function getIpAddress(): string {
  return internalIp.v4.sync() || '127.0.0.1'
}

export function getHost(hostType: HostType): Promise<string> {
  return new Promise((resolve) => {
    switch (hostType) {
      case HostType.localhost:
        resolve('http://localhost')
        break
      case HostType.lan:
        resolve('http://' + getIpAddress())
        break
      case HostType.tunnel:
        return getTunnelAddress()
      default:
        throw new Error(`Invalid host: ${hostType}`)
    }
  })
}
