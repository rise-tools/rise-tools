import { EventDataStateSchema, TemplateComponentProps } from '@final-ui/react'
import React from 'react'
import { Label, Slider as TamaguiSlider, Spinner, YStack } from 'tamagui'
import { z } from 'zod'

const SliderProps = z.object({
  value: z.number(),
  min: z.number().optional().default(0),
  max: z.number().optional().default(100),
  step: z.number().optional().default(1),
  onValueChange: EventDataStateSchema.optional(),
})

export function Slider(props: TemplateComponentProps<z.infer<typeof SliderProps>>) {
  return (
    <TamaguiSlider
      value={[props.value]}
      max={props.max}
      min={props.min}
      step={props.step}
      onValueChange={props.onValueChange}
    >
      <TamaguiSlider.Track>
        <TamaguiSlider.TrackActive />
      </TamaguiSlider.Track>
      <TamaguiSlider.Thumb index={0} circular elevate />
    </TamaguiSlider>
  )
}

Slider.validate = (props: any) => {
  return SliderProps.parse(props)
}

const SliderFieldProps = SliderProps.extend({
  defaultValue: z.number().optional(),
  onValueChange: EventDataStateSchema.optional(),
  label: z.string().optional(),
})

export function SliderField(props: TemplateComponentProps<z.infer<typeof SliderFieldProps>>) {
  let content = <Spinner />
  if (typeof props.value === 'number') {
    content = (
      <TamaguiSlider
        marginVertical={'$4'}
        onValueChange={props.onValueChange}
        value={[props.value]}
        max={props.max}
        min={props.min}
        step={props.step}
      >
        <TamaguiSlider.Track>
          <TamaguiSlider.TrackActive />
        </TamaguiSlider.Track>
        <TamaguiSlider.Thumb index={0} circular elevate />
      </TamaguiSlider>
    )
  }
  return (
    <YStack>
      <Label>{props.label}</Label>
      {content}
    </YStack>
  )
}

SliderField.validate = (props: any) => {
  return SliderFieldProps.parse(props)
}
