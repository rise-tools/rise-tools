import { ServerDataState, UI } from '@final-ui/react'

export type UIContext = {
  update: (key: string, updater: (value: any) => ServerDataState | UI) => void
}
