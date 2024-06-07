/** @jsxImportSource @final-ui/react */

import { WithServerProps } from '@final-ui/react'
import { Label, Switch, SwitchThumb, XStack } from '@final-ui/tamagui/server'

type Props = {
  value: boolean
  label: string
  onCheckedChange: (value: boolean) => void
}

export function SwitchField(props: WithServerProps<Props>) {
  return (
    <XStack alignItems="center" justifyContent="space-between">
      <Label>{props.label}</Label>
      <Switch
        backgroundColor="#ddd"
        marginVertical={'$4'}
        checked={props.value}
        onCheckedChange={props.onCheckedChange}
      >
        <SwitchThumb animation="quick" />
      </Switch>
    </XStack>
  )
}
