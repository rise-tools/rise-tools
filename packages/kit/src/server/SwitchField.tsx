/** @jsxImportSource @rise-tools/react */

import { WithServerProps } from '@rise-tools/react'
import { Label, Switch, SwitchThumb, XStack } from '@rise-tools/tamagui/server'

type Props = {
  value: boolean
  label: string
  onCheckedChange: (value: boolean) => void
}

export function SwitchField(props: WithServerProps<Props>) {
  return (
    <XStack alignItems="center" justifyContent="space-between">
      <Label>{props.label}</Label>
      <Switch checked={props.value} onCheckedChange={props.onCheckedChange}>
        <SwitchThumb animation="quick" />
      </Switch>
    </XStack>
  )
}
