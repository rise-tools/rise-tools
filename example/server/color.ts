import chroma from 'chroma-js'

export function hslToHex(hue: number, saturation: number, lightness: number) {
  const color = chroma.hsl(hue, saturation, lightness)
  return color.hex()
}
