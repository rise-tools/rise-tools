import { EventDataStateSchema, TemplateComponentProps } from '@final-ui/react'
import React from 'react'
import { Label, Spinner, Switch, XStack } from 'tamagui'
import { z } from 'zod'

const SwitchFieldProps = z.object({
  value: z.boolean().nullable().optional(),
  label: z.string().optional(),
  onCheckedChange: EventDataStateSchema.optional(),
})

export function SwitchField(props: TemplateComponentProps<z.infer<typeof SwitchFieldProps>>) {
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

SwitchField.validate = (props: any) => {
  return SwitchFieldProps.parse(props)
}
