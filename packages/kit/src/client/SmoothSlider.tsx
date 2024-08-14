import { useEffect, useRef, useState } from 'react'
import { Slider } from 'tamagui'
import { z } from 'zod'

export const smoothSliderPropsSchema = z.object({
  value: z.number(),
  size: z.number(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  onValueChange: z.function(z.tuple([z.number()]), z.void()).optional(),
  smoothing: z.number().default(0.5),
})

const animationFps = 45

export function SmoothSlider({
  value,
  size,
  min,
  max,
  step,
  smoothing,
  onValueChange,
}: z.infer<typeof smoothSliderPropsSchema>) {
  const lastActualValue = useRef(value)
  lastActualValue.current = value
  const [smoothedValue, setSmoothedValue] = useState(value)
  const [touchingValue, setTouchingValue] = useState<null | number>(null)
  const [isTouching, setIsTouching] = useState(false)
  const valueMin = min ?? 0
  const valueMax = max ?? 1
  const displayValue = isTouching && touchingValue !== null ? touchingValue : value
  useEffect(() => {
    setInterval(() => {
      setSmoothedValue((lastSmoothedValue) => {
        const destValue = lastActualValue.current
        const moveAggression = smoothing <= 0 ? 1 : (1 - smoothing) / 5 + 0.02 // 0.05 is default
        const nextValue = destValue * moveAggression + lastSmoothedValue * (1 - moveAggression)

        return nextValue
      })
    }, 1000 / animationFps)
  }, [smoothing])
  if (displayValue === null) return null
  return (
    <Slider
      value={[displayValue]}
      onValueChange={([v]) => {
        if (v === undefined) return
        setTouchingValue(v)
        onValueChange?.(v)
      }}
      onTouchStart={() => setIsTouching(true)}
      onTouchEnd={() => {
        setIsTouching(false)
        setTouchingValue(null)
      }}
      min={min}
      max={max}
      step={step}
      height={size}
    >
      <Slider.Track height={size}>
        <Slider.TrackActive backgroundColor={isTouching ? '$color11' : '$color10'} />
        <Slider.TrackActive
          width={`${((smoothedValue - valueMin) / (valueMax - valueMin)) * 100}%`}
          backgroundColor="white"
          height={1}
          top={45}
          bottom={20}
        />
      </Slider.Track>
    </Slider>
  )
}
