import {
  DraggableFlatList,
  DropdownButton,
  SelectField,
  SliderField,
  SwitchField,
} from '@final-ui/kit/server'
import { action, lookup, response, setStateAction, state } from '@final-ui/react'
import { Button, H4, Paragraph, Text, YStack } from '@final-ui/tamagui/server'

import { UIContext } from '../types'

// eslint-disable-next-line
export function UIControlsExample(ctx: UIContext) {
  return {
    ui: UI,
    form: FormExample,
    slider: SliderExample,
    switch: SwitchExample,
    select: SelectExample,
    list: ListExample,
  }
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
  return <YStack></YStack>
}

function SliderExample() {
  const slider = state(0)

  const sliderRangeStart = state(25)
  const sliderRangeEnd = state(75)

  const sliderWithReset = state(0)

  return (
    <YStack gap="$3">
      <SliderField
        label="Single slider"
        value={[slider]}
        onValueChange={setStateAction(slider, lookup([0, 0]))}
      />
      <SliderField
        label="Range slider"
        value={[sliderRangeStart, sliderRangeEnd]}
        onValueChange={[
          setStateAction(sliderRangeStart, lookup([0, 0])),
          setStateAction(sliderRangeEnd, lookup([0, 1])),
        ]}
      />
      <SliderField
        label="Resettable slider"
        value={[sliderWithReset]}
        onValueChange={setStateAction(sliderWithReset, lookup([0, 0]))}
        onSlideEnd={async () => {
          await new Promise((resolve) => setTimeout(resolve, 2000))
          return response(null).action(
            setStateAction(sliderWithReset, sliderWithReset.initialValue)
          )
        }}
      />
      <Paragraph>
        This slider will reset after 2 seconds to emulate backend validation with value overwrite.
      </Paragraph>
    </YStack>
  )
}

function SwitchExample() {
  const isChecked = state(false)
  return (
    <YStack>
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
    <YStack gap="$3">
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
          button={<Text>You selected: {selectedItem}</Text>}
          options={frameworks}
        />
      </YStack>
    </YStack>
  )
}

function ListExample() {
  const inventoryItems = state(frameworks)

  return (
    <YStack>
      <DraggableFlatList
        // @ts-ignore update types to accept state of array, not just array of states
        items={inventoryItems}
        onReorder={setStateAction(inventoryItems)}
        header={<H4>Header</H4>}
        footer={<H4>Footer</H4>}
      />
    </YStack>
  )
}
