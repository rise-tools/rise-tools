import {
  ColorValue,
  Color_Full,
  Color_Off,
  Position,
  flushUpdates,
  setCanChannels,
  setMovingHeadChannels,
} from './dmx'
import { StateContext } from './state-schema'

// THIS FILE IS BROKEN

const canCount = 4

const canDMXStarts = [1, 17, 25, 33, 41, 49, 57, 65, 73]
const movingHeadDMXStarts = [100, 112, 124, 136]

const canAddressRemapping = new Map<number, number>()
canAddressRemapping.set(0, 0) // map from virtual address 0 to physical address 0
const movingHeadAddressRemapping = new Map<number, number>()
movingHeadAddressRemapping.set(0, 0)

function getCanAddress(virtualIndex: number): number {
  const physicalIndex = canAddressRemapping.get(virtualIndex)
  if (physicalIndex !== undefined) return physicalIndex
  return virtualIndex
}
function getMovingHeadAddress(virtualIndex: number): number {
  const physicalIndex = movingHeadAddressRemapping.get(virtualIndex)
  if (physicalIndex !== undefined) return physicalIndex
  return virtualIndex
}

function mainCanRainbow(ctx: StateContext, canIndex: number): ColorValue {
  const { time, relativeTime } = ctx
  const hueRotationRpm = 6
  const hueRotationRps = hueRotationRpm / 60
  const baseHue = (360 / canCount) * canIndex
  const currentHue = (baseHue + (relativeTime / 1000) * hueRotationRps * 360) % 360
  return pureHue(currentHue)
}

function pureHue(hue: number): ColorValue {
  const f = (n: number, k = (n + hue / 60) % 6) => 255 * Math.max(Math.min(k - 3, 3 - k, 1), 0)
  return { red: f(5), green: f(3), blue: f(1), white: 0 }
}

function mainCanLoop(ctx: StateContext, canIndex: number): ColorValue {
  const { time, relativeTime } = ctx
  switch (mainState.mode) {
    case 'off':
    case 'white':
      return mainColor(ctx)
    case 'rainbow':
      return mainCanRainbow(ctx, canIndex)
    default:
      return Color_Off
  }
}

function mainColor(ctx: StateContext): ColorValue {
  const { time, relativeTime } = ctx
  if (mainState.mode === 'white') return Color_Full
  if (mainState.mode === 'off') return Color_Off
  return Color_Off
}

function mainMovingHeadLoop(
  ctx: StateContext,
  movingHeadIndex: number
): readonly [ColorValue, Position] {
  return [mainColor(ctx), { x: 0, y: 0.5 }] as const
}

// Overall topology for installation

// M0                       M1
//          C1 C2 C3
//       C0          C4
//       C5          C9
//          C6 C7 C8
// M2                       M3

// key:
//   C# = Static Can RGB Light
//   M# = Moving Head Light

// INSIDE MAIN LOOP (all this stuff is broken rn)

function fromMainLoop() {
  canDMXStarts.forEach((start, index) => {
    setCanChannels(start, mainCanLoop(context, getCanAddress(index)))
  })
  movingHeadDMXStarts.forEach((start, index) => {
    setMovingHeadChannels(start, ...mainMovingHeadLoop(context, getMovingHeadAddress(index)))
  })
  flushUpdates()
}
