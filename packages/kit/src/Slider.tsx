import React from 'react'
import { SizableText, Slider as TamaguiSlider, Spinner, YStack } from 'tamagui'
import { z } from 'zod'

import { LongPressSheetLabel } from './LongPressSheetLabel'

const SliderProps = z.object({
  value: z.number(),
  min: z.number().optional().default(0),
  max: z.number().optional().default(100),
  step: z.number().optional().default(1),
  longPressSheet: z.any().optional(),
  onValueChange: z.function().args(z.array(z.number())).optional(),
})

export function Slider(props: z.infer<typeof SliderProps>) {
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
  onValueChange: z.function().args(z.array(z.number())).optional(),
  label: z.string().optional(),
})

export function SliderField(props: z.infer<typeof SliderFieldProps>) {
  let content = <Spinner />
  // tbd: this is always number, isn't it? (we validate props)
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
  if (!props.longPressSheet) {
    return (
      <YStack>
        <SizableText>{props.label}</SizableText>
        {content}
      </YStack>
    )
  }
  return (
    <YStack>
      <LongPressSheetLabel sheet={props.longPressSheet}>{props.label}</LongPressSheetLabel>
      {content}
    </YStack>
  )
}

SliderField.validate = (props: any) => {
  return SliderFieldProps.parse(props)
}
