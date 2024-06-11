import { ServerDataState } from '@rise-tools/react'

export type UIContext = {
  update: (key: string, updater: (value: any) => ServerDataState) => void
}
