import { LinearGradient } from '@tamagui/linear-gradient'
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import React, { useMemo } from 'react'
import { Adapt, Label, Select, Sheet, YStack } from 'tamagui'

import { SelectFieldProps } from '.'

export function SelectField(props: SelectFieldProps) {
  const { value, options } = props
  return (
    <YStack>
      <Label>{props.label}</Label>
      <Select
        id={props.id}
        // @ts-ignore
        value={value}
        onValueChange={props.onValueChange}
        disablePreventBodyScroll
        // native
      >
        <Select.Trigger iconAfter={ChevronDown}>
          <Select.Value placeholder={props.unselectedLabel} />
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
    </YStack>
  )
}
