import { action, ActionModelState, ActionsDefinition } from '@rise-tools/react'

export type LinkingActions = ActionsDefinition<[OpenURLAction, OpenSettingsAction]>

type OpenURLAction = ActionModelState<'@rise-tools/kit-linking/openURL', { url: string }>
type OpenSettingsAction = ActionModelState<'@rise-tools/kit-linking/openSettings'>

export const openURL = (url: string) => action('@rise-tools/kit-linking/openURL', { url })
export const openSettings = () => action('@rise-tools/kit-linking/openSettings')
