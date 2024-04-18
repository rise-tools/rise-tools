const DMX = require('dmx')

const dmx = new DMX()

const usbPath = process.env.DMX_USB_PATH || '/dev/tty.usbserial-6A0LA7NL'

dmx.addUniverse('main', 'enttec-usb-dmx-pro', usbPath)

// dmx.update('main', {
//   '17': 0, // effect?
//   '18': 255, //?
//   '19': 255, //?
//   '20': 255, //?
//   '21': 255, // red
//   '22': 0, // green
//   '23': 0, // blue
//   '24': 0, // white
//   '25': 255,
// })

const dmxOutput = {}

export function flushUpdates() {
  dmx.update('main', dmxOutput)
}

export type ColorValue = {
  red: number
  green: number
  blue: number
  white: number
}

export type Position = {
  x: number
  y: number
}

export const Color_Full: ColorValue = {
  red: 1,
  green: 1,
  blue: 1,
  white: 1,
}

export const Color_Red: ColorValue = {
  red: 1,
  green: 0,
  blue: 0,
  white: 0,
}

export const Color_Green: ColorValue = {
  red: 0,
  green: 1,
  blue: 0,
  white: 0,
}

export const Color_Blue: ColorValue = {
  red: 0,
  green: 0,
  blue: 1,
  white: 0,
}
export const Color_Off: ColorValue = {
  red: 0,
  green: 0,
  blue: 0,
  white: 0,
}

export function setCanChannels(baseChannel: number, color: ColorValue) {
  dmxOutput[baseChannel + 0] = 0
  dmxOutput[baseChannel + 1] = 255
  dmxOutput[baseChannel + 2] = 255
  dmxOutput[baseChannel + 3] = 255
  dmxOutput[baseChannel + 4] = Math.max(0, Math.floor(color.red * 256) - 1)
  dmxOutput[baseChannel + 5] = Math.max(0, Math.floor(color.green * 256) - 1)
  dmxOutput[baseChannel + 6] = Math.max(0, Math.floor(color.blue * 256) - 1)
  dmxOutput[baseChannel + 7] = Math.max(0, Math.floor(color.white * 256) - 1)
}

export function setMovingHeadChannels(baseChannel: number, color: ColorValue, position: Position) {
  // using the 14 channel mode
  dmxOutput[baseChannel + 0] = 100 // pan
  dmxOutput[baseChannel + 1] = 255 // tilt. 130 is straight. 0,255 are 90°
  dmxOutput[baseChannel + 2] = 255 // master brightness 0-255
  // after testing, colors seem to be 5-200. special case for 0 because some channels are on at 5
  dmxOutput[baseChannel + 3] = color.red === 0 ? 0 : 5 + Math.floor(color.red * 200) // red
  dmxOutput[baseChannel + 4] = color.green === 0 ? 0 : 5 + Math.floor(color.green * 200) // green
  dmxOutput[baseChannel + 5] = color.blue === 0 ? 0 : 5 + Math.floor(color.blue * 200) // blue
  dmxOutput[baseChannel + 6] = color.white === 0 ? 0 : 5 + Math.floor(color.white * 200) // white
  dmxOutput[baseChannel + 7] = 0 // speed, lower is faster
  dmxOutput[baseChannel + 8] = 255 // 180 is reset.
  //   dmxOutput[baseChannel + 9] = 255;
  //   dmxOutput[baseChannel + 10] = 0;
  //   dmxOutput[baseChannel + 11] = 255;
  //   dmxOutput[baseChannel + 12] = 0;
  //   dmxOutput[baseChannel + 13] = 255;
}
