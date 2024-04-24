import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React, { useMemo } from 'react'
import { Adapt, Button, Select, Sheet, SizableText, XStack, YStack } from 'tamagui'
import { z } from 'zod'

const DropdownButtonProps = z.object({
  id: z.string().optional(),
  onSelect: z.function().args(z.string()).optional(),
  children: z.any().optional(),
  icon: z.any().optional(),
  options: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        icon: z.any().optional(),
      })
    )
    .optional(),
})

export function DropdownButton(props: z.infer<typeof DropdownButtonProps>) {
  const { options } = props
  return (
    <Select
      id={props.id}
      // @ts-ignore
      onSelect={props.onSelect}
      disablePreventBodyScroll
      // native
    >
      <Select.Trigger backgroundColor="$color4" alignItems="center" padding={0} f={0}>
        <XStack f={1} jc="center">
          {props.icon}
          <SizableText>{props.children}</SizableText>
        </XStack>
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
          enterStyle={{ opacity: 0, y: -10 }}
          exitStyle={{ opacity: 0, y: 10 }}
          minWidth={200}
        >
          {useMemo(
            () =>
              options?.map((item, i) => {
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

DropdownButton.validate = (props: any) => {
  return DropdownButtonProps.parse(props)
}
