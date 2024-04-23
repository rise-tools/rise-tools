import { ComponentDataState, DataState } from '@final-ui/react'

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
    $: 'component',
    key: 'icon',
    component: 'RiseIcon',
    props: { icon: name },
  }
}

function section(title: string, children: DataState[], key?: string): DataState {
  return {
    $: 'component',
    component: 'YStack',
    key: key || title,
    props: {
      padding: '$4',
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
    ],
  }
}

function getModeControls(state: MainState) {
  if (state.mode === 'color') {
    return [
      {
        $: 'component',
        key: 'colorPreview',
        component: 'View',
        props: {
          height: 50,
          backgroundColor: hslToHex(state.color.h, state.color.s, state.color.l),
          borderRadius: '$3',
        },
      },
      {
        $: 'component',
        key: 'hueSlider',
        component: 'RiseSliderField',
        props: {
          label: 'Hue',
          value: state.color.h,
          max: 360,
          min: 0,
          step: 1,
          onValueChange: {
            $: 'event',
          },
        },
      },
      {
        $: 'component',
        key: 'saturationSlider',
        component: 'RiseSliderField',
        props: {
          label: 'Saturation',
          value: state.color.s,
          max: 1,
          min: 0,
          step: 0.01,
          onValueChange: {
            $: 'event',
          },
        },
      },
      {
        $: 'component',
        key: 'lightnessSlider',
        component: 'RiseSliderField',
        props: {
          label: 'Lightness',
          value: state.color.l,
          max: 1,
          min: 0,
          step: 0.01,
          onValueChange: {
            $: 'event',
          },
        },
      },
    ] as const
  }
  if (state.mode === 'video') {
    return [
      {
        $: 'component',
        key: 'selectVideo',
        component: 'RiseSelectField',
        props: {
          value: state.video.track,
          onValueChange: {
            $: 'event',
          },
          options: { $: 'ref', ref: ['videoList'] },
        },
      },
      {
        $: 'component',
        key: 'restart',
        component: 'Button',
        children: 'Restart Video',
        props: {
          onPress: {
            $: 'event',
          },
        },
      },
    ]
  }
  return [] as const
}

function scroll(children: any[]): DataState {
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

function getVideoControls(mediaPath: string, state: VideoMedia, context: UIContext): DataState[] {
  const player = context.video.getPlayer(state.id)
  return [
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
      key: 'restart',
      component: 'Button',
      children: 'Restart Video',
      props: {
        onPress: {
          $: 'event',
          action: ['updateMedia', mediaPath, 'restart'],
        },
      },
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
    {
      $: 'component',
      key: 'info',
      component: 'Label',
      children: `Frame Count: ${player.getFrameCount()}`,
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
          action: ['navigate', `${mediaPath}:effects`],
        },
      },
    },
  ]
}

function getColorControls(mediaPath: string, state: ColorMedia): DataState[] {
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
  ]
}

export function getEffectsUI(mediaLinkPath: string, effectsState: Effects | undefined): DataState {
  return {
    $: 'component',
    component: 'RiseSortableList',
    props: {
      onReorder: {
        $: 'event',
        action: ['updateMedia', mediaLinkPath, 'effectOrder'],
      },
      footer: {
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
      items: (effectsState || []).map((effect) => {
        return {
          key: effect.key,
          label: effect.type,
          onPress: {
            $: 'event',
            action: ['navigate', `${mediaLinkPath}:effects:${effect.key}`],
          },
        }
      }),
    },
  }
}

export function getEffectUI(effectPath: string[], effect: Effect) {
  const removeEffect: ComponentDataState = {
    $: 'component',
    key: 'removeEffect',
    component: 'Button',
    children: 'Remove Effect',
    props: {
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
  } else if (effect.type === 'hueShift') {
    return section('Hue Shift', [
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
        $: 'component',
        key: 'amount',
        component: 'RiseSliderField',
        props: {
          onValueChange: {
            $: 'event',
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
        $: 'component',
        key: 'ColorPreview',
        component: 'View',
        props: {
          height: 50,
          backgroundColor: hslToHex(effect.hue, effect.saturation, 0.5),
          borderRadius: '$3',
        },
      },
      {
        $: 'component',
        key: 'saturation',
        component: 'RiseSliderField',
        props: {
          onValueChange: {
            $: 'event',
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
        $: 'component',
        key: 'hue',
        component: 'RiseSliderField',
        props: {
          onValueChange: {
            $: 'event',
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
  } else if (effect.type === 'brighten') {
    return section('Brighten', [
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
        $: 'component',
        key: 'MediaMode',
        component: 'RiseSelectField',
        props: {
          value: state.type,
          onValueChange: {
            $: 'event',
            action: ['updateMedia', mediaLinkPath, 'mode'],
          },
          options: newMediaOptions,
        },
      },
    ]
  }
  return [
    {
      $: 'component',
      key: 'MediaMode',
      component: 'XStack',
      children: [
        {
          $: 'component',
          key: 'link',
          component: 'Button',
          props: {
            f: 1,
            onPress: {
              $: 'event',
              action: ['navigate', mediaLinkPath],
            },
          },
          children: `Open ${getMediaTitle(state)}`,
        },
        {
          $: 'component',
          key: 'clear',
          component: 'Button',
          props: {
            chromeless: true,
            backgroundColor: '$transparent',
            onPress: {
              $: 'event',
              action: ['updateMedia', mediaLinkPath, 'clear'],
            },
          },
          children: {
            $: 'component',
            key: 'icon',
            component: 'RiseIcon',
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
      $: 'component',
      key: 'manual',
      component: 'RiseSliderField',
      props: {
        label: 'Manual',
        value: state.manual || 0,
        onValueChange: {
          $: 'event',
          action: ['updateTransition', 'manual'],
        },
        max: 1,
        min: 0,
        step: 0.01,
      },
    },
    {
      $: 'component',
      key: 'transition',
      component: 'Button',
      children: 'Start Transition',
      props: {
        onPress: {
          $: 'event',
          action: ['updateTransition', 'startAuto'],
        },
      },
    },
    {
      $: 'component',
      key: 'duration',
      component: 'RiseSliderField',
      props: {
        label: `Duration ${Math.round(transition.duration / 100) / 10}sec`,
        value: transition.duration || 0,
        onValueChange: {
          $: 'event',
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
    $: 'component',
    component: 'ScrollView',
    props: {
      padding: '$4',
      gap: '$4',
    },
    children: [
      {
        $: 'component',
        key: '1',
        component: 'Paragraph',
        props: {
          children: `Mode: ${state.mode}`,
        },
      },
      {
        $: 'component',
        key: 'mode',
        component: 'RiseSelectField',
        props: {
          value: state.mode,
          onValueChange: {
            $: 'event',
          },
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
        $: 'component',
        key: 'offButton',
        component: 'Button',
        children: 'All Off',
        props: {
          disabled: state.mode === 'off',
          onPress: {
            $: 'event',
          },
        },
      },
      ...getModeControls(state),
      // {
      //   $: 'component',
      //   key: 'button',
      //   component: 'Button',
      //   children: {
      //     $: 'component',
      //     component: 'XStack',
      //     key: 'XStack',
      //     props: {
      //       jc: 'space-between',
      //       ai: 'center',
      //       f: 1,
      //     },
      //     children: [
      //       'Quick Effects',
      //       { $: 'component', key: 'lol', component: 'RiseIcon', props: { icon: 'Sparkles' } },
      //     ],
      //   },
      //   props: {
      //     onPress: ['navigate', 'effects'],
      //     // icon: { $: 'component', key: 'lol', component: 'RiseIcon', props: { icon: 'Check' } },
      //   },
      // },

      {
        $: 'component',
        key: 'quickEffects',
        component: 'Button',
        children: 'Quick Effects',
        props: {
          onPress: {
            $: 'event',
            action: ['navigate', 'quickEffects'],
          },
          spaceFlex: 1,
          iconAfter: {
            $: 'component',
            key: 'icon',
            component: 'RiseIcon',
            props: { icon: 'Sparkles' },
          },
        },
      },
      {
        $: 'component',
        key: 'beatEffects',
        component: 'Button',
        children: 'Beat Effects',
        props: {
          onPress: {
            $: 'event',
            action: ['navigate', 'beatEffects'],
          },
          spaceFlex: 1,
          iconAfter: {
            $: 'component',
            key: 'icon',
            component: 'RiseIcon',
            props: { icon: 'HeartPulse' },
          },
        },
      },
    ],
  }
}

// tbd: implement this
function getSequenceControls(
  // eslint-disable-next-line
  mediaLinkPath: string,
  // eslint-disable-next-line
  state: SequenceMedia,
  // eslint-disable-next-line
  context: UIContext
): DataState[] {
  return []
}

function getLayersList(
  mediaLinkPath: string,
  state: LayersMedia,
  context: UIContext,
  { header = [], footer = [] }: { header?: DataState[]; footer?: DataState[] } = {}
): DataState {
  return {
    $: 'component',
    component: 'RiseSortableList',
    props: {
      onReorder: {
        $: 'event',
        action: ['updateMedia', mediaLinkPath, 'layerOrder'],
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
          ...header,
          {
            key: 'addLayer',
            $: 'component',
            component: 'RiseSelectField',
            props: {
              value: null,
              onValueChange: {
                $: 'event',
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
          label: layer.name || layer.media.type,
          onPress: {
            $: 'event',
            action: ['navigate', `${mediaLinkPath}:layer:${layer.key}`],
          },
        }
      }),
    },
  }
}

export function getMediaLayerUI(mediaPath: string, layer: Layer, context: UIContext): DataState {
  return getMediaUI(mediaPath, layer.media, context, {
    header: [getLayerForm(mediaPath, layer)],
    footer: [
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
        {
          $: 'component',
          key: 'blendAmount',
          component: 'RiseSliderField',
          props: {
            onValueChange: {
              $: 'event',
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
          $: 'component',
          key: 'removeLayer',
          component: 'Button',
          children: 'Remove Layer',
          props: {
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
      ]),
    ],
  })
}

function getLayerForm(mediaPath: string, layer: Layer): ComponentDataState {
  return {
    $: 'component',
    component: 'AlertDialog',
    children: [
      {
        $: 'component',
        component: 'AlertDialogTrigger',
        props: {
          asChild: true,
        },
        children: {
          $: 'component',
          component: 'Button',
          children: 'Edit title',
        },
      },
      {
        $: 'component',
        component: 'AlertDialogPortal',
        children: [
          {
            $: 'component',
            component: 'AlertDialogOverlay',
          },
          {
            $: 'component',
            component: 'AlertDialogContent',
            children: {
              $: 'component',
              component: 'RiseForm',
              props: {
                onSubmit: {
                  $: 'event',
                  action: ['updateMedia', mediaPath, 'metadata'],
                },
              },
              children: [
                {
                  $: 'component',
                  component: 'RiseTextField',
                  props: {
                    name: 'name',
                    label: {
                      $: 'component',
                      component: 'Label',
                      children: 'Layer title',
                      props: {
                        htmlFor: 'name',
                      },
                    },
                    value: layer.name,
                    placeholder: 'Enter title...',
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    marginBottom: '$2',
                  },
                },
                {
                  $: 'component',
                  component: 'XStack',
                  props: {
                    justifyContent: 'flex-end',
                    space: '$2',
                  },
                  children: [
                    {
                      $: 'component',
                      component: 'AlertDialogCancel',
                      props: {
                        asChild: true,
                      },
                      children: {
                        $: 'component',
                        component: 'Button',
                        children: 'Cancel',
                      },
                    },
                    {
                      $: 'component',
                      component: 'AlertDialogAction',
                      props: {
                        asChild: true,
                      },
                      children: {
                        $: 'component',
                        component: 'RiseSubmitButton',
                        props: {
                          theme: 'active',
                        },
                        children: 'Submit',
                      },
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    ],
  }
}

export function getMediaUI(
  mediaPath: string,
  mediaState: Media,
  context: UIContext,
  { header = [], footer = [] }: { header?: DataState[]; footer?: DataState[] } = {}
): DataState {
  if (mediaState.type === 'color') {
    return scroll([...header, ...getColorControls(mediaPath, mediaState), ...footer])
  }
  if (mediaState.type === 'video') {
    return scroll([...header, ...getVideoControls(mediaPath, mediaState, context), ...footer])
  }
  if (mediaState.type === 'sequence') {
    return scroll([...header, ...getSequenceControls(mediaPath, mediaState, context), ...footer])
  }
  if (mediaState.type === 'layers') {
    return getLayersList(mediaPath, mediaState, context, { header, footer })
  }
  return scroll([
    ...header,
    {
      $: 'component',
      component: 'Text',
      children: mediaState.type,
    },
    ...footer,
  ])
}

export function getQuickEffects() {
  return {
    $: 'component',
    component: 'YStack',
    props: {
      padding: '$4',
      gap: '$4',
    },
    children: [
      { $: 'component', key: 'flash', component: 'Button', children: 'Flash' },
      { $: 'component', key: 'waveIn', component: 'Button', children: 'WaveIn' },
      { $: 'component', key: 'waveOut', component: 'Button', children: 'WaveOut' },
    ],
  }
}

export function getBeatEffects(mainState: MainState) {
  return {
    $: 'component',
    component: 'YStack',
    props: {
      gap: '$4',
    },
    children: [
      section(
        'Beat Effect',
        [
          {
            $: 'component',
            key: 'intensitySlider',
            component: 'RiseSliderField',
            props: {
              label: 'Intensity',
              value: { $: 'ref', ref: ['mainState', 'beatEffect', 'intensity'] },
              max: 100,
              min: 0,
              step: 1,
              onValueChange: {
                $: 'event',
              },
            },
          },
          {
            $: 'component',
            key: 'waveLengthSlider',
            component: 'RiseSliderField',
            props: {
              label: 'Wave Length %',
              value: { $: 'ref', ref: ['mainState', 'beatEffect', 'waveLength'] },
              max: 1,
              min: 0,
              step: 0.01,
              onValueChange: {
                $: 'event',
              },
            },
          },
          {
            $: 'component',
            key: 'dropoffSlider',
            component: 'RiseSliderField',
            props: {
              label: 'DropOff %',
              value: { $: 'ref', ref: ['mainState', 'beatEffect', 'dropoff'] },
              max: 1,
              min: 0,
              step: 0.01,
              onValueChange: {
                $: 'event',
              },
            },
          },
          {
            $: 'component',
            key: 'effectSelect',
            component: 'RiseSelectField',
            props: {
              value: mainState.beatEffect.effect,
              options: [
                { key: 'flash', label: 'flash' },
                { key: 'waveIn', label: 'waveIn' },
                { key: 'waveOut', label: 'waveOut' },
              ],
              onValueChange: {
                $: 'event',
              },
            },
          },
        ],
        'effect'
      ),
      section(
        'Manual Beat Pace',
        [
          {
            $: 'component',
            key: 'manualBeatEnabledSwitch',
            component: 'RiseSwitchField',
            props: {
              label: 'Enabled',
              value: { $: 'ref', ref: ['mainState', 'manualBeat', 'enabled'] },
              onCheckedChange: {
                $: 'event',
              },
            },
          },
          {
            $: 'component',
            key: 'tapBeat',
            component: 'Button',
            children: 'Tap Beat',
            props: {
              onPress: null,
              onPressOut: null,
              onPressIn: {
                $: 'event',
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
        { $: 'ref', ref: ['stagelinqConnection'] },
        // simpleLabel('Coming Soon')
      ]),

      // { $: 'component', key: 'waveIn', component: 'Button', children: 'WaveIn' },
      // { $: 'component', key: 'waveOut', component: 'Button', children: 'WaveOut' },
    ],
  }
}
