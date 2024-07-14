import { getIpAddress } from '../utils/getIpAddress'
import { DevArgs } from './types'

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
