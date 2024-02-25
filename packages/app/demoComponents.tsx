import {
  Adapt,
  Button,
  Label,
  Paragraph,
  ScrollView,
  Select,
  Sheet,
  SizableText,
  Slider,
  Spinner,
  Switch,
  XStack,
  YStack,
} from '@react-native-templates/demo-ui'
import { Check, ChevronDown, ChevronUp, Sparkles, X } from '@tamagui/lucide-icons'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { Icon } from './icons'
import { LinearGradient } from 'tamagui/linear-gradient'
import QRCode from 'react-native-qrcode-svg'

function TButton(props) {
  return (
    <Button
      backgroundColor={'$color1'}
      {...props}
      onPress={() => {
        let payload = 'press'
        if (props.onPress) payload = Array.isArray(props.onPress) ? props.onPress : [props.onPress]
        if (props.onPress === null) return
        props?.onTemplateEvent('press', payload)
      }}
      onPressIn={() => {
        let payload = 'pressIn'
        if (props.onPressIn)
          payload = Array.isArray(props.onPressIn) ? props.onPressIn : [props.onPressIn]
        if (props.onPressIn === null) return
        props?.onTemplateEvent('pressIn', payload)
      }}
      onPressOut={() => {
        let payload = 'pressOut'
        if (props.onPressOut)
          payload = Array.isArray(props.onPressOut) ? props.onPressOut : [props.onPressOut]
        if (props.onPressOut === null) return
        props?.onTemplateEvent('pressOut', payload)
      }}
    />
  )
}

const IconProps = z.object({
  icon: z.union([z.literal('check'), z.literal('sparkles'), z.literal('x')]),
})
function TIcon(props: z.infer<typeof IconProps> & BaseTemplateProps) {
  const iconProps = { size: 20 }
  if (props.icon === 'check') {
    return <Check {...iconProps} />
  }
  if (props.icon === 'x') {
    return <X {...iconProps} />
  }
  if (props.icon === 'sparkles') {
    return <Sparkles {...iconProps} />
  }
  return <SizableText>Icon not found</SizableText>
}

const EGPreviewProps = z.object({
  wsUrl: z.string(),
})

const SliderProps = z.object({
  value: z.number(),
  defaultValue: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
})

function TSlider(props: z.infer<typeof SliderProps> & BaseTemplateProps) {
  return (
    <Slider
      // defaultValue={props.defaultValue === undefined ? [50] : [props.defaultValue]}
      value={[props.value]}
      max={props.max || 100}
      min={props.min || 0}
      step={props.step || 1}
      onValueChange={(value) => {
        props.onTemplateEvent('update', value)
      }}
    >
      <Slider.Track>
        <Slider.TrackActive />
      </Slider.Track>
      <Slider.Thumb index={0} circular elevate />
    </Slider>
  )
}

const SliderFieldProps = z.object({
  value: z.number().nullable().optional(),
  defaultValue: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  label: z.string().optional(),
})

function TSliderField(props: z.infer<typeof SliderFieldProps> & BaseTemplateProps) {
  let content = <Spinner />
  if (typeof props.value === 'number') {
    content = (
      <Slider
        marginVertical={'$4'}
        // defaultValue={props.defaultValue === undefined ? [50] : [props.defaultValue]}
        value={[props.value]}
        max={props.max || 100}
        min={props.min || 0}
        step={props.step || 1}
        onValueChange={(value) => {
          props.onTemplateEvent('update', value)
        }}
      >
        <Slider.Track>
          <Slider.TrackActive />
        </Slider.Track>
        <Slider.Thumb index={0} circular elevate />
      </Slider>
    )
  }
  return (
    <YStack>
      <Label>{props.label}</Label>
      {content}
    </YStack>
  )
}

const SwitchFieldProps = z.object({
  value: z.boolean().nullable().optional(),
  label: z.string().optional(),
})

function TSwitchField(props: z.infer<typeof SwitchFieldProps> & BaseTemplateProps) {
  let content = <Spinner />
  if (typeof props.value === 'boolean') {
    content = (
      <Switch
        marginVertical={'$4'}
        checked={props.value}
        onCheckedChange={(value) => {
          props.onTemplateEvent('update', value)
        }}
      >
        <Switch.Thumb animation="100ms" />
      </Switch>
    )
  }
  return (
    <XStack ai="center" jc="space-between">
      <Label>{props.label}</Label>
      {content}
    </XStack>
  )
}

const QRCodeProps = z.object({
  value: z.string().nullable().optional(),
})

function TQRCode(props: z.infer<typeof QRCodeProps> & BaseTemplateProps) {
  if (!props.value) return <Spinner />
  return <QRCode color="white" backgroundColor="black" value={props.value} />
}

type BaseTemplateProps = {
  onTemplateEvent: (name: string, payload: any) => void
}

const SelectFieldProps = z.object({
  value: z.string(),
  options: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
    })
  ),
})

function TSelectField({
  onTemplateEvent,
  ...props
}: z.infer<typeof SelectFieldProps> & BaseTemplateProps) {
  const { value, options } = props
  return (
    <Select
      id="food"
      value={value}
      onValueChange={(value) => {
        onTemplateEvent('update', value)
      }}
      disablePreventBodyScroll
      // {...props}
    >
      <Select.Trigger iconAfter={ChevronDown}>
        <Select.Value placeholder="..." />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet
          modal
          dismissOnSnapToBottom
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['$background', 'transparent']}
            borderRadius="$4"
          />
        </Select.ScrollUpButton>

        <Select.Viewport
          animation="quick"
          animateOnly={['transform', 'opacity']}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
        >
          {useMemo(
            () =>
              options.map((item, i) => {
                return (
                  <Select.Item index={i} key={item.key} value={item.key}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                )
              }),
            [options]
          )}
        </Select.Viewport>

        <Select.ScrollDownButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronDown size={20} />
          </YStack>
          <LinearGradient
            start={[0, 0]}
            end={[0, 1]}
            fullscreen
            colors={['transparent', '$background']}
            borderRadius="$4"
          />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  )
}

export const demoComponents = {
  Paragraph: {
    component: Paragraph,
    validator: (props: {}) => props,
  },
  Text: {
    component: SizableText,
    validator: (props: {}) => props,
  },
  Label: {
    component: Label,
    validator: (props: {}) => props,
  },
  Button: {
    component: TButton,
    validator: (props: {}) => props,
  },
  XStack: {
    component: XStack,
    validator: (props: {}) => props,
  },
  YStack: {
    component: YStack,
    validator: (props: {}) => props,
  },
  ScrollView: {
    component: ScrollView,
    validator: (props: {}) => props,
  },
  View: {
    component: YStack,
    validator: (props: {}) => props,
  },
  Slider: {
    component: TSlider,
    validator: SliderProps.parse,
  },
  SliderField: {
    component: TSliderField,
    validator: SliderFieldProps.parse,
  },
  QRCode: {
    component: TQRCode,
    validator: QRCodeProps.parse,
  },
  SwitchField: {
    component: TSwitchField,
    validator: SwitchFieldProps.parse,
  },
  SelectField: {
    component: TSelectField,
    validator: SelectFieldProps.parse,
  },
  Icon,
}
