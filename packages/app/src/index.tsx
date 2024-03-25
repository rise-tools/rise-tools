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
  View,
  XStack,
  YStack,
} from '@react-native-templates/demo-ui'
import { Check, ChevronDown, ChevronUp, Sparkles, X } from '@tamagui/lucide-icons'
import React, { useMemo } from 'react'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { TouchableOpacity } from 'react-native-gesture-handler'
import QRCode from 'react-native-qrcode-svg'
import { LinearGradient } from 'tamagui/linear-gradient'
import { z } from 'zod'

import { Icon } from './icons'

function handleEvent(
  onTemplateEvent: any,
  payloadSpec: any,
  eventName: string,
  payloadValue?: any
) {
  if (payloadSpec == null) return
  if (typeof payloadSpec === 'object' && payloadSpec['$'] === 'multi')
    return handleEvents(onTemplateEvent, payloadSpec.events, eventName)
  const payloadContext = Array.isArray(payloadSpec) ? payloadSpec : [payloadSpec]
  onTemplateEvent(eventName, [...payloadContext, payloadValue])
}
function handleEvents(onTemplateEvent: any, payloadSpecs: any[] = [], eventName: string) {
  payloadSpecs.forEach((payloadSpec) => {
    handleEvent(onTemplateEvent, payloadSpec, eventName)
  })
}

// @ts-ignore
function TButton(props) {
  return (
    <Button
      backgroundColor={'$color1'}
      {...props}
      onPress={() => {
        handleEvent(props.onTemplateEvent, props.onPress, 'press')
      }}
      onPressIn={() => {
        handleEvent(props.onTemplateEvent, props.onPressIn, 'pressIn')
        // let payload = 'pressIn'
        // if (props.onPressIn)
        //   payload = Array.isArray(props.onPressIn) ? props.onPressIn : [props.onPressIn]
        // if (props.onPressIn === null) return
        // props?.onTemplateEvent('pressIn', payload)
      }}
      onPressOut={() => {
        handleEvent(props.onTemplateEvent, props.onPressOut, 'pressOut')
        // let payload = 'pressOut'
        // if (props.onPressOut)
        //   payload = Array.isArray(props.onPressOut) ? props.onPressOut : [props.onPressOut]
        // if (props.onPressOut === null) return
        // props?.onTemplateEvent('pressOut', payload)
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

function keyExtractor(item: z.infer<typeof SortableListItemSchema>) {
  return item.key
}
const SortableListItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  onPress: z.string().or(z.array(z.string())),
})
const SortableListProps = z.object({
  footer: z.any(),
  items: z.array(SortableListItemSchema),
  onReorder: z.string().or(z.array(z.string())),
})
function SortableList(props: z.infer<typeof SortableListProps> & BaseTemplateProps) {
  return (
    <View f={1}>
      <DraggableFlatList
        containerStyle={{ flex: 1 }}
        data={props.items}
        keyExtractor={keyExtractor}
        ListFooterComponent={props.footer}
        onDragEnd={({ data }) => {
          const reordered = data.map((item) => item.key)
          const payload = [
            ...(Array.isArray(props.onReorder) ? props.onReorder : [props.onReorder]),
            reordered,
          ]
          props.onTemplateEvent('update', payload)
        }}
        renderItem={(row) => {
          const { item, drag, isActive } = row
          return (
            <ScaleDecorator>
              <TouchableOpacity
                onPress={() => {
                  if (item.onPress) props.onTemplateEvent('press', item.onPress)
                }}
                onLongPress={drag}
                disabled={isActive}
                style={[{ padding: 10, backgroundColor: 'white', margin: 10 }]}
              >
                <Label style={{}}>{item.label}</Label>
              </TouchableOpacity>
            </ScaleDecorator>
          )
        }}
      />
    </View>
  )
}

const SliderFieldProps = z.object({
  value: z.number().nullable().optional(),
  defaultValue: z.number().optional(),
  onValue: z.string().or(z.array(z.any())).nullable().optional(),
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
          let payload: (string | number)[] = value
          if (props.onValue === null) return
          if (props.onValue)
            payload = [
              ...(Array.isArray(props.onValue) ? props.onValue : [props.onValue]),
              ...value,
            ]
          props.onTemplateEvent('update', payload)
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
  onValue: z.string().or(z.array(z.string())).nullable().optional(),
})

function TSwitchField(props: z.infer<typeof SwitchFieldProps> & BaseTemplateProps) {
  let content = <Spinner />
  if (typeof props.value === 'boolean') {
    content = (
      <Switch
        marginVertical={'$4'}
        checked={props.value}
        onCheckedChange={(value) => {
          //
          handleEvent(props.onTemplateEvent, props.onValue, 'switch', value)
          props.onTemplateEvent('update', value)
        }}
      >
        <Switch.Thumb animation="quick" />
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
  value: z.string().nullable(),
  id: z.string().optional(),
  unselectedLabel: z.string().optional(),
  onValue: z.string().or(z.array(z.string())).nullable().optional(),
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
      id={props.id}
      // @ts-ignore
      value={value}
      onValueChange={(value) => {
        let payload = [value]
        if (props.onValue === null) return
        if (props.onValue)
          payload = [...(Array.isArray(props.onValue) ? props.onValue : [props.onValue]), value]
        onTemplateEvent('update', payload)
      }}
      disablePreventBodyScroll
      // native
    >
      <Select.Trigger iconAfter={ChevronDown}>
        <Select.Value placeholder={props.unselectedLabel || '...'} />
      </Select.Trigger>

      <Adapt
        //when="sm"
        platform="touch"
      >
        <Sheet
          modal
          dismissOnSnapToBottom
          // animationConfig={{
          //   type: 'spring',
          //   damping: 20,
          //   mass: 1.2,
          //   stiffness: 250,
          // }}
          animation="quick"
          // dismissOnOverlayPress
        >
          <Sheet.Overlay
          // animation="quick"
          // opacity={0.2}
          // backgroundColor="red"
          // enterStyle={{ opacity: 0.01 }}
          // exitStyle={{ opacity: 0.01 }}
          />
          {/* <Sheet.Handle /> */}
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
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
          minWidth={200}
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
          {/* Native gets an extra icon */}
          {/* {true && (
            <YStack
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              width={'$4'}
              pointerEvents="none"
            >
              <ChevronDown size={getFontSize((props.size as FontSizeTokens) ?? '$true')} />
            </YStack>
          )} */}
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
  SortableList: {
    component: SortableList,
    validator: SortableListProps.parse,
  },
  Icon,
}
