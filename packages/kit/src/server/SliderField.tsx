/** @jsxImportSource @final-ui/react */

import { LiteralArray, WithServerProps } from '@final-ui/react'
import {
  SizableText,
  Slider as TSlider,
  SliderThumb,
  SliderTrack,
  SliderTrackActive,
  YStack,
} from '@final-ui/tamagui/server'

type Props = {
  value: LiteralArray<number>
  min?: number
  max?: number
  step?: number
  label?: string
  onValueChange?: (value: number[]) => any
  onSlideEnd?: (event: any, value: number) => any
}

export function SliderField(props: WithServerProps<Props>) {
  return (
    <YStack>
      <SizableText>{props.label}</SizableText>
      <TSlider
        value={props.value}
        max={props.max}
        min={props.min}
        step={props.step}
        onValueChange={props.onValueChange}
        onSlideEnd={props.onSlideEnd}
      >
        <SliderTrack>
          <SliderTrackActive />
        </SliderTrack>
        {props.value.map((_, index) => (
          <SliderThumb key={index} index={index} circular />
        ))}
      </TSlider>
    </YStack>
  )
}
