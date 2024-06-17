import { action, ActionModelState } from '@rise-tools/react'
import type { ImpactFeedbackStyle, NotificationFeedbackType } from 'expo-haptics'

export type SelectionAction = ActionModelState<'haptics/selection'>
export type ImpactAction = ActionModelState<'haptics/impact', { style: ImpactFeedbackStyle }>
export type NotificationAction = ActionModelState<
  'haptics/notification',
  { type: NotificationFeedbackType }
>

export function haptics(): ImpactAction
export function haptics(type: 'impact', style?: ImpactFeedbackStyle): ImpactAction
export function haptics(type: 'notification', style?: NotificationFeedbackType): NotificationAction
export function haptics(type: 'selection'): SelectionAction

export function haptics(
  type: 'impact' | 'notification' | 'selection' = 'impact',
  style?: ImpactFeedbackStyle | NotificationFeedbackType
) {
  switch (type) {
    case 'impact':
      return action('haptics/impact', { style })
    case 'notification':
      return action('haptics/notification', { type: style })
    case 'selection':
      return action('haptics/selection')
    default:
      throw new Error(`Invalid haptics type: ${type}`)
  }
}
