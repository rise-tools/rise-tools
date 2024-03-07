import { hslToHex } from './color'
import { MainState } from './state-schema'

function icon(name: string) {
  return {
    $: 'component',
    key: 'icon',
    component: 'Icon',
    props: { icon: name },
  }
}
function simpleLabel(text: string) {
  return {
    $: 'component',
    key: text,
    component: 'Label',
    children: text,
  }
}
function section(title: string, children: any, key?: string) {
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
        $: 'component',
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
        $: 'component',
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
        $: 'component',
        key: 'selectVideo',
        component: 'SelectField',
        props: {
          value: state.video.track,
          options: { $: 'ref', ref: ['videoList'] },
        },
      },
      {
        $: 'component',
        key: 'restart',
        component: 'Button',
        children: 'Restart Video',
      },
    ]
  }
  return [] as const
}

export function getUIRoot(state: MainState) {
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
        $: 'component',
        key: 'offButton',
        component: 'Button',
        children: 'All Off',
        props: {
          disabled: state.mode === 'off',
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
      //       { $: 'component', key: 'lol', component: 'Icon', props: { icon: 'Sparkles' } },
      //     ],
      //   },
      //   props: {
      //     onPress: ['navigate', 'effects'],
      //     // icon: { $: 'component', key: 'lol', component: 'Icon', props: { icon: 'Check' } },
      //   },
      // },

      {
        $: 'component',
        key: 'quickEffects',
        component: 'Button',
        children: 'Quick Effects',
        props: {
          onPress: ['navigate', 'quickEffects'],
          spaceFlex: 1,
          iconAfter: {
            $: 'component',
            key: 'icon',
            component: 'Icon',
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
          onPress: ['navigate', 'beatEffects'],
          spaceFlex: 1,
          iconAfter: {
            $: 'component',
            key: 'icon',
            component: 'Icon',
            props: { icon: 'HeartPulse' },
          },
        },
      },
    ],
  }
}

export function getQuickEffects(mainState: MainState) {
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
            key: 'intensity',
            component: 'SliderField',
            props: {
              label: 'Intensity',
              value: { $: 'ref', ref: ['mainState', 'beatEffect', 'intensity'] },
              max: 100,
              min: 0,
              step: 1,
            },
          },
          {
            $: 'component',
            key: 'waveLength',
            component: 'SliderField',
            props: {
              label: 'Wave Length %',
              value: { $: 'ref', ref: ['mainState', 'beatEffect', 'waveLength'] },
              max: 1,
              min: 0,
              step: 0.01,
            },
          },
          {
            $: 'component',
            key: 'dropoff',
            component: 'SliderField',
            props: {
              label: 'DropOff %',
              value: { $: 'ref', ref: ['mainState', 'beatEffect', 'dropoff'] },
              max: 1,
              min: 0,
              step: 0.01,
            },
          },
          {
            $: 'component',
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
            $: 'component',
            key: 'manualBeatEnabled',
            component: 'SwitchField',
            props: {
              label: 'Enabled',
              value: { $: 'ref', ref: ['mainState', 'manualBeat', 'enabled'] },
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
              onPressIn: 'manualTapBeat',
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
