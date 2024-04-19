import { EventDataState, TemplateComponentProps } from '@final-ui/react'
import React from 'react'
import { Label, Spinner, Switch, XStack } from 'tamagui'

export type SwitchFieldProps = {
  value?: boolean
  label?: string
  onCheckedChange?: EventDataState
}

export function SwitchField(props: TemplateComponentProps<SwitchFieldProps>) {
  let content = <Spinner />
  if (typeof props.value === 'boolean') {
    content = (
      <Switch marginVertical={'$4'} checked={props.value} onCheckedChange={props.onCheckedChange}>
        <Switch.Thumb animation="quick" />
      </Switch>
    )
  }
  return (
    <XStack alignItems="center" justifyContent="space-between">
      <Label>{props.label}</Label>
      {content}
    </XStack>
  )
}
