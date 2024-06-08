import {
  DraggableFlatList,
  DropdownButton,
  SelectField,
  SliderField,
  SwitchField,
} from '@final-ui/kit/server'
import { action, event, eventPayload, response, setStateAction, state } from '@final-ui/react'
import { Button, Form, H4, Input, Paragraph, Text, YStack } from '@final-ui/tamagui/server'

// eslint-disable-next-line
export const models = {
  ui: UI,
  form: FormExample,
  slider: SliderExample,
  switch: SwitchExample,
  select: SelectExample,
  list: ListExample,
}

function UI() {
  return (
    <YStack>
      <Button onPress={action(['navigate', 'form'])}>Form</Button>
      <Button onPress={action(['navigate', 'slider'])}>Slider</Button>
      <Button onPress={action(['navigate', 'switch'])}>Switch</Button>
      <Button onPress={action(['navigate', 'select'])}>Select</Button>
      <Button onPress={action(['navigate', 'list'])}>List</Button>
    </YStack>
  )
}

function FormExample() {
  const userName = state('')
  const notification = state('')
  const onFormSubmit = event(
    (state) => {
      console.log(`Values: ${state}`)
      return response(null)
        .action(setStateAction(userName, ''))
        .action(
          setStateAction(
            notification,
            'Thank you for submitting the form! Check the logs on the backend to see the submitted values'
          )
        )
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
  const slider = state(0)

  const sliderRangeStart = state(25)
  const sliderRangeEnd = state(75)

  const sliderWithReset = state(0)

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
            return response(null).action(
              setStateAction(sliderWithReset, sliderWithReset.initialValue)
            )
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
  const isChecked = state(false)
  return (
    <YStack gap="$8" padding="$4">
      <SwitchField label="Toggle" value={isChecked} onCheckedChange={setStateAction(isChecked)} />
    </YStack>
  )
}

const frameworks = [
  { label: 'Laravel', key: 'laravel' },
  { label: 'Remix', key: 'remix' },
  { label: 'Final UI', key: 'final-ui' },
  { label: 'Next.js', key: 'next' },
  { label: 'Prefer not say', key: 'unknown' },
]

function SelectExample() {
  const selectedItem = state('')
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
          value={selectedItem}
          button={<Text>Select your favorite framework</Text>}
          options={frameworks}
        />
      </YStack>
    </YStack>
  )
}

function ListExample() {
  const inventoryItems = state(frameworks)

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
