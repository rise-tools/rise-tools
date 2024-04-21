import React from 'react'
import { Label, Slider as TamaguiSlider, Spinner, YStack } from 'tamagui'

import { SliderFieldProps, SliderProps } from '.'

export function Slider(props: SliderProps) {
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

export function SliderField(props: SliderFieldProps) {
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
