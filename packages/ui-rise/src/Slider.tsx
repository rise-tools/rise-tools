import { ComponentProps } from '@react-native-templates/core'
import React from 'react'
import { Label, Slider as TamaguiSlider, Spinner, YStack } from 'tamagui'
import { z } from 'zod'

const SliderProps = z.object({
  value: z.number(),
  min: z.number().optional().default(0),
  max: z.number().optional().default(100),
  step: z.number().optional().default(1),
})

export function Slider(props: z.infer<typeof SliderProps> & ComponentProps) {
  return (
    <TamaguiSlider
      value={[props.value]}
      max={props.max || 100}
      min={props.min || 0}
      step={props.step || 1}
      onValueChange={(value) => {
        props.onTemplateEvent('onValueChange', value)
      }}
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
  onValue: z.string().or(z.array(z.any())).nullable().optional(),
  label: z.string().optional(),
})

export function SliderField(props: z.infer<typeof SliderFieldProps> & ComponentProps) {
  let content = <Spinner />
  if (typeof props.value === 'number') {
    content = (
      <TamaguiSlider
        marginVertical={'$4'}
        value={[props.value]}
        max={props.max || 100}
        min={props.min || 0}
        step={props.step || 1}
        onValueChange={(value) => {
          let payload: (string | number)[] = value
          if (props.onValue === null) return
          if (props.onValue)
            payload = [
              ...(Array.isArray(props.onValue) ? props.onValue : [props.onValue]),
              ...value,
            ]
          props.onTemplateEvent('update', payload)
        }}
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
