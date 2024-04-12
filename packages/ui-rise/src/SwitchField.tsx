import { ComponentProps, wrapEvents } from '@react-native-templates/core'
import React from 'react'
import { Label, Spinner, Switch, XStack } from 'tamagui'
import { z } from 'zod'

const SwitchFieldProps = z.object({
  value: z.boolean().nullable().optional(),
  label: z.string().optional(),
  onValue: z.string().or(z.array(z.string())).nullable().optional(),
})

const WrappedSwitch = wrapEvents(Switch, ['onCheckedChange'])

export function SwitchField(props: z.infer<typeof SwitchFieldProps> & ComponentProps) {
  let content = <Spinner />
  if (typeof props.value === 'boolean') {
    content = (
      <WrappedSwitch
        marginVertical={'$4'}
        checked={props.value}
        onTemplateEvent={props.onTemplateEvent}
      >
        <Switch.Thumb animation="quick" />
      </WrappedSwitch>
    )
  }
  return (
    <XStack alignItems="center" justifyContent="space-between">
      <Label>{props.label}</Label>
      {content}
    </XStack>
  )
}

SwitchField.validate = (props: any) => {
  return SwitchFieldProps.parse(props)
}
