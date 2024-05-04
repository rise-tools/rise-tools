import { ComponentDataState, ServerDataState } from '@final-ui/react'
import React from 'react'

import { hslToHex } from './color'
import {
  DefaultBounceAmount,
  DefaultBounceDuration,
  DefaultSmoothing,
  DefaultTransitionDuration,
} from './constants'
import { getSequenceActiveItem } from './eg-main'
import { DashMidi, getDashboardMidiFields } from './eg-midi-fields'
import { EGVideo } from './eg-video-playback'
import {
  ColorMedia,
  Effect,
  Effects,
  Layer,
  LayersMedia,
  MainState,
  Media,
  SequenceItem,
  SequenceMedia,
  Transition,
  TransitionState,
  VideoMedia,
} from './state-schema'

export type UIContext = {
  video: EGVideo
  mainState: MainState
  libraryKeys: string[]
}

function icon(name: string): ComponentDataState {
  return {
    $: 'component',
    key: 'icon',
    component: 'RiseIcon',
    props: { icon: name },
  }
}

function section(title: string, children: ServerDataState[], key?: string): ServerDataState {
  return {
    $: 'component',
    component: 'YStack',
    key: key || title,
    props: {
      padding: '$3',
      gap: '$2',
    },
    children: [
      {
        $: 'component',
        key: 'title',
        component: 'Label',
        children: title,
        props: {
          fontSize: '$2',
          fontWeight: 'bold',
          color: '$color10',
        },
      },
      ...children,
      { $: 'component', component: 'Separator', props: {} },
    ],
  }
}

function sortableList({
  key,
  label,
  props,
}: {
  key?: string
  label?: string
  props?: ComponentDataState['props']
}): ServerDataState {
  return {
    $: 'component',
    component: 'RiseSortableList',
    key,
    props: {
      padding: '$4',
      gap: '$2',
      ...props,
    },
    children: [
      {
        $: 'component',
        key: 'title',
        component: 'Label',
        children: label,
        props: {
          fontSize: '$2',
          fontWeight: 'bold',
          color: '$color10',
        },
      },
    ],
  }
}

function getVideoControls(mediaPath: string, state: VideoMedia, ctx: UIContext): ServerDataState[] {
  const player = ctx.video.getPlayer(state.id)
  return [
    section('Video Controls', [
      {
        $: 'component',
        key: 'selectVideo',
        component: 'RiseSelectField',
        props: {
          unselectedLabel: 'Select Video...',
          value: state.track,
          onValueChange: {
            $: 'event',
            action: ['updateMedia', mediaPath, 'track'],
          },
          options: { $: 'ref', ref: ['videoList'] },
        },
      },
      {
        $: 'component',
        component: 'XStack',
        props: { gap: '$2' },
        children: [
          {
            $: 'component',
            key: 'restart',
            component: 'Button',
            children: 'Restart',
            props: {
              icon: icon('RefreshCcw'),
              size: '$2',
              theme: 'blue',
              onPress: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'restart'],
              },
            },
          },
          state.pauseOnFrame == null
            ? {
                $: 'component',
                key: 'pause',
                component: 'Button',
                children: 'Pause',
                props: {
                  icon: icon('Pause'),
                  size: '$2',
                  theme: 'blue',
                  onPress: {
                    $: 'event',
                    action: ['updateMedia', mediaPath, 'pause'],
                  },
                },
              }
            : {
                $: 'component',
                key: 'play',
                component: 'Button',
                children: 'Play',
                props: {
                  icon: icon('Play'),
                  size: '$2',
                  theme: 'blue',
                  onPress: {
                    $: 'event',
                    action: ['updateMedia', mediaPath, 'play'],
                  },
                },
              },
        ],
      },
      {
        $: 'component',
        key: 'loopBounce',
        component: 'RiseSwitchField',
        props: {
          value: state?.params?.loopBounce || false,
          label: 'Loop Bounce',
          onCheckedChange: {
            $: 'event',
            action: ['updateMedia', mediaPath, 'loopBounce'],
          },
        },
      },
      {
        $: 'component',
        key: 'reverse',
        component: 'RiseSwitchField',
        props: {
          value: state?.params?.reverse || false,
          label: 'Reverse Playback',
          onCheckedChange: {
            $: 'event',
            action: ['updateMedia', mediaPath, 'reverse'],
          },
        },
      },
    ]),
    section('Video Info', [
      {
        $: 'component',
        key: 'infoFrameCount',
        component: 'Label',
        children: `Frame Count: ${player.getFrameCount()}`,
      },
      state.pauseOnFrame == null
        ? {
            $: 'component',
            key: 'playingInfo',
            component: 'Label',
            children: [
              `Playing: `,
              {
                $: 'component',
                component: 'Text',
                children: 'Forward: ',
                props: { opacity: { $: 'ref', ref: [`videoFrameInfo/${state.id}`, 'isForward'] } },
              },
              {
                $: 'ref',
                ref: [`videoFrameInfo/${state.id}`, 'index'],
              },
            ],
          }
        : {
            $: 'component',
            key: 'pauseLabel',
            component: 'Label',
            children: `Paused on Frame: ${state.pauseOnFrame}`,
          },
      {
        $: 'component',
        key: 'infoDuration',
        component: 'Label',
        children: `Duration: ${((player.getFrameCount() || 0) / 30).toFixed(2)} sec`,
      },
      {
        $: 'component',
        key: 'effect',
        component: 'Button',
        children: 'Effects',
        props: {
          icon: icon('Sparkles'),
          onPress: {
            $: 'event',
            action: ['navigate', `${mediaPath}.effects`],
          },
        },
      },
      ...getGenericMediaUI(mediaPath, state, ctx),
    ]),
  ]
}

function scroll(children: any[]): ServerDataState {
  return {
    $: 'component',
    component: 'ScrollView',
    props: {
      padding: '$4',
      gap: '$4',
    },
    children,
  }
}

function getColorControls(
  mediaPath: string,
  state: ColorMedia,
  context: UIContext
): ServerDataState[] {
  return [
    {
      $: 'component',
      key: 'ColorPreview',
      component: 'View',
      props: {
        height: 50,
        backgroundColor: hslToHex(state.h, state.s, state.l),
        borderRadius: '$3',
      },
    },
    {
      $: 'component',
      key: 'ColorHueSlider',
      component: 'RiseSliderField',
      props: {
        label: 'Hue',
        value: state.h,
        onValueChange: {
          $: 'event',
          action: ['updateMedia', mediaPath, 'color', 'h'],
        },
        max: 360,
        min: 0,
        step: 1,
      },
    },
    {
      $: 'component',
      key: 'ColorSaturationSlider',
      component: 'RiseSliderField',
      props: {
        label: 'Saturation',
        value: state.s,
        onValueChange: {
          $: 'event',
          action: ['updateMedia', mediaPath, 'color', 's'],
        },
        max: 1,
        min: 0,
        step: 0.01,
      },
    },
    {
      $: 'component',
      key: 'ColorLightnessSlider',
      component: 'RiseSliderField',
      props: {
        label: 'Lightness',
        value: state.l,
        onValueChange: {
          $: 'event',
          action: ['updateMedia', mediaPath, 'color', 'l'],
        },
        max: 1,
        min: 0,
        step: 0.01,
      },
    },
    ...getGenericMediaUI(mediaPath, state, context),
  ]
}

function extractMediaFieldValue(mediaState: Media, fieldPath: string[]): number {
  if (fieldPath[0] === 'effects') {
    const [effects, effectId, fieldKey] = fieldPath
    if (mediaState.type !== 'video') return 0
    const effect = mediaState.effects?.find((e) => e.key === effectId)
    if (!effect || !fieldKey) return 0
    return effect[fieldKey] || 0
  }
  if (fieldPath[0] === 'item') {
    const [itemId, ...restFieldPath] = fieldPath
    if (mediaState.type !== 'sequence') return 0
    const item = mediaState.sequence?.find((e) => e.key === itemId)
    const childMedia = item?.media
    if (!childMedia || !restFieldPath.length) return 0
    return extractMediaFieldValue(childMedia, restFieldPath)
  }
  if (fieldPath[0] === 'layer') {
    const [_layer, layerId, ...restFieldPath] = fieldPath
    if (mediaState.type !== 'layers') return 0
    const layer = mediaState.layers?.find((e) => e.key === layerId)
    if (!layer) return 0
    if (restFieldPath.length === 1 && restFieldPath[0] === 'blendAmount') return layer.blendAmount
    const childMedia = layer?.media
    if (!childMedia || !restFieldPath.length) return 0
    return extractMediaFieldValue(childMedia, restFieldPath)
  }
  return 0
}

function dashboardItem(
  rootMediaKey: 'liveMedia' | 'readyMedia',
  itemKey: string,
  midi: DashMidi,
  component: ComponentDataState
) {
  let midiText = ''
  const buttonIndex = midi.buttons.findIndex((b) => b.key === itemKey)
  const sliderIndex = midi.sliders.findIndex((b) => b.key === itemKey)
  if (buttonIndex >= 0 && buttonIndex <= 3) {
    midiText = `Button ${buttonIndex + 1}`
  }
  if (sliderIndex >= 0 && sliderIndex <= 3) {
    midiText = `Slider ${sliderIndex + 1}`
  }
  return {
    $: 'component',
    component: 'YStack',
    children: [
      component,
      {
        $: 'component',
        component: 'XStack',
        props: { gap: '$2', justifyContent: 'space-between' },
        children: [
          {
            $: 'component',
            component: 'SizableText',
            props: { color: '$color9' },
            children: midiText,
          },
          {
            $: 'component',
            component: 'Button',
            children: 'Remove',
            props: {
              size: '$1',
              icon: icon('Trash'),
              onPress: {
                $: 'event',
                action: ['dashboardItem', rootMediaKey, 'remove', itemKey],
              },
            },
          },
        ],
      },
    ],
  }
}

function getMediaFieldLabel(media: Media, path: string[]): string {
  if (path[0] === 'effects') {
    const [effects, effectId, fieldKey] = path
    if (media.type !== 'video') return 'Unknown'
    const effect = media.effects?.find((e) => e.key === effectId)
    if (!effect) return 'Unknown'
    return `${effect.type} ${fieldKey}`
  }
  return path.join('.')
  return path.at(-1)
}

function getFieldLabel(
  path: string[],
  rootMediaKey: 'liveMedia' | 'readyMedia',
  context: UIContext
): string {
  const media = context.mainState[rootMediaKey]
  return getMediaFieldLabel(media, path)
}

export function getDashboardUI(
  state: MainState,
  context: UIContext,
  rootMediaKey: 'liveMedia' | 'readyMedia'
) {
  const dash = state[rootMediaKey === 'liveMedia' ? 'liveDashboard' : 'readyDashboard']
  const mediaState = state[rootMediaKey === 'liveMedia' ? 'liveMedia' : 'readyMedia']
  const midi = getDashboardMidiFields(dash, rootMediaKey)
  return scroll([
    title(rootMediaKey === 'liveMedia' ? 'Live Dashboard' : 'Ready Dashboard'),
    {
      $: 'component',
      component: 'YStack',
      props: { gap: '$4' },
      children: dash.map((item) => {
        if (item.behavior === 'bounceButton') {
          return dashboardItem(rootMediaKey, item.key, midi, {
            $: 'component',
            component: 'Button',
            children: `Bounce ${getFieldLabel(item.field.split('.'), rootMediaKey, context)}`,
            props: {
              onPress: {
                $: 'event',
                action: ['updateValuesIndex', `${rootMediaKey}.${item.field}`, 'bounce'],
              },
            },
          })
        }
        if (item.behavior === 'goNextButton') {
          return dashboardItem(rootMediaKey, item.key, midi, {
            $: 'component',
            component: 'Button',
            children: `Go Next ${getFieldLabel(item.field.split('.'), rootMediaKey, context)}`,
            props: {
              onPress: {
                $: 'event',
                action: [
                  'updateMedia',
                  item.field ? `${rootMediaKey}.${item.field}` : rootMediaKey,
                  'goNext',
                ],
              },
            },
          })
        }
        if (item.behavior === 'slider') {
          const value = extractMediaFieldValue(mediaState, item.field.split('.'))
          return dashboardItem(rootMediaKey, item.key, midi, {
            $: 'component',
            component: 'RiseSliderField',
            props: {
              label: getFieldLabel(item.field.split('.'), rootMediaKey, context),
              value,
              onValueChange: {
                $: 'event',
                action: ['updateValuesIndex', `${rootMediaKey}.${item.field}`, 'value'],
              },
              min: item.min,
              max: item.max,
              step: item.step,
            },
          })
        }
      }),
    },
  ])
}

export function getEffectsUI(
  mediaLinkPath: string,
  effectsState: Effects | undefined,
  context: UIContext
): ServerDataState {
  return {
    $: 'component',
    component: 'RiseSortableList',
    props: {
      onReorder: {
        $: 'event',
        action: ['updateMedia', mediaLinkPath, 'effectOrder'],
      },
      footer: section('', [
        {
          $: 'component',
          key: 'addEffect',
          component: 'RiseSelectField',
          props: {
            unselectedLabel: 'Add Effect...',
            value: null,
            options: [
              { key: 'colorize', label: 'Colorize' },
              { key: 'desaturate', label: 'Desaturate' },
              { key: 'invert', label: 'Invert' },
              { key: 'hueShift', label: 'Hue Shift' },
              { key: 'brighten', label: 'Brighten' },
              { key: 'darken', label: 'Darken' },
              { key: 'rotate', label: 'Rotate' },
            ],
            onValueChange: {
              $: 'event',
              action: ['updateMedia', mediaLinkPath, 'addEffect'],
            },
          },
        },
      ]),
      items: (effectsState || []).map((effect) => {
        return {
          key: effect.key,
          label: effect.type,
          onPress: {
            $: 'event',
            action: ['navigate', `${mediaLinkPath}.effects.${effect.key}`],
          },
        }
      }),
    },
  }
}

function gradientValueField(
  context: UIContext,
  key: string | null,
  label: string,
  value: number | null,
  eventAction: any[],
  opts: { min?: number; max?: number; step?: number }
): ComponentDataState {
  const [rootMediaKey, ...mediaPath] = key?.split('.') || []
  // const rootMedia = context.mainState[rootMediaKey === 'liveMedia' ? 'liveMedia' : 'readyMedia']
  const sliderFields =
    rootMediaKey === 'liveMedia'
      ? context.mainState.liveSliderFields
      : context.mainState.readySliderFields
  const sliderField = sliderFields[mediaPath.join('.')]
  const bounceDuration = sliderField?.bounceDuration || DefaultBounceDuration
  return {
    $: 'component',
    key: key || undefined,
    component: 'RiseSliderField',
    props: {
      label,
      longPressSheet:
        key === null
          ? null
          : [
              {
                $: 'component',
                component: 'XStack',
                props: { gap: '$2' },
                children: [
                  {
                    $: 'component',
                    component: 'Button',
                    children: '0',
                    props: {
                      size: '$2',
                      onPress: { $: 'event', action: ['updateValuesIndex', key, 'set', 0] },
                    },
                  },
                  {
                    $: 'component',
                    component: 'Button',
                    children: '1',
                    props: {
                      size: '$2',
                      onPress: { $: 'event', action: ['updateValuesIndex', key, 'set', 1] },
                    },
                  },
                ],
              },
              {
                $: 'component',
                component: 'RiseSliderField',
                key: 'gradient',
                props: {
                  label: 'Smoothing Speed',
                  value: sliderField?.smoothing || DefaultSmoothing,
                  min: 0,
                  max: 1,
                  step: 0.01,
                  onValueChange: {
                    $: 'event',
                    action: ['updateValuesIndex', key, 'smoothing'],
                  },
                },
              },
              {
                $: 'component',
                component: 'Button',
                key: 'adddash',
                children: 'Add Slider to Dashboard',
                props: {
                  onPress: {
                    $: 'event',
                    action: ['updateValuesIndex', key, 'addDashSlider', opts],
                  },
                },
              },
              {
                $: 'component',
                component: 'RiseSliderField',
                key: 'bounceamount',
                props: {
                  label: 'Bounce Amount',
                  value: sliderField?.bounceAmount || DefaultBounceAmount,
                  min: -1,
                  max: 1,
                  step: 0.01,
                  onValueChange: {
                    $: 'event',
                    action: ['updateValuesIndex', key, 'bounceAmount'],
                  },
                },
              },
              {
                $: 'component',
                component: 'RiseSliderField',
                key: 'bounceDuration',
                props: {
                  label: `Bounce Duration: ${bounceDuration.toFixed(1)}sec`,
                  value: bounceDuration,
                  min: 0.2,
                  max: 4,
                  step: 0.1,
                  onValueChange: {
                    $: 'event',
                    action: ['updateValuesIndex', key, 'bounceDuration'],
                  },
                },
              },
              {
                $: 'component',
                component: 'Button',
                key: 'bounce',
                children: 'Bounce',
                props: {
                  onPress: {
                    $: 'event',
                    action: ['updateValuesIndex', key, 'bounce'],
                  },
                },
              },
              {
                $: 'component',
                component: 'Button',
                key: 'adddashBounce',
                children: 'Add Bounce to Dashboard',
                props: {
                  onPress: {
                    $: 'event',
                    action: ['updateValuesIndex', key, 'addDashBounce'],
                  },
                },
              },
            ],
      value,
      onValueChange: {
        $: 'event',
        action: eventAction,
      },
      ...opts,
    },
  }
}

function title(title: string): ComponentDataState {
  return {
    $: 'component',
    key: 'pageTitle',
    component: 'Screen',
    props: {
      title,
    },
  }
}

export function getEffectUI(effectPath: string, effect: Effect, context: UIContext) {
  const removeEffect: ComponentDataState = {
    $: 'component',
    key: 'removeEffect',
    component: 'Button',
    children: 'Remove Effect',
    props: {
      theme: 'red',
      icon: icon('Trash'),
      onPress: [
        {
          $: 'event',
          action: 'navigate-back',
        },
        {
          $: 'event',
          action: ['updateEffect', effectPath, 'remove'],
        },
      ],
    },
  }
  if (effect.type === 'desaturate') {
    return section('Desaturate', [
      title('Desaturate'),
      gradientValueField(
        context,
        `${effectPath}.value`,
        'Value',
        effect.value,
        ['updateEffect', effectPath, 'value'],
        {
          max: 1,
          min: 0,
          step: 0.01,
        }
      ),
      // {
      //   $: 'component',
      //   key: 'value',
      //   component: 'RiseSliderField',
      //   props: {
      //     onValueChange: {
      //       $: 'event',
      //       action: ['updateEffect', effectPath, 'value'],
      //     },
      //     label: 'Value',
      //     value: effect.value,
      //     max: 1,
      //     min: -1,
      //     step: 0.01,
      //   },
      // },
      removeEffect,
    ])
  } else if (effect.type === 'hueShift') {
    return section('Hue Shift', [
      title('Hue Shift'),
      gradientValueField(
        context,
        `${effectPath}.value`,
        'Value',
        effect.value,
        ['updateEffect', effectPath, 'value'],
        {
          max: 180,
          min: -180,
          step: 1,
        }
      ),
      removeEffect,
    ])
  } else if (effect.type === 'colorize') {
    return section('Colorize', [
      title('Colorize'),
      gradientValueField(
        context,
        `${effectPath}.amount`,
        'Amount',
        effect.amount,
        ['updateEffect', effectPath, 'amount'],
        {
          max: 1,
          min: 0,
          step: 0.01,
        }
      ),
      {
        $: 'component',
        key: 'ColorPreview',
        component: 'View',
        props: {
          height: 50,
          backgroundColor: hslToHex(effect.hue, effect.saturation, 0.5),
          borderRadius: '$3',
        },
      },
      gradientValueField(
        context,
        `${effectPath}.hue`,
        'Hue',
        effect.hue,
        ['updateEffect', effectPath, 'hue'],
        {
          max: 360,
          min: 0,
          step: 1,
        }
      ),
      gradientValueField(
        context,
        `${effectPath}.saturation`,
        'Saturation',
        effect.saturation,
        ['updateEffect', effectPath, 'saturation'],
        {
          max: 1,
          min: 0,
          step: 0.01,
        }
      ),
      removeEffect,
    ])
  } else if (effect.type === 'rotate') {
    return section('Rotate', [
      title('Rotate'),
      {
        $: 'component',
        key: 'value',
        component: 'RiseSliderField',
        props: {
          onValueChange: {
            $: 'event',
            action: ['updateEffect', effectPath, 'value'],
          },
          label: 'Value',
          value: effect.value,
          max: 1,
          min: 0,
          step: 0.01,
        },
      },
      removeEffect,
    ])
  } else if (effect.type === 'darken') {
    return section('Darken', [
      title('Darken'),
      gradientValueField(
        context,
        `${effectPath}.value`,
        'Value',
        effect.value,
        ['updateEffect', effectPath, 'value'],
        {
          max: 1,
          min: 0,
          step: 0.01,
        }
      ),
      removeEffect,
    ])
  } else if (effect.type === 'brighten') {
    return section('Brighten', [
      title('Brighten'),
      gradientValueField(
        context,
        `${effectPath}.value`,
        'Value',
        effect.value,
        ['updateEffect', effectPath, 'value'],
        {
          max: 1,
          min: 0,
          step: 0.01,
        }
      ),
      removeEffect,
    ])
  }
  return section(`Effect: ${effect.type}`, [removeEffect])
}
function getVideoTitle(state: VideoMedia, ctx: UIContext): string {
  if (state.track === null) return 'Video - Empty'
  const title = ctx.video.getTrackTitle(state.track)
  return title
}

export function getMediaTitle(state: Media, ctx: UIContext): string {
  if (state.label) return state.label
  if (state.type === 'color') return 'Color'
  if (state.type === 'sequence') return 'Sequence'
  if (state.type === 'layers') return 'Layers'
  if (state.type === 'video') return getVideoTitle(state, ctx)
  return 'Media'
}

const newMediaOptions = [
  { key: 'off', label: 'Off' },
  { key: 'color', label: 'Color' },
  { key: 'video', label: 'Video' },
  { key: 'layers', label: 'Layers' },
  { key: 'sequence', label: 'Sequence' },
]

export function getMediaControls(
  state: Media,
  mediaLinkPath: string,
  ctx: UIContext
): ServerDataState[] {
  return [
    {
      $: 'component',
      key: 'MediaModeSelect',
      component: 'RiseSelectField',
      props: {
        value: state.type,
        hidden: state.type !== 'off',
        onValueChange: {
          $: 'event',
          action: ['updateMedia', mediaLinkPath, 'mode'],
        },
        options: newMediaOptions,
      },
    },
    state.type === 'off'
      ? null
      : {
          $: 'component',
          key: 'MediaMode',
          component: 'XStack',
          props: { gap: '$2' },
          children: [
            {
              $: 'component',
              key: 'link',
              component: 'Button',
              props: {
                f: 1,
                bg: '$color1',
                onPress: {
                  $: 'event',
                  action: ['navigate', mediaLinkPath],
                },
              },
              children: `${getMediaTitle(state, ctx)}`,
            },
            {
              $: 'component',
              key: 'dashboard',
              component: 'Button',
              props: {
                bg: '$color1',
                icon: icon('LayoutDashboard'),
                onPress: {
                  $: 'event',
                  action: [
                    'navigate',
                    mediaLinkPath === 'liveMedia' ? 'liveDashboard' : 'readyDashboard',
                  ],
                },
              },
            },
          ],
        },
  ]
}

export function getTransitionControls(
  transition: Transition,
  transitionKey: string,
  state: TransitionState,
  context: UIContext
): ServerDataState[] {
  return [
    gradientValueField(
      context,
      `${transitionKey}.manual`,
      'Manual',
      state.manual || 0,
      ['updateTransition', transitionKey, 'manual'],
      {
        max: 0.99,
        min: 0,
        step: 0.01,
      }
    ),
    {
      $: 'component',
      key: 'transition',
      component: 'Button',
      children: 'Go Transition',
      props: {
        theme: 'green',
        icon: icon('Play'),
        onPress: {
          $: 'event',
          action: ['updateTransition', transitionKey, 'startAuto'],
        },
      },
    },
    {
      $: 'component',
      key: 'duration',
      component: 'RiseSliderField',
      props: {
        label: `Transition Duration: ${Math.round(transition.duration / 100) / 10}sec`,
        value: transition.duration || 0,
        onValueChange: {
          $: 'event',
          action: ['updateTransition', transitionKey, 'duration'],
        },
        max: 10000,
        min: 0,
        step: 1,
      },
    },
    {
      $: 'component',
      key: 'mode',
      component: 'RiseSelectField',
      props: {
        value: transition.mode,
        label: 'Mode',
        onValueChange: {
          $: 'event',
          action: ['updateTransition', transitionKey, 'mode'],
        },
        options: [
          { key: 'add', label: 'Add' },
          { key: 'mix', label: 'Mix' },
        ],
      },
    },
  ]
}

export function getUIRoot(state: MainState, context: UIContext) {
  return scroll([
    section('Live', getMediaControls(state.liveMedia, 'liveMedia', context)),
    section(
      'Transition',
      getTransitionControls(state.transition, 'mainTransition', state.transitionState, context)
    ),
    section('Ready', getMediaControls(state.readyMedia, 'readyMedia', context)),
    section('Library', [
      {
        $: 'component',
        component: 'Button',
        children: 'Library',
        props: {
          bg: '$color1',
          onPress: { $: 'event', action: ['navigate', 'library'] },
          icon: icon('LibraryBig'),
        },
      },
    ]),
  ])
}

//  function getUIRootLegacy(state: MainState) {
//   return {
//     $: 'component',
//     component: 'ScrollView',
//     props: {
//       padding: '$4',
//       gap: '$4',
//     },
//     children: [
//       {
//         $: 'component',
//         key: '1',
//         component: 'Paragraph',
//         props: {
//           children: `Mode: ${state.mode}`,
//         },
//       },
//       {
//         $: 'component',
//         key: 'mode',
//         component: 'RiseSelectField',
//         props: {
//           value: state.mode,
//           onValueChange: {
//             $: 'event',
//           },
//           options: [
//             { key: 'off', label: 'Off' },
//             { key: 'white', label: 'White' },
//             { key: 'color', label: 'Color' },
//             { key: 'rainbow', label: 'Rainbow' },
//             { key: 'layers', label: 'Layers' },
//             { key: 'video', label: 'Video' },
//             // { key: 'simple', label: 'Simple' },
//             // { key: 'advanced', label: 'Advanced' },
//             // { key: 'beatmatch', label: 'Beatmatch' },
//           ],
//         },
//       },

//       {
//         $: 'component',
//         key: 'offButton',
//         component: 'Button',
//         children: 'All Off',
//         props: {
//           disabled: state.mode === 'off',
//           onPress: {
//             $: 'event',
//           },
//         },
//       },
//       ...getModeControls(state),
//       // {
//       //   $: 'component',
//       //   key: 'button',
//       //   component: 'Button',
//       //   children: {
//       //     $: 'component',
//       //     component: 'XStack',
//       //     key: 'XStack',
//       //     props: {
//       //       jc: 'space-between',
//       //       ai: 'center',
//       //       f: 1,
//       //     },
//       //     children: [
//       //       'Quick Effects',
//       //       { $: 'component', key: 'lol', component: 'RiseIcon', props: { icon: 'Sparkles' } },
//       //     ],
//       //   },
//       //   props: {
//       //     onPress: ['navigate', 'effects'],
//       //     // icon: { $: 'component', key: 'lol', component: 'RiseIcon', props: { icon: 'Check' } },
//       //   },
//       // },
//       {
//         $: 'component',
//         key: 'quickEffects',
//         component: 'Button',
//         children: 'Quick Effects',
//         props: {
//           onPress: {
//             $: 'event',
//             action: ['navigate', 'quickEffects'],
//           },
//           spaceFlex: 1,
//           iconAfter: {
//             $: 'component',
//             key: 'icon',
//             component: 'RiseIcon',
//             props: { icon: 'Sparkles' },
//           },
//         },
//       },
//       {
//         $: 'component',
//         key: 'beatEffects',
//         component: 'Button',
//         children: 'Beat Effects',
//         props: {
//           onPress: {
//             $: 'event',
//             action: ['navigate', 'beatEffects'],
//           },
//           spaceFlex: 1,
//           iconAfter: {
//             $: 'component',
//             key: 'icon',
//             component: 'RiseIcon',
//             props: { icon: 'HeartPulse' },
//           },
//         },
//       },
//     ],
//   }
// }

function getLayersControls(
  mediaPath: string,
  state: LayersMedia,
  ctx: UIContext,
  { header = [], footer = [] }: { header?: ServerDataState[]; footer?: ServerDataState[] } = {}
): ServerDataState {
  return {
    $: 'component',
    component: 'RiseSortableList',
    props: {
      onReorder: {
        $: 'event',
        action: ['updateMedia', mediaPath, 'layerOrder'],
      },
      header: {
        $: 'component',
        component: 'YStack',
        children: header,
      },
      footer: {
        $: 'component',
        key: 'addLayer',
        component: 'YStack',
        children: [
          {
            key: 'addLayer',
            $: 'component',
            component: 'RiseDropdownButton',
            children: 'Add Layer',
            props: {
              options: newMediaOptions,
              onSelect: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'addLayer'],
              },
              buttonProps: {
                icon: icon('Plus'),
                children: 'Add Layer',
              },
            },
          },
          ...footer,
          ...getGenericMediaUI(mediaPath, state, ctx),
        ],
      },
      items: (state.layers || []).map((layer) => {
        return {
          key: layer.key,
          label: getMediaTitle(layer.media, ctx),
          onPress: {
            $: 'event',
            action: ['navigate', `${mediaPath}.layer.${layer.key}`],
          },
        }
      }),
    },
  }
}

function getSequenceControls(
  mediaPath: string,
  state: SequenceMedia,
  ctx: UIContext,
  footer: ServerDataState[] = []
): ServerDataState {
  const activeMedia = getSequenceActiveItem(state)
  return {
    $: 'component',
    component: 'RiseSortableList',
    props: {
      onReorder: {
        $: 'event',
        action: ['updateMedia', mediaPath, 'sequenceOrder'],
      },
      header: section('Sequence Controls', [
        {
          key: 'goNext',
          $: 'component',
          component: 'RiseLongPressSheetButton',
          children: 'Go Next',
          props: {
            sheet: [
              {
                $: 'component',
                component: 'Button',
                children: 'Save to Dashboard',
                props: {
                  onPress: { $: 'event', action: ['updateMedia', mediaPath, 'saveGoNextToDash'] },
                },
              },
            ],
            buttonProps: {
              theme: 'green',
              icon: icon('Play'),
            },
            onPress: {
              $: 'event',
              action: ['updateMedia', mediaPath, 'goNext'],
            },
          },
        },
      ]),
      footer: {
        $: 'component',
        key: 'footer',
        component: 'YStack',
        children: [
          {
            key: 'transitionDuration',
            $: 'component',
            component: 'RiseSliderField',
            props: {
              label: `Transition Duration: ${Math.round((state.transition?.duration || 0) / 1000).toFixed(1)}sec`,
              min: 0,
              max: 15_000,
              step: 10,
              value: state.transition?.duration || DefaultTransitionDuration,
              onValueChange: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'transitionDuration'],
              },
            },
          },
          {
            key: 'add2Sequence',
            $: 'component',
            component: 'RiseDropdownButton',
            props: {
              options: newMediaOptions,
              onSelect: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'addToSequence'],
              },
              buttonProps: {
                icon: icon('Plus'),
                children: 'Add new..',
              },
            },
          },
          {
            key: 'add2SequenceLibrary',
            $: 'component',
            component: 'RiseDropdownButton',
            props: {
              options: ctx.libraryKeys.map((libraryKey) => ({
                key: libraryKey,
                label: libraryKey,
              })),
              onSelect: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'addToSequenceFromLibrary'],
              },
              buttonProps: {
                icon: icon('Plus'),
                children: 'Add from library...',
              },
            },
          },
          ...getGenericMediaUI(mediaPath, state, ctx),
          ...footer,
        ],
      },
      items: (state.sequence || []).map((item) => {
        return {
          key: item.key,
          label: `${getMediaTitle(item.media, ctx)}${item.key === activeMedia?.key ? ' (Active)' : ''}${item.key === state.nextActiveKey ? ' (Transitioning)' : ''}`,
          onPress: {
            $: 'event',
            action: ['navigate', `${mediaPath}.item.${item.key}`],
          },
        }
      }),
    },
  }
}

export function getMediaLayerUI(
  mediaPath: string,
  layer: Layer,
  context: UIContext
): ServerDataState {
  // return [title('Hello world')]
  return getMediaUI(mediaPath, layer.media, context, {
    footer: [],
    header: [
      section('Layer Controls', [
        {
          $: 'component',
          key: 'blendMode',
          component: 'RiseSelectField',
          props: {
            value: layer.blendMode,
            label: 'Blend Mode',
            onValueChange: {
              $: 'event',
              action: ['updateMedia', mediaPath, 'blendMode'],
            },
            options: [
              { key: 'mix', label: 'Blend' },
              { key: 'add', label: 'Add' },
              { key: 'mask', label: 'Mask' },
            ],
          },
        },
        gradientValueField(
          context,
          `${mediaPath}.blendAmount`,
          'Value',
          layer.blendAmount,
          ['updateMedia', mediaPath, 'blendAmount'],
          {
            max: 1,
            min: 0,
            step: 0.01,
          }
        ),
        // {
        //   $: 'component',
        //   key: 'blendAmount',
        //   component: 'RiseSliderField',
        //   props: {
        //     onValueChange: {
        //       $: 'event',
        //       action: ['updateMedia', mediaPath, 'blendAmount'],
        //     },
        //     label: 'Blend Amount',
        //     value: layer.blendAmount,
        //     max: 1,
        //     min: 0,
        //     step: 0.01,
        //   },
        // },
        {
          $: 'component',
          component: 'XStack',
          props: { jc: 'flex-end', marginVertical: '$4' },
          children: [
            {
              $: 'component',
              key: 'removeLayer',
              component: 'Button',
              children: 'Remove Layer',
              props: {
                size: '$2',
                theme: 'red',
                icon: icon('Trash'),
                onPress: [
                  {
                    $: 'event',
                    action: ['updateMedia', mediaPath, 'removeLayer', layer.key],
                  },
                  {
                    $: 'event',
                    action: 'navigate-back',
                  },
                ],
              },
            },
          ],
        },
      ]),
    ],
  })
}

export function getLibraryUI(keys: string[]): ServerDataState[] {
  return [
    { $: 'component', component: 'Screen', props: { title: 'Media Library' } },
    scroll(
      keys.map((key) => ({
        $: 'component',
        component: 'Button',
        children: key,
        props: {
          onPress: [
            { $: 'event', action: 'navigate-back' },
            { $: 'event', action: ['libraryAction', key, 'goReady'] },
          ],
          onLongPress: { $: 'event', action: ['navigate', `library.${key}`] },
        },
      }))
    ),
  ]
}

export function getLibraryKeyUI(key: string): ComponentDataState[] {
  return [
    { $: 'component', component: 'Screen', props: { title: key } },
    {
      $: 'component',
      component: 'Button',
      children: 'Go Ready',
      props: {
        icon: icon('Upload'),
        onPress: {
          $: 'event',
          action: ['libraryAction', key, 'goReady'],
        },
      },
    },
    {
      $: 'component',
      component: 'Button',
      children: 'Delete',
      props: {
        theme: 'red',
        icon: icon('Trash'),
        onPress: [
          { $: 'event', action: 'navigate-back' },
          { $: 'event', action: ['libraryAction', key, 'delete'] },
        ],
      },
    },
  ]
}
function getResetDropdown(mediaPath: string, hidden: boolean = false): ComponentDataState {
  const buttonProps = hidden
    ? null
    : {
        icon: icon('Delete'),
        theme: 'red',
        children: 'Reset...',
      }
  return {
    $: 'component',
    component: 'RiseDropdownButton',
    props: {
      buttonProps,
      options: newMediaOptions,
      onSelect: {
        $: 'event',
        action: ['updateMedia', mediaPath, 'mode'],
      },
    },
  }
}
function getGenericMediaUI(mediaPath: string, media: Media, ctx: UIContext): ComponentDataState[] {
  return [
    {
      $: 'component',
      component: 'Screen',
      props: { title: getMediaTitle(media, ctx) },
    },
    {
      $: 'component',
      component: 'Button',
      children: 'Save Media to Library',
      props: {
        icon: icon('LibraryBig'),
        onPress: {
          $: 'event',
          action: ['updateMedia', mediaPath, 'saveMedia'],
        },
      },
    },
    getResetDropdown(mediaPath),
    {
      $: 'component',
      component: 'Button',
      children: 'Convert...',
      props: {
        icon: icon('Sparkle'),
        iconAfter: icon('ChevronDown'),
        // onPress: {
        //   $: 'event',
        //   action: ['updateMedia', mediaPath, 'saveMedia'],
        // },
      },
    },
    {
      $: 'component',
      component: 'Dialog',
      children: [
        {
          $: 'component',
          component: 'DialogTrigger',
          props: {
            asChild: true,
          },
          children: {
            $: 'component',
            component: 'Button',
            children: 'Edit Title',
            props: {
              icon: icon('Pencil'),
            },
          },
        },
        {
          $: 'component',
          component: 'DialogPortal',
          children: [
            {
              $: 'component',
              component: 'DialogOverlay',
            },
            {
              $: 'component',
              component: 'DialogContent',
              props: {
                minWidth: 300,
              },
              children: [
                {
                  $: 'component',
                  component: 'RiseForm',
                  props: {
                    gap: '$4',
                    onSubmit: {
                      $: 'event',
                      action: ['updateMedia', mediaPath, 'metadata'],
                    },
                    // Comment this out to test async event handling
                    // onSubmit: asyncHandler(async (args: any) => {
                    //   console.log('form submitted', JSON.stringify(args))
                    //   // Simulate a pending state
                    //   return new Promise((resolve) => {
                    //     setTimeout(resolve, 5000)
                    //   })
                    //   // form submitted
                    //   // {"target":{"component":"RiseForm","propKey":"onSubmit",
                    //   // "path":"liveMedia:layer:e71e8271-9dc9-40c0-987b-1000d04f0df3"},
                    //   // "dataState":{"$":"event","key":"26f727b2-7c28-4736-a3d7-a1102e859fcb","async":true},
                    //   // "payload":{"name":"dd"}}
                    // }),
                  },
                  children: [
                    {
                      $: 'component',
                      component: 'RiseTextField',
                      props: {
                        name: 'label',
                        label: {
                          $: 'component',
                          component: 'Label',
                          children: 'Media Label',
                          props: {
                            htmlFor: 'label',
                          },
                        },
                        value: media.label,
                        placeholder: 'Enter label...',
                        autoCapitalize: 'none',
                        autoCorrect: false,
                      },
                    },
                    {
                      $: 'component',
                      component: 'DialogClose',
                      props: { asChild: true },
                      children: {
                        $: 'component',
                        component: 'RiseSubmitButton',
                        children: 'Save',
                        props: {
                          icon: icon('Check'),
                        },
                      },
                    },
                  ],
                },
                {
                  $: 'component',
                  component: 'Unspaced',
                  children: {
                    $: 'component',
                    component: 'DialogClose',
                    props: { asChild: true },
                    children: {
                      $: 'component',
                      component: 'Button',
                      props: {
                        icon: icon('X'),
                        circular: true,
                        size: '$2',
                        top: '$3',
                        right: '$3',
                        position: 'absolute',
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}

function getSequenceItemMaxDuration(mediaPath: string, item: SequenceItem): ServerDataState[] {
  const checkField: ServerDataState = {
    $: 'component',
    key: 'maxDurationSwitch',
    component: 'RiseSwitchField',
    props: {
      label: 'Max Duration',
      value: !!item.maxDuration,
      onCheckedChange: {
        $: 'event',
        action: ['updateMedia', mediaPath, 'maxDuration'],
      },
    },
  }
  if (item.maxDuration == null || item.maxDuration == false) return [checkField]
  return [
    checkField,
    {
      $: 'component',
      key: 'maxDurationSlider',
      component: 'RiseSliderField',
      props: {
        label: `Max Duration - ${item.maxDuration}sec`,
        value: item.maxDuration,
        onValueChange: {
          $: 'event',
          action: ['updateMedia', mediaPath, 'maxDuration'],
        },
        longPressSheet: [
          {
            $: 'component',
            component: 'Button',
            props: {
              onPress: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'maxDuration', 30],
              },
            },
            children: '30 sec',
          },
          {
            $: 'component',
            component: 'Button',
            props: {
              onPress: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'maxDuration', 60],
              },
            },
            children: '60 sec (1 min)',
          },
          {
            $: 'component',
            component: 'Button',
            props: {
              onPress: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'maxDuration', 120],
              },
            },
            children: '120 sec (2 min)',
          },
          {
            $: 'component',
            component: 'Button',
            props: {
              onPress: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'maxDuration', 300],
              },
            },
            children: '300 sec (5 min)',
          },
          {
            $: 'component',
            component: 'Button',
            props: {
              onPress: {
                $: 'event',
                action: ['updateMedia', mediaPath, 'maxDuration', 600],
              },
            },
            children: '600 sec (10 min)',
          },
        ],
        max: 120,
        min: 0.1,
        step: 0.1,
      },
    },
  ]
}

export function getMediaSequenceUI(
  mediaPath: string,
  item: SequenceItem,
  context: UIContext
): ServerDataState {
  let videoEnd: ServerDataState[] = []
  if (item.media.type === 'video') {
    videoEnd = [
      {
        $: 'component',
        key: 'videoEnd',
        component: 'RiseSwitchField',
        props: {
          value: item.goOnVideoEnd || false,
          label: 'Go Next on Video End',
          onCheckedChange: {
            $: 'event',
            action: ['updateMedia', mediaPath, 'goOnVideoEnd'],
          },
        },
      },
    ]
  }
  return getMediaUI(mediaPath, item.media, context, {
    header: [
      section(
        'Sequence Item Controls',
        [
          ...getSequenceItemMaxDuration(mediaPath, item),
          ...videoEnd,
          {
            $: 'component',
            key: 'removeItem',
            component: 'Button',
            children: 'Remove from Sequence',
            props: {
              theme: 'red',
              icon: icon('Trash'),
              onPress: [
                {
                  $: 'event',
                  action: ['updateMedia', mediaPath, 'removeItem', item.key],
                },
                {
                  $: 'event',
                  action: 'navigate-back',
                },
              ],
            },
          },
        ],
        'heading'
      ),
    ],
  })
}

export function getMediaUI(
  mediaPath: string,
  mediaState: Media,
  ctx: UIContext,
  { header = [], footer = [] }: { header?: ServerDataState[]; footer?: ServerDataState[] } = {}
): ServerDataState {
  if (mediaState.type === 'color') {
    return scroll([...header, ...getColorControls(mediaPath, mediaState, ctx), ...footer])
  }
  if (mediaState.type === 'video') {
    return scroll([...header, ...getVideoControls(mediaPath, mediaState, ctx), ...footer])
  }
  if (mediaState.type === 'sequence') {
    return getSequenceControls(mediaPath, mediaState, ctx)
  }
  if (mediaState.type === 'layers') {
    return getLayersControls(mediaPath, mediaState, ctx, { header, footer })
  }
  return scroll([
    ...header,
    title(mediaState.type),
    {
      $: 'component',
      component: 'Text',
      children: mediaState.type,
    },
    getResetDropdown(mediaPath, true),
    ...footer,
  ])
}

// export function getQuickEffects(): ServerDataState {
//   return {
//     $: 'component',
//     component: 'YStack',
//     props: {
//       padding: '$4',
//       gap: '$4',
//     },
//     children: [
//       { $: 'component', key: 'flash', component: 'Button', children: 'Flash' },
//       { $: 'component', key: 'waveIn', component: 'Button', children: 'WaveIn' },
//       { $: 'component', key: 'waveOut', component: 'Button', children: 'WaveOut' },
//     ],
//   }
// }

// export function getBeatEffects(mainState: MainState): ServerDataState {
//   return {
//     $: 'component',
//     component: 'YStack',
//     props: {
//       gap: '$4',
//     },
//     children: [
//       section(
//         'Beat Effect',
//         [
//           {
//             $: 'component',
//             key: 'intensitySlider',
//             component: 'RiseSliderField',
//             props: {
//               label: 'Intensity',
//               value: { $: 'ref', ref: ['mainState', 'beatEffect', 'intensity'] },
//               max: 100,
//               min: 0,
//               step: 1,
//               onValueChange: {
//                 $: 'event',
//               },
//             },
//           },
//           {
//             $: 'component',
//             key: 'waveLengthSlider',
//             component: 'RiseSliderField',
//             props: {
//               label: 'Wave Length %',
//               value: { $: 'ref', ref: ['mainState', 'beatEffect', 'waveLength'] },
//               max: 1,
//               min: 0,
//               step: 0.01,
//               onValueChange: {
//                 $: 'event',
//               },
//             },
//           },
//           {
//             $: 'component',
//             key: 'dropoffSlider',
//             component: 'RiseSliderField',
//             props: {
//               label: 'DropOff %',
//               value: { $: 'ref', ref: ['mainState', 'beatEffect', 'dropoff'] },
//               max: 1,
//               min: 0,
//               step: 0.01,
//               onValueChange: {
//                 $: 'event',
//               },
//             },
//           },
//           {
//             $: 'component',
//             key: 'effectSelect',
//             component: 'RiseSelectField',
//             props: {
//               value: mainState.beatEffect.effect,
//               options: [
//                 { key: 'flash', label: 'flash' },
//                 { key: 'waveIn', label: 'waveIn' },
//                 { key: 'waveOut', label: 'waveOut' },
//               ],
//               onValueChange: {
//                 $: 'event',
//               },
//             },
//           },
//         ],
//         'effect'
//       ),
//       section(
//         'Manual Beat Pace',
//         [
//           {
//             $: 'component',
//             key: 'manualBeatEnabledSwitch',
//             component: 'RiseSwitchField',
//             props: {
//               label: 'Enabled',
//               value: { $: 'ref', ref: ['mainState', 'manualBeat', 'enabled'] },
//               onCheckedChange: {
//                 $: 'event',
//               },
//             },
//           },
//           {
//             $: 'component',
//             key: 'tapBeat',
//             component: 'Button',
//             children: 'Tap Beat',
//             props: {
//               onPress: null,
//               onPressOut: null,
//               onPressIn: {
//                 $: 'event',
//                 action: 'manualTapBeat',
//               },
//               spaceFlex: 1,
//               iconAfter: icon('Activity'),
//             },
//           },
//         ],
//         'manualBeat'
//       ),
//       section('Denon Stagelinq', [
//         { $: 'ref', ref: ['stagelinqConnection'] },
//         // simpleLabel('Coming Soon')
//       ]),
//       // { $: 'component', key: 'waveIn', component: 'Button', children: 'WaveIn' },
//       // { $: 'component', key: 'waveOut', component: 'Button', children: 'WaveOut' },
//     ],
//   }
// }
