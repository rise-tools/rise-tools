/** @jsxImportSource @final-ui/react */

import { Only, WithServerProps } from '@final-ui/react'
import {
  Adapt,
  AdaptContents,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
  Sheet,
  SheetFrame,
  SheetOverlay,
  SheetScrollView,
  YStack,
} from '@final-ui/tamagui/server'

type Props = {
  value: string
  id?: string
  label?: string
  unselectedLabel?: string
  onValueChange?: (value: string) => any
  options?: { key: Only<string>; label: string }[]
}

export function SelectField(props: WithServerProps<Props>) {
  return (
    <YStack>
      <Label>{props.label}</Label>
      <Select
        id={props.id}
        value={props.value}
        onValueChange={props.onValueChange}
        disablePreventBodyScroll
      >
        <Adapt platform="touch">
          <Sheet modal dismissOnSnapToBottom animation="quick">
            <SheetOverlay />
            <SheetFrame>
              <SheetScrollView>
                <AdaptContents />
              </SheetScrollView>
            </SheetFrame>
          </Sheet>
        </Adapt>

        <SelectTrigger>
          <SelectValue placeholder={props.unselectedLabel} />
        </SelectTrigger>

        <SelectContent zIndex={200000}>
          <SelectScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="$3"
            height="$3"
          >
            <YStack zIndex={10}>{/* <ChevronUp size={20} /> */}</YStack>
            {/* <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$background', 'transparent']}
              borderRadius="$4"
            /> */}
          </SelectScrollUpButton>

          <SelectViewport
            animation="quick"
            animateOnly={['transform', 'opacity']}
            enterStyle={{ opacity: 0, y: -10 }}
            exitStyle={{ opacity: 0, y: 10 }}
            minWidth={200}
          >
            {props.options?.map((item, i) => {
              return (
                <SelectItem index={i} key={item.key} value={item.key}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator>{/* <Check size={16} /> */}</SelectItemIndicator>
                </SelectItem>
              )
            })}
          </SelectViewport>
          <SelectScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="$3"
            height="$3"
          >
            <YStack zIndex={10}>{/* <ChevronDown size={20} /> */}</YStack>
            {/* <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['transparent', '$background']}
              borderRadius="$4"
            /> */}
          </SelectScrollDownButton>
        </SelectContent>
      </Select>
    </YStack>
  )
}
