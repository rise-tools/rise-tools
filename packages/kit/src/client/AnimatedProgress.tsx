import { useEffect, useRef, useState } from 'react'
import { Progress } from 'tamagui'
import { z } from 'zod'

export const animatedProgressPropsSchema = z.object({
  startProgress: z.number().nullable(),
  endProgress: z.number(),
  duration: z.number(),
  size: z.enum(['small', 'large']).optional(),
  opacity: z.number().optional(),
})

const animationFps = 50

export function AnimatedProgress({
  startProgress,
  endProgress,
  duration,
  ...props
}: z.infer<typeof animatedProgressPropsSchema>) {
  const [value, setValue] = useState(startProgress ? startProgress * 100 : 0)
  const endProgressRef = useRef(endProgress)
  endProgressRef.current = endProgress
  const durationRef = useRef(duration)
  durationRef.current = duration
  useEffect(() => {
    if (startProgress === null) {
      setValue(endProgressRef.current * 100)
      return
    }
    const startTime = Date.now()
    const id = setInterval(() => {
      const currentTime = Date.now()
      const progress = (currentTime - startTime) / durationRef.current
      if (progress >= 1) {
        setValue(endProgressRef.current * 100)
        clearInterval(id)
        return
      }
      setValue((startProgress + (endProgressRef.current - startProgress) * progress) * 100)
    }, 1000 / animationFps)
    return () => clearInterval(id)
  }, [startProgress])

  return (
    <Progress value={value} {...props}>
      <Progress.Indicator key={startProgress} />
    </Progress>
  )
}
