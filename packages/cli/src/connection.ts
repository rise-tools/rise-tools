import bs58 from 'bs58'
import { Buffer } from 'buffer'

export type ConnectionPayload = {
  id: string
  label: string
  host: string
  path: string
}

export const createAppConnectionURL = (connection: ConnectionPayload) => {
  const connectInfo = bs58.encode(Buffer.from(JSON.stringify(connection)))
  const url = `rise://connect?connectInfo=${connectInfo}`
  return url
}
