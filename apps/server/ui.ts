import { ComponentDataState, DataState, DataStateType } from '@react-native-templates/core'

import { hslToHex } from './color'
import { EGVideo } from './eg-video-playback'
import { UPRISING } from './flag'
import {
  ColorMedia,
  Effect,
  Effects,
  Layer,
  LayersMedia,
  MainState,
  Media,
  SequenceMedia,
  Transition,
  TransitionState,
  VideoMedia,
} from './state-schema'

export type UIContext = {
  video: EGVideo
}

function icon(name: string): ComponentDataState {
  return {
    $: DataStateType.Component,
    key: 'icon',
    component: 'Icon',
    props: { icon: name },
  }
}

function section(title: string, children: DataState[], key?: string): DataState {
  return {
    $: DataStateType.Component,
    component: 'YStack',
    key: key || title,
    props: {
      padding: '$4',
      gap: '$2',
    },
    children: [
      {
        $: DataStateType.Component,
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
    ],
  }
}

function getModeControls(state: MainState) {
  if (state.mode === 'color') {
    return [
      {
        $: DataStateType.Component,
        key: 'colorPreview',
        component: 'View',
        props: {
          height: 50,
          backgroundColor: hslToHex(state.color.h, state.color.s, state.color.l),
          borderRadius: '$3',
        },
      },
      {
        $: DataStateType.Component,
        key: 'hueSlider',
        component: 'SliderField',
        props: {
          label: 'Hue',
          value: state.color.h,
          max: 360,
          min: 0,
          step: 1,
        },
      },
      {
        $: DataStateType.Component,
        key: 'saturationSlider',
        component: 'SliderField',
        props: {
          label: 'Saturation',
          value: state.color.s,
          max: 1,
          min: 0,
          step: 0.01,
        },
      },
      {
        $: DataStateType.Component,
        key: 'lightnessSlider',
        component: 'SliderField',
        props: {
          label: 'Lightness',
          value: state.color.l,
          max: 1,
          min: 0,
          step: 0.01,
        },
      },
    ] as const
  }
  if (state.mode === 'video') {
    return [
      {
        $: DataStateType.Component,
        key: 'selectVideo',
        component: 'SelectField',
        props: {
          value: state.video.track,
          options: { $: 'ref', ref: ['videoList'] },
        },
      },
      {
        $: DataStateType.Component,
        key: 'restart',
        component: 'Button',
        children: 'Restart Video',
      },
    ]
  }
  return [] as const
}

function scroll(children: any[]) {
  return {
    $: DataStateType.Component,
    component: 'ScrollView',
    props: {
      padding: '$4',
      gap: '$4',
    },
    children,
  }
}

function getVideoControls(mediaPath: string, state: VideoMedia, context: UIContext): DataState[] {
  const player = context.video.getPlayer(state.id)
  return [
    {
      $: DataStateType.Component,
      key: 'selectVideo',
      component: 'SelectField',
      props: {
        unselectedLabel: 'Select Video...',
        value: state.track,
        onValue: {
          $: DataStateType.Event,
          action: ['updateMedia', mediaPath, 'track'],
        },
        options: { $: DataStateType.Ref, ref: ['videoList'] },
      },
    },
    {
      $: DataStateType.Component,
      key: 'restart',
      component: 'Button',
      children: 'Restart Video',
      props: {
        onPress: {
          $: DataStateType.Event,
          action: ['updateMedia', mediaPath, 'restart'],
        },
      },
    },
    {
      $: DataStateType.Component,
      key: 'loopBounce',
      component: 'SwitchField',
      props: {
        value: state?.params?.loopBounce || false,
        label: 'Loop Bounce',
        onValue: {
          $: DataStateType.Event,
          action: ['updateMedia', mediaPath, 'loopBounce'],
        },
      },
    },
    {
      $: DataStateType.Component,
      key: 'reverse',
      component: 'SwitchField',
      props: {
        value: state?.params?.reverse || false,
        label: 'Reverse Playback',
        onValue: {
          $: DataStateType.Event,
          action: ['updateMedia', mediaPath, 'reverse'],
        },
      },
    },
    {
      $: DataStateType.Component,
      key: 'info',
      component: 'Label',
      children: `Frame Count: ${player.getFrameCount()}`,
    },
    {
      $: DataStateType.Component,
      key: 'effect',
      component: 'Button',
      children: 'Effects',
      props: {
        icon: icon('Sparkles'),
        onPress: {
          $: DataStateType.Event,
          action: ['navigate', `${mediaPath}:effects`],
        },
      },
    },
  ]
}

function getColorControls(mediaPath: string, state: ColorMedia): DataState[] {
  return [
    {
      $: DataStateType.Component,
      key: 'ColorPreview',
      component: 'View',
      props: {
        height: 50,
        backgroundColor: hslToHex(state.h, state.s, state.l),
        borderRadius: '$3',
      },
    },
    {
      $: DataStateType.Component,
      key: 'ColorHueSlider',
      component: 'SliderField',
      props: {
        label: 'Hue',
        value: state.h,
        onValue: {
          $: DataStateType.Event,
          action: ['updateMedia', mediaPath, 'color', 'h'],
        },
        max: 360,
        min: 0,
        step: 1,
      },
    },
    {
      $: DataStateType.Component,
      key: 'ColorSaturationSlider',
      component: 'SliderField',
      props: {
        label: 'Saturation',
        value: state.s,
        onValue: {
          $: DataStateType.Event,
          action: ['updateMedia', mediaPath, 'color', 's'],
        },
        max: 1,
        min: 0,
        step: 0.01,
      },
    },
    {
      $: DataStateType.Component,
      key: 'ColorLightnessSlider',
      component: 'SliderField',
      props: {
        label: 'Lightness',
        value: state.l,
        onValue: {
          $: DataStateType.Event,
          action: ['updateMedia', mediaPath, 'color', 'l'],
        },
        max: 1,
        min: 0,
        step: 0.01,
      },
    },
  ]
}

export function getEffectsUI(mediaLinkPath: string, effectsState: Effects | undefined): DataState {
  return {
    $: DataStateType.Component,
    component: 'SortableList',
    props: {
      onReorder: ['updateMedia', mediaLinkPath, 'effectOrder'],
      footer: {
        $: DataStateType.Component,
        key: 'addEffect',
        component: 'SelectField',
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
          onValue: {
            $: DataStateType.Event,
            action: ['updateMedia', mediaLinkPath, 'addEffect'],
          },
        },
      },
      items: (effectsState || []).map((effect) => {
        return {
          key: effect.key,
          label: effect.type,
          onPress: {
            $: DataStateType.Event,
            action: ['navigate', `${mediaLinkPath}:effects:${effect.key}`],
          },
        }
      }),
    },
  }
}

export function getEffectUI(effectPath: string[], effect: Effect) {
  const removeEffect: ComponentDataState = {
    $: DataStateType.Component,
    key: 'removeEffect',
    component: 'Button',
    children: 'Remove Effect',
    props: {
      onPress: [
        {
          $: DataStateType.Event,
          action: 'navigate-back',
        },
        {
          $: DataStateType.Event,
          action: ['updateEffect', effectPath, 'remove'],
        },
      ],
    },
  }
  if (effect.type === 'desaturate') {
    return section('Desaturate', [
      {
        $: DataStateType.Component,
        key: 'value',
        component: 'SliderField',
        props: {
          onValue: {
            $: DataStateType.Event,
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
  } else if (effect.type === 'hueShift') {
    return section('Hue Shift', [
      {
        $: DataStateType.Component,
        key: 'value',
        component: 'SliderField',
        props: {
          onValue: {
            $: DataStateType.Event,
            action: ['updateEffect', effectPath, 'value'],
          },
          label: 'Value',
          value: effect.value,
          max: 180,
          min: -180,
          step: 1,
        },
      },
      removeEffect,
    ])
  } else if (effect.type === 'colorize') {
    return section('Colorize', [
      {
        $: DataStateType.Component,
        key: 'amount',
        component: 'SliderField',
        props: {
          onValue: {
            $: DataStateType.Event,
            action: ['updateEffect', effectPath, 'amount'],
          },
          label: 'Amount',
          value: effect.amount,
          max: 1,
          min: 0,
          step: 0.01,
        },
      },
      {
        $: DataStateType.Component,
        key: 'ColorPreview',
        component: 'View',
        props: {
          height: 50,
          backgroundColor: hslToHex(effect.hue, effect.saturation, 0.5),
          borderRadius: '$3',
        },
      },
      {
        $: DataStateType.Component,
        key: 'saturation',
        component: 'SliderField',
        props: {
          onValue: {
            $: DataStateType.Event,
            action: ['updateEffect', effectPath, 'saturation'],
          },
          label: 'Saturation',
          value: effect.saturation,
          max: 1,
          min: 0,
          step: 0.01,
        },
      },
      {
        $: DataStateType.Component,
        key: 'hue',
        component: 'SliderField',
        props: {
          onValue: {
            $: DataStateType.Event,
            action: ['updateEffect', effectPath, 'hue'],
          },
          label: 'Hue',
          value: effect.hue,
          max: 360,
          min: 0,
          step: 1,
        },
      },
      removeEffect,
    ])
  } else if (effect.type === 'rotate') {
    return section('Rotate', [
      {
        $: DataStateType.Component,
        key: 'value',
        component: 'SliderField',
        props: {
          onValue: {
            $: DataStateType.Event,
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
      {
        $: DataStateType.Component,
        key: 'value',
        component: 'SliderField',
        props: {
          onValue: {
            $: DataStateType.Event,
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
  } else if (effect.type === 'brighten') {
    return section('Brighten', [
      {
        $: DataStateType.Component,
        key: 'value',
        component: 'SliderField',
        props: {
          onValue: {
            $: DataStateType.Event,
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
  }
  return section(`Effect: ${effect.type}`, [removeEffect])
}
function getVideoTitle(state: VideoMedia): string {
  if (state.track === null) return 'Video - Empty'
  return `Video - ${state.track}`
}
function getMediaTitle(state: Media): string {
  if (state.type === 'color') return 'Color'
  if (state.type === 'video') return getVideoTitle(state)
  return 'Media'
}

const newMediaOptions = [
  { key: 'off', label: 'Off' },
  { key: 'color', label: 'Color' },
  { key: 'video', label: 'Video' },
  { key: 'layers', label: 'Layers' },
  { key: 'sequence', label: 'Sequence' },
]

export function getMediaControls(state: Media, mediaLinkPath: string): DataState[] {
  if (state.type === 'off') {
    return [
      {
        $: DataStateType.Component,
        key: 'MediaMode',
        component: 'SelectField',
        props: {
          value: state.type,
          onValue: {
            $: DataStateType.Event,
            action: ['updateMedia', mediaLinkPath, 'mode'],
          },
          options: newMediaOptions,
        },
      },
    ]
  }
  return [
    {
      $: DataStateType.Component,
      key: 'MediaMode',
      component: 'XStack',
      children: [
        {
          $: DataStateType.Component,
          key: 'link',
          component: 'Button',
          props: {
            f: 1,
            onPress: {
              $: DataStateType.Event,
              action: ['navigate', mediaLinkPath],
            },
          },
          children: `Open ${getMediaTitle(state)}`,
        },
        {
          $: DataStateType.Component,
          key: 'clear',
          component: 'Button',
          props: {
            chromeless: true,
            backgroundColor: '$transparent',
            onPress: {
              $: DataStateType.Event,
              action: ['updateMedia', mediaLinkPath, 'clear'],
            },
          },
          children: {
            $: DataStateType.Component,
            key: 'icon',
            component: 'Icon',
            props: { icon: 'X' },
          },
        },
      ],
    },
  ]
}

export function getTransitionControls(transition: Transition, state: TransitionState): DataState[] {
  return [
    {
      $: DataStateType.Component,
      key: 'manual',
      component: 'SliderField',
      props: {
        label: 'Manual',
        value: state.manual || 0,
        onValue: {
          $: DataStateType.Event,
          action: ['updateTransition', 'manual'],
        },
        max: 1,
        min: 0,
        step: 0.01,
      },
    },
    {
      $: DataStateType.Component,
      key: 'transition',
      component: 'Button',
      children: 'Start Transition',
      props: {
        onPress: {
          $: DataStateType.Event,
          action: ['updateTransition', 'startAuto'],
        },
      },
    },
    {
      $: DataStateType.Component,
      key: 'duration',
      component: 'SliderField',
      props: {
        label: `Duration ${Math.round(transition.duration / 100) / 10}sec`,
        value: transition.duration || 0,
        onValue: {
          $: DataStateType.Event,
          action: ['updateTransition', 'duration'],
        },
        max: 10000,
        min: 0,
        step: 1,
      },
    },
  ]
}

export function getUIRootUPRISING(state: MainState) {
  return scroll([
    section('Live', getMediaControls(state.liveMedia, 'liveMedia')),
    section('Ready', getMediaControls(state.readyMedia, 'readyMedia')),
    section('Transition', getTransitionControls(state.transition, state.transitionState)),
  ])
}

export function getUIRoot(state: MainState) {
  if (UPRISING) return getUIRootUPRISING(state)
  return getUIRootLegacy(state)
}

export function getUIRootLegacy(state: MainState) {
  return {
    $: DataStateType.Component,
    component: 'ScrollView',
    props: {
      padding: '$4',
      gap: '$4',
    },
    children: [
      {
        $: DataStateType.Component,
        key: '1',
        component: 'Paragraph',
        props: {
          children: `Mode: ${state.mode}`,
        },
      },
      {
        $: DataStateType.Component,
        key: 'mode',
        component: 'SelectField',
        props: {
          value: state.mode,
          options: [
            { key: 'off', label: 'Off' },
            { key: 'white', label: 'White' },
            { key: 'color', label: 'Color' },
            { key: 'rainbow', label: 'Rainbow' },
            { key: 'layers', label: 'Layers' },
            { key: 'video', label: 'Video' },
            // { key: 'simple', label: 'Simple' },
            // { key: 'advanced', label: 'Advanced' },
            // { key: 'beatmatch', label: 'Beatmatch' },
          ],
        },
      },

      {
        $: DataStateType.Component,
        key: 'offButton',
        component: 'Button',
        children: 'All Off',
        props: {
          disabled: state.mode === 'off',
        },
      },
      ...getModeControls(state),
      // {
      //   $: DataStateType.Component,
      //   key: 'button',
      //   component: 'Button',
      //   children: {
      //     $: DataStateType.Component,
      //     component: 'XStack',
      //     key: 'XStack',
      //     props: {
      //       jc: 'space-between',
      //       ai: 'center',
      //       f: 1,
      //     },
      //     children: [
      //       'Quick Effects',
      //       { $: DataStateType.Component, key: 'lol', component: 'Icon', props: { icon: 'Sparkles' } },
      //     ],
      //   },
      //   props: {
      //     onPress: ['navigate', 'effects'],
      //     // icon: { $: DataStateType.Component, key: 'lol', component: 'Icon', props: { icon: 'Check' } },
      //   },
      // },

      {
        $: DataStateType.Component,
        key: 'quickEffects',
        component: 'Button',
        children: 'Quick Effects',
        props: {
          onPress: {
            $: DataStateType.Event,
            action: ['navigate', 'quickEffects'],
          },
          spaceFlex: 1,
          iconAfter: {
            $: DataStateType.Component,
            key: 'icon',
            component: 'Icon',
            props: { icon: 'Sparkles' },
          },
        },
      },
      {
        $: DataStateType.Component,
        key: 'beatEffects',
        component: 'Button',
        children: 'Beat Effects',
        props: {
          onPress: {
            $: DataStateType.Event,
            action: ['navigate', 'beatEffects'],
          },
          spaceFlex: 1,
          iconAfter: {
            $: DataStateType.Component,
            key: 'icon',
            component: 'Icon',
            props: { icon: 'HeartPulse' },
          },
        },
      },
    ],
  }
}

function getSequenceControls(
  mediaLinkPath: string,
  state: SequenceMedia,
  context: UIContext
): DataState[] {
  return []
}

function getLayersControls(
  mediaLinkPath: string,
  state: LayersMedia,
  context: UIContext,
  footer: DataState[] = []
): DataState {
  return {
    $: DataStateType.Component,
    component: 'SortableList',
    props: {
      onReorder: {
        $: DataStateType.Event,
        action: ['updateMedia', mediaLinkPath, 'layerOrder'],
      },
      footer: {
        $: DataStateType.Component,
        key: 'addLayer',
        component: 'YStack',
        children: [
          {
            key: 'addLayer',
            $: DataStateType.Component,
            component: 'SelectField',
            props: {
              value: null,
              onValue: {
                $: DataStateType.Event,
                action: ['updateMedia', mediaLinkPath, 'addLayer'],
              },
              options: newMediaOptions,
              unselectedLabel: 'Add Layer...',
            },
          },
          ...footer,
        ],
      },
      items: (state.layers || []).map((layer) => {
        return {
          key: layer.key,
          label: layer.media.type,
          onPress: {
            $: DataStateType.Event,
            action: ['navigate', `${mediaLinkPath}:layer:${layer.key}`],
          },
        }
      }),
    },
  }
}

export function getMediaLayerUI(mediaPath: string, layer: Layer, context: UIContext): DataState {
  return getMediaUI(mediaPath, layer.media, context, [
    section('Layer Controls', [
      {
        $: DataStateType.Component,
        key: 'blendMode',
        component: 'SelectField',
        props: {
          value: layer.blendMode,
          label: 'Blend Mode',
          onValue: {
            $: DataStateType.Event,
            action: ['updateMedia', mediaPath, 'blendMode'],
          },
          options: [
            { key: 'mix', label: 'Blend' },
            { key: 'add', label: 'Add' },
            { key: 'mask', label: 'Mask' },
          ],
        },
      },
      {
        $: DataStateType.Component,
        key: 'blendAmount',
        component: 'SliderField',
        props: {
          onValue: {
            $: DataStateType.Event,
            action: ['updateMedia', mediaPath, 'blendAmount'],
          },
          label: 'Blend Amount',
          value: layer.blendAmount,
          max: 1,
          min: 0,
          step: 0.01,
        },
      },
      {
        $: DataStateType.Component,
        key: 'removeLayer',
        component: 'Button',
        children: 'Remove Layer',
        props: {
          onPress: [
            {
              $: DataStateType.Event,
              action: ['updateMedia', mediaPath, 'removeLayer', layer.key],
            },
            {
              $: DataStateType.Event,
              action: 'navigate-back',
            },
          ],
        },
      },
    ]),
  ])
}

export function getMediaUI(
  mediaPath: string,
  mediaState: Media,
  context: UIContext,
  footer: DataState[] = []
): DataState {
  if (mediaState.type === 'color')
    return scroll([...getColorControls(mediaPath, mediaState), ...footer])
  if (mediaState.type === 'video')
    return scroll([...getVideoControls(mediaPath, mediaState, context), ...footer])
  if (mediaState.type === 'sequence')
    return scroll([...getSequenceControls(mediaPath, mediaState, context), ...footer])
  if (mediaState.type === 'layers') return getLayersControls(mediaPath, mediaState, context, footer)
  return scroll([
    {
      $: DataStateType.Component,
      component: 'Text',
      children: mediaState.type,
    },
    ...footer,
  ])
}

export function getQuickEffects() {
  return {
    $: DataStateType.Component,
    component: 'YStack',
    props: {
      padding: '$4',
      gap: '$4',
    },
    children: [
      { $: DataStateType.Component, key: 'flash', component: 'Button', children: 'Flash' },
      { $: DataStateType.Component, key: 'waveIn', component: 'Button', children: 'WaveIn' },
      { $: DataStateType.Component, key: 'waveOut', component: 'Button', children: 'WaveOut' },
    ],
  }
}

export function getBeatEffects(mainState: MainState) {
  return {
    $: DataStateType.Component,
    component: 'YStack',
    props: {
      gap: '$4',
    },
    children: [
      section(
        'Beat Effect',
        [
          {
            $: DataStateType.Component,
            key: 'intensity',
            component: 'SliderField',
            props: {
              label: 'Intensity',
              value: { $: DataStateType.Ref, ref: ['mainState', 'beatEffect', 'intensity'] },
              max: 100,
              min: 0,
              step: 1,
            },
          },
          {
            $: DataStateType.Component,
            key: 'waveLength',
            component: 'SliderField',
            props: {
              label: 'Wave Length %',
              value: { $: DataStateType.Ref, ref: ['mainState', 'beatEffect', 'waveLength'] },
              max: 1,
              min: 0,
              step: 0.01,
            },
          },
          {
            $: DataStateType.Component,
            key: 'dropoff',
            component: 'SliderField',
            props: {
              label: 'DropOff %',
              value: { $: DataStateType.Ref, ref: ['mainState', 'beatEffect', 'dropoff'] },
              max: 1,
              min: 0,
              step: 0.01,
            },
          },
          {
            $: DataStateType.Component,
            key: 'effect',
            component: 'SelectField',
            props: {
              value: mainState.beatEffect.effect,
              options: [
                { key: 'flash', label: 'flash' },
                { key: 'waveIn', label: 'waveIn' },
                { key: 'waveOut', label: 'waveOut' },
              ],
            },
          },
        ],
        'effect'
      ),
      section(
        'Manual Beat Pace',
        [
          {
            $: DataStateType.Component,
            key: 'manualBeatEnabled',
            component: 'SwitchField',
            props: {
              label: 'Enabled',
              value: { $: DataStateType.Ref, ref: ['mainState', 'manualBeat', 'enabled'] },
            },
          },
          {
            $: DataStateType.Component,
            key: 'tapBeat',
            component: 'Button',
            children: 'Tap Beat',
            props: {
              onPress: null,
              onPressOut: null,
              onPressIn: {
                $: DataStateType.Event,
                action: 'manualTapBeat',
              },
              spaceFlex: 1,
              iconAfter: icon('Activity'),
            },
          },
        ],
        'manualBeat'
      ),
      section('Denon Stagelinq', [
        { $: DataStateType.Ref, ref: ['stagelinqConnection'] },
        // simpleLabel('Coming Soon')
      ]),

      // { $: DataStateType.Component, key: 'waveIn', component: 'Button', children: 'WaveIn' },
      // { $: DataStateType.Component, key: 'waveOut', component: 'Button', children: 'WaveOut' },
    ],
  }
}
