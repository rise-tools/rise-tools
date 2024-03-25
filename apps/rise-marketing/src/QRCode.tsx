import { useEffect, useRef } from 'react'
import { toCanvas } from 'qrcode'

export function QRCode({ value }: { value: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    toCanvas(
      canvas.current,
      value,
      { color: { light: '#000000', dark: '#eeeeee' }, margin: 2, scale: 2 },
      (error) => {
        if (error) console.error(error)
        console.log('success!')
      }
    )
  }, [value])
  return <canvas ref={canvas} width={164} height={164} />
}
