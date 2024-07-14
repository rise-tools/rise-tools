import { CLIArgs } from '../start/types'
import { getIpAddress } from './getIpAddress'

export function getHost(host: CLIArgs['host']) {
  switch (host) {
    case 'localhost':
      return 'http://localhost'
    case 'lan':
      return 'http://' + getIpAddress()
    case 'tunnel':
      return 'tunnel'
    default:
      throw new Error(`Invalid host: ${host}`)
  }
}
