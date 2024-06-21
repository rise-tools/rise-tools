import { DraggableFlatList } from '@rise-tools/kit/server'
import { goBack, navigate, StackScreen } from '@rise-tools/kit-expo-router/server'
import {
  CheckboxField,
  InputField,
  RadioGroupField,
  RiseForm,
  SelectField,
  SliderField,
  SubmitButton,
  SwitchField,
  TextField,
  ToggleGroupField,
} from '@rise-tools/kit-forms/server'
import { haptics } from '@rise-tools/kit-haptics/server'
import { toast } from '@rise-tools/kit-tamagui-toast/server'
import { localStateExperimental, response, setStateAction } from '@rise-tools/react'
import { Button, H4, ScrollView, Text, YStack } from '@rise-tools/tamagui/server'

export const models = {
  controls: UI,
  form: FormExample,
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
        <Button onPress={navigate('select')}>Select</Button>
        <Button onPress={navigate('list')}>List</Button>
        <Button onPress={navigate('toast')}>Toast</Button>
        <Button onPress={navigate('haptics')}>Haptics</Button>
      </YStack>
    </>
  )
}

function FormExample() {
  return (
    <ScrollView contentContainerStyle={{ padding: '$4' }}>
      <RiseForm
        onSubmit={(values) => {
          console.log('Form submitted', values)
          return response(null)
            .action(toast('Thank you for submitting your feedback'))
            .action(goBack())
        }}
      >
        <InputField id="name" label="Name" />
        <TextField id="feedback" label="Feedback" />
        <CheckboxField id="subscribe" label="Subscribe to newsletter" defaultChecked={true} />
        <SliderField id="rating" label="Rating" defaultValue={[20, 60]} />
        <SwitchField id="anonymous" label="I want to be anonymous" />
        <SelectField
          id="framework"
          label="Which one you like?"
          placeholder="No framework selected"
          options={frameworks}
        />
        <RadioGroupField
          id="color"
          label="Favorite color"
          options={[
            { label: 'Red', key: 'red' },
            { label: 'Green', key: 'green' },
            { label: 'Blue', key: 'blue' },
          ]}
        />
        <ToggleGroupField
          id="car"
          label="What car(s) do you have?"
          type="multiple"
          options={[
            { label: 'suv', key: 'SUV' },
            { label: 'sedan', key: 'Sedan' },
            { label: 'coupe', key: 'Coupe' },
          ]}
        />
        <SubmitButton pendingState={<Text>Submitting...</Text>}>Submit</SubmitButton>
      </RiseForm>
    </ScrollView>
  )
}

const frameworks = [
  { label: 'Laravel', key: 'laravel' },
  { label: 'Remix', key: 'remix' },
  { label: 'Rise Tools', key: 'rise-tools' },
  { label: 'Next.js', key: 'next' },
  { label: 'Prefer not say', key: 'unknown' },
]

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
