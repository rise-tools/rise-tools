import { ServerDataState } from '@final-ui/react'

export type UIContext = {
  update: (key: string, value: ServerDataState) => void
}
