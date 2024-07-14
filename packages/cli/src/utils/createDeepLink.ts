import bs58 from 'bs58'
import { Buffer } from 'buffer'

export type ConnectionPayload = {
  id: string
  label: string
  host: string
  path: string
}

export const createDeepLink = (connection: ConnectionPayload) => {
  const connectInfo = bs58.encode(Buffer.from(JSON.stringify(connection)))
  return `rise://connect?connectInfo=${connectInfo}`
}
