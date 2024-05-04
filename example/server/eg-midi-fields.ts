import { Dashboard, MainState } from './state-schema'

export type MidiField = {
  key: string
  behavior: 'bounceButton' | 'goNextButton' | 'slider'
  field: string
  min?: number
  max?: number
}

// export function getMidiFields(state: MainState) {
//   const readySliders: MidiField[] = []
//   const liveSliders: MidiField[] = []
//   const readyButtons: MidiField[] = []
//   const liveButtons: MidiField[] = []
//   state.liveDashboard.forEach((item) => {
//     if (item.behavior === 'slider') {
//       liveSliders.push({ behavior: 'slider', field: `liveMedia.${item.field}` })
//     }
//     if (item.behavior === 'bounceButton') {
//       liveButtons.push({ behavior: 'bounceButton', field: `liveMedia.${item.field}` })
//     }
//   })
//   state.readyDashboard.forEach((item) => {
//     if (item.behavior === 'slider') {
//       readySliders.push({
//         behavior: 'slider',
//         field: `readyMedia.${item.field}`,
//         min: item.min,
//         max: item.max,
//       })
//     }
//     if (item.behavior === 'bounceButton') {
//       readyButtons.push({
//         behavior: 'bounceButton',
//         field: `readyMedia.${item.field}`,
//         min: item.min,
//         max: item.max,
//       })
//     }
//   })
//   const midiFields = {
//     ready: { sliders: readySliders, buttons: readyButtons },
//     live: { sliders: liveSliders, buttons: liveButtons },
//   }
//   console.log('midiFields', JSON.stringify(midiFields))
//   return midiFields
// }

export function getDashboardMidiFields(dash: Dashboard, keyPrefix: string) {
  const sliders: MidiField[] = []
  const buttons: MidiField[] = []
  dash.forEach((item) => {
    if (item.behavior === 'slider') {
      sliders.push({ behavior: 'slider', field: `${keyPrefix}.${item.field}`, key: item.key })
    }
    if (item.behavior === 'bounceButton') {
      buttons.push({
        behavior: 'bounceButton',
        field: `${keyPrefix}.${item.field}`,
        key: item.key,
      })
    }
    if (item.behavior === 'goNextButton') {
      buttons.push({
        behavior: 'goNextButton',
        field: `${keyPrefix}.${item.field}`,
        key: item.key,
      })
    }
  })
  return { buttons, sliders }
}

export type DashMidi = ReturnType<typeof getDashboardMidiFields>

export function getMidiFields(state: MainState) {
  return {
    ready: getDashboardMidiFields(state.readyDashboard, 'readyMedia'),
    live: getDashboardMidiFields(state.liveDashboard, 'liveMedia'),
  }
}
