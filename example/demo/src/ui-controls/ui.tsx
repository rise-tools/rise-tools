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
import { openSettings, openURL } from '@rise-tools/kit-linking/server'
import { Circle, Svg, SvgUri, SvgXml } from '@rise-tools/kit-svg/server'
import { toast } from '@rise-tools/kit-tamagui-toast/server'
import { localStateExperimental, response, setStateAction } from '@rise-tools/react'
import { Button, H4, ScrollView, Text, YStack } from '@rise-tools/tamagui/server'

export const models = {
  controls: UI,
  form: FormExample,
  list: ListExample,
  toast: ShowToastExample,
  haptics: HapticsExample,
  svg: SVGExample,
  linking: LinkingExample,
}

function UI() {
  return (
    <>
      <StackScreen options={{ title: 'UI Controls' }} />
      <YStack>
        <Button onPress={navigate('form')}>Form</Button>
        <Button onPress={navigate('list')}>List</Button>
        <Button onPress={navigate('toast')}>Toast</Button>
        <Button onPress={navigate('haptics')}>Haptics</Button>
        <Button onPress={navigate('svg')}>SVG</Button>
        <Button onPress={navigate('linking')}>Linking</Button>
      </YStack>
    </>
  )
}

function SVGExample() {
  return (
    <YStack gap="$8" padding="$4">
      <YStack>
        <H4>SVG</H4>
        <Svg height="100" width="100" viewBox="0 0 100 100">
          <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="green" />
        </Svg>
      </YStack>
      <YStack>
        <H4>SVG from URI</H4>
        <SvgUri
          width="100"
          height="100"
          uri="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/ruby.svg"
          onError={toast('Failed to load SVG from URI')}
        />
      </YStack>
      <YStack>
        <H4>SVG string</H4>
        <SvgXml
          width="100"
          height="100"
          xml={`
            <svg width="32" height="32" viewBox="0 0 32 32">
              <rect fill="#ff0000" x="0" y="0" width="32" height="32" />
            </svg>
          `}
        />
      </YStack>
    </YStack>
  )
}

function LinkingExample() {
  return (
    <YStack>
      <Button onPress={openURL('https://rise.tools')}>
        <Text>Go to Rise Tools website</Text>
      </Button>
      <Button onPress={openSettings()}>
        <Text>Go to Settings</Text>
      </Button>
    </YStack>
  )
}

function FormExample() {
  return (
    <ScrollView contentContainerStyle={{ padding: '$4' }}>
      <RiseForm
        onSubmit={(values) => {
          console.log('Form submitted', values)
          return response([toast('Thank you for submitting your feedback'), goBack()])
        }}
      >
        <InputField id="name" label="Input" placeholder="What is your name?" />
        <TextField id="feedback" label="Textarea" placeholder="What do you think about Rise?" />
        <CheckboxField id="checkbox" label="I already starred this project on Github" />
        <SliderField id="rating" label="Rate us" defaultValue={[0]} />
        <SwitchField id="anonymous" label="I want to be anonymous" />
        <SelectField
          id="framework"
          label="What is your favorite frontend framework?"
          placeholder="Select something!"
          options={frameworks}
        />
        <ToggleGroupField
          id="platforms"
          label="What platforms do you target?"
          type="multiple"
          orientation="vertical"
          options={[
            { label: 'Web', key: 'web' },
            { label: 'iOS', key: 'ios' },
            { label: 'Android', key: 'android' },
          ]}
        />
        <RadioGroupField
          id="color"
          label="What is your dev setup?"
          options={[
            { label: 'Visual Studio Code', key: 'vscode' },
            { label: 'Vim / Emacs', key: 'hacker' },
            { label: 'Notepad', key: 'notepad' },
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
