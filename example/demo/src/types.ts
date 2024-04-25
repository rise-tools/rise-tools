import { ServerDataState } from '@final-ui/react'

export type UIContext = {
  update: (key: string, updater: (value: any) => ServerDataState) => void
}
