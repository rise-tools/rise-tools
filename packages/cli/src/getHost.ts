import internalIp from 'internal-ip'

import { connectTunnel } from './tunnel'

export enum HostType {
  lan = 'lan',
  localhost = 'localhost',
  tunnel = 'tunnel',
}

function getIpAddress(): string {
  return internalIp.v4.sync() || '127.0.0.1'
}

export function getHost(hostType: HostType) {
  switch (hostType) {
    case HostType.localhost:
      return 'http://localhost'
    case HostType.lan:
      return 'http://' + getIpAddress()
    case HostType.tunnel:
      return connectTunnel()
    default:
      throw new Error(`Invalid host: ${hostType}`)
  }
}
