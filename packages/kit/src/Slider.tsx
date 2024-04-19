import { EventDataStateProp, TemplateComponentProps } from '@final-ui/react'
import React from 'react'
import { Label, Slider as TamaguiSlider, Spinner, YStack } from 'tamagui'

export type SliderProps = {
  value: number
  min?: number
  max?: number
  step?: number
  onValueChange?: EventDataStateProp
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
}: TemplateComponentProps<SliderProps>) {
  return (
    <TamaguiSlider value={[value]} max={max} min={min} step={step} onValueChange={onValueChange}>
      <TamaguiSlider.Track>
        <TamaguiSlider.TrackActive />
      </TamaguiSlider.Track>
      <TamaguiSlider.Thumb index={0} circular elevate />
    </TamaguiSlider>
  )
}

export type SliderFieldProps = SliderProps & {
  label?: string
  defaultValue?: number
}

export function SliderField(props: TemplateComponentProps<SliderFieldProps>) {
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
