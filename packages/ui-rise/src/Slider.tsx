import { ComponentProps, wrapEvents } from '@react-native-templates/core'
import React from 'react'
import { Label, Slider as TamaguiSlider, Spinner, YStack } from 'tamagui'
import { z } from 'zod'

const SliderProps = z.object({
  value: z.number(),
  min: z.number().optional().default(0),
  max: z.number().optional().default(100),
  step: z.number().optional().default(1),
})

const WrappedTamaguiSlider = wrapEvents(TamaguiSlider, ['onValueChange'])

export function Slider(props: z.infer<typeof SliderProps> & ComponentProps) {
  return (
    <WrappedTamaguiSlider
      value={[props.value]}
      max={props.max}
      min={props.min}
      step={props.step}
      onTemplateEvent={props.onTemplateEvent}
    >
      <TamaguiSlider.Track>
        <TamaguiSlider.TrackActive />
      </TamaguiSlider.Track>
      <TamaguiSlider.Thumb index={0} circular elevate />
    </WrappedTamaguiSlider>
  )
}

Slider.validate = (props: any) => {
  return SliderProps.parse(props)
}

const SliderFieldProps = SliderProps.extend({
  defaultValue: z.number().optional(),
  onValue: z.string().or(z.array(z.any())).nullable().optional(),
  label: z.string().optional(),
})

const WrappedSliderField = wrapEvents(TamaguiSlider, ['onValueChange'])

export function SliderField(props: z.infer<typeof SliderFieldProps> & ComponentProps) {
  let content = <Spinner />
  if (typeof props.value === 'number') {
    content = (
      <WrappedSliderField
        marginVertical={'$4'}
        value={[props.value]}
        max={props.max}
        min={props.min}
        step={props.step}
        onTemplateEvent={props.onTemplateEvent}
      >
        <TamaguiSlider.Track>
          <TamaguiSlider.TrackActive />
        </TamaguiSlider.Track>
        <TamaguiSlider.Thumb index={0} circular elevate />
      </WrappedSliderField>
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
