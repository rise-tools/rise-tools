import {
  DraggableFlatList,
  DropdownButton,
  SelectField,
  SliderField,
  SwitchField,
} from '@rise-tools/kit/server'
import { navigate, StackScreen } from '@rise-tools/kit-expo-router/server'
import { haptics } from '@rise-tools/kit-haptics/server'
import { toast } from '@rise-tools/kit-tamagui-toast/server'
import { event, eventPayload, localStateExperimental, setStateAction } from '@rise-tools/react'
import {
  Button,
  Form,
  H4,
  Input,
  Paragraph,
  ScrollView,
  Text,
  YStack,
} from '@rise-tools/tamagui/server'

// eslint-disable-next-line
export const models = {
  controls: UI,
  form: FormExample,
  slider: SliderExample,
  switch: SwitchExample,
  select: SelectExample,
  list: ListExample,
  toast: ShowToastExample,
  haptics: HapticsExample,
}

function UI() {
  return (
    <>
      <StackScreen options={{ title: 'UI Controls' }} />
      <YStack>
        <Button onPress={navigate('form')}>Form</Button>
        <Button onPress={navigate('slider')}>Slider</Button>
        <Button onPress={navigate('switch')}>Switch</Button>
        <Button onPress={navigate('select')}>Select</Button>
        <Button onPress={navigate('list')}>List</Button>
        <Button onPress={navigate('toast')}>Toast</Button>
        <Button onPress={navigate('haptics')}>Haptics</Button>
      </YStack>
    </>
  )
}

function FormExample() {
  const userName = localStateExperimental('', 'form/userName')
  const notification = localStateExperimental('', 'form/notification')
  const onFormSubmit = event(
    (state) => {
      console.log(`Values: ${state}`)
      return [
        setStateAction(userName, ''),
        setStateAction(
          notification,
          'Thank you for submitting the form! Check the logs on the backend to see the submitted values'
        ),
      ]
    },
    { args: { userName } }
  )
  return (
    <YStack gap="$8" padding="$4">
      <YStack gap="$4">
        <H4>Simple form</H4>
        <Form onSubmit={onFormSubmit}>
          <YStack gap="$4">
            <Text>User name</Text>
            <Input
              value={userName}
              onChangeText={[setStateAction(userName), setStateAction(notification, '')]}
            />
          </YStack>
          <Text>{notification}</Text>
          <Button onPress={onFormSubmit}>Submit form</Button>
        </Form>
      </YStack>
    </YStack>
  )
}

function SliderExample() {
  const slider = localStateExperimental(0, 'slider/slider')

  const sliderRangeStart = localStateExperimental(25, 'slider/range-start')
  const sliderRangeEnd = localStateExperimental(75, 'slider/range-end')
  const sliderWithReset = localStateExperimental(0, 'slider/with-reset')

  return (
    <YStack gap="$8" padding="$4">
      <YStack gap="$4">
        <H4>Single slider</H4>
        <SliderField
          value={[slider]}
          onValueChange={setStateAction(slider, eventPayload([0, 0]))}
        />
      </YStack>
      <YStack gap="$4">
        <H4>Range slider</H4>
        <SliderField
          value={[sliderRangeStart, sliderRangeEnd]}
          onValueChange={[
            setStateAction(sliderRangeStart, eventPayload([0, 0])),
            setStateAction(sliderRangeEnd, eventPayload([0, 1])),
          ]}
        />
      </YStack>
      <YStack gap="$4">
        <H4>Resettable slider</H4>
        <SliderField
          value={[sliderWithReset]}
          onValueChange={setStateAction(sliderWithReset, eventPayload([0, 0]))}
          onSlideEnd={async () => {
            await new Promise((resolve) => setTimeout(resolve, 2000))
            return [setStateAction(sliderWithReset, sliderWithReset.initialValue)]
          }}
        />
        <Paragraph lineHeight="$3">
          This slider will reset after 2 seconds to emulate backend validation with value overwrite.
        </Paragraph>
      </YStack>
    </YStack>
  )
}

function SwitchExample() {
  const isChecked = localStateExperimental(false, 'switch/checked')
  return (
    <YStack gap="$8" padding="$4">
      <SwitchField label="Toggle" value={isChecked} onCheckedChange={setStateAction(isChecked)} />
    </YStack>
  )
}

const frameworks = [
  { label: 'Laravel', key: 'laravel' },
  { label: 'Remix', key: 'remix' },
  { label: 'Rise Tools', key: 'rise-tools' },
  { label: 'Next.js', key: 'next' },
  { label: 'Prefer not say', key: 'unknown' },
]

function SelectExample() {
  const selectedItem = localStateExperimental('', 'select/item')
  return (
    <YStack gap="$8" padding="$4">
      <YStack>
        <H4>Select</H4>
        <SelectField
          value={selectedItem}
          onValueChange={setStateAction(selectedItem)}
          unselectedLabel="Select your favorite framework"
          options={frameworks}
        />
      </YStack>
      <YStack>
        <H4>Bottom sheet</H4>
        <DropdownButton
          id="select/dropdown-button"
          value={selectedItem}
          button={<Text>Select your favorite framework</Text>}
          options={frameworks}
        />
      </YStack>
    </YStack>
  )
}

function ListExample() {
  const inventoryItems = localStateExperimental(frameworks, 'list/inventory')

  return (
    <YStack flex={1} padding="$4">
      <DraggableFlatList
        items={inventoryItems}
        onReorder={setStateAction(inventoryItems)}
        header={<H4>Header</H4>}
        footer={<H4>Footer</H4>}
      />
    </YStack>
  )
}

function ShowToastExample() {
  return (
    <YStack>
      <Button onPress={toast('Hello World!', 'This is toast action!')}>
        <Text>Show toast</Text>
      </Button>
    </YStack>
  )
}

function HapticsExample() {
  return (
    <ScrollView padding="$4" contentContainerStyle={{ gap: '$8' }}>
      <YStack>
        <H4>Impact</H4>
        <YStack gap="$2">
          <Button onPress={haptics()}>
            <Text>Default</Text>
          </Button>
          <Button onPress={haptics('impact', 'light')}>
            <Text>Light</Text>
          </Button>
          <Button onPress={haptics('impact', 'medium')}>
            <Text>Medium</Text>
          </Button>
          <Button onPress={haptics('impact', 'heavy')}>
            <Text>Heavy</Text>
          </Button>
          <Button onPress={haptics('impact', 'rigid')}>
            <Text>Rigid</Text>
          </Button>
          <Button onPress={haptics('impact', 'soft')}>
            <Text>Soft</Text>
          </Button>
        </YStack>
      </YStack>
      <YStack>
        <H4>Notification</H4>
        <YStack gap="$2">
          <Button onPress={haptics('notification')}>
            <Text>Default</Text>
          </Button>
          <Button onPress={haptics('notification', 'success')}>
            <Text>Success</Text>
          </Button>
          <Button onPress={haptics('notification', 'error')}>
            <Text>Error</Text>
          </Button>
          <Button onPress={haptics('notification', 'warning')}>
            <Text>Warning</Text>
          </Button>
        </YStack>
      </YStack>
      <YStack>
        <H4>Selection</H4>
        <YStack gap="$2">
          <Button onPress={haptics('selection')}>
            <Text>Default</Text>
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
