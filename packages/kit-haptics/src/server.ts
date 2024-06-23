import { action, ActionModelState, ActionsDefinition } from '@rise-tools/react'
import type { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics'

export type HapticsActions = ActionsDefinition<[ImpactAction, NotificationAction, SelectionAction]>

type SelectionAction = ActionModelState<'rise-tools/kit-haptics/selection'>
type ImpactAction = ActionModelState<
  'rise-tools/kit-haptics/impact',
  { style?: ImpactFeedbackStyle }
>
type NotificationAction = ActionModelState<
  'rise-tools/kit-haptics/notification',
  { type?: NotificationFeedbackType }
>

export function haptics(): ImpactAction
export function haptics(type: 'impact', style?: `${ImpactFeedbackStyle}`): ImpactAction
export function haptics(
  type: 'notification',
  style?: `${NotificationFeedbackType}`
): NotificationAction
export function haptics(type: 'selection'): SelectionAction

export function haptics(
  type: 'impact' | 'notification' | 'selection' = 'impact',
  style?: `${ImpactFeedbackStyle}` | `${NotificationFeedbackType}`
) {
  switch (type) {
    case 'impact':
      return action('rise-tools/kit-haptics/impact', style ? { style } : {})
    case 'notification':
      return action('rise-tools/kit-haptics/notification', style ? { type: style } : {})
    case 'selection':
      return action('rise-tools/kit-haptics/selection')
    default:
      throw new Error(`Invalid haptics type: ${type}`)
  }
}
