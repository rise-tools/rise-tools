import { DevArgs } from '../start/types'
import { getIpAddress } from './getIpAddress'

export function getHost(host: DevArgs['host']) {
  switch (host) {
    case 'localhost':
      return 'localhost'
    case 'lan':
      return getIpAddress()
    case 'tunnel':
      return 'tunnel'
    default:
      throw new Error(`Invalid host: ${host}`)
  }
}
