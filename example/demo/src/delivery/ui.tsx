import { Icon as LucideIcon } from '@rise-tools/kit/server'
import { goBack, navigate, StackScreen } from '@rise-tools/kit-expo-router/server'
import { toast } from '@rise-tools/kit-tamagui-toast/server'
import { event, response, setStateAction, state } from '@rise-tools/react'
import {
  Button,
  Circle,
  Form,
  FormTrigger,
  H2,
  H3,
  Input,
  Text,
  TextArea,
  XStack,
  YStack,
} from '@rise-tools/tamagui/server'

export const models = {
  delivery: UI,
  'delivery:feedback-form': FeedbackForm,
}

function UI() {
  return (
    <YStack gap="$4">
      <Survey />
      <Groceries />
      <Restaurants />
      <Taxi />
    </YStack>
  )
}

function FeedbackForm() {
  const name = state('')
  const feedback = state('')
  const onFormSubmit = event(
    ({ name, feedback }) => {
      console.log('Form submitted', name, feedback)
      return response(null).action(toast('Thank you for submitting your feedback')).action(goBack())
    },
    { args: { name, feedback } }
  )
  return (
    <>
      <StackScreen options={{ title: 'Feedback' }} />
      <YStack gap="$4" padding="$4">
        <H2>Send feedback</H2>
        <YStack gap="$8" padding="$4">
          <Form onSubmit={onFormSubmit}>
            <YStack gap="$4">
              <Text>Name</Text>
              <Input onChangeText={setStateAction(name)} />
              <Text>Feedback</Text>
              <TextArea onChangeText={setStateAction(feedback)} />
            </YStack>
            <Button onPress={onFormSubmit}>Submit</Button>
          </Form>
        </YStack>
      </YStack>
    </>
  )
}

function Groceries() {
  return (
    <Section>
      <Title>Groceries</Title>
      <Content>
        <Icon />
        <Icon />
        <Icon />
        <Icon />
        <Icon />
        <Icon />
      </Content>
    </Section>
  )
}

function Restaurants() {
  return (
    <Section>
      <Title>Restaurants</Title>
      <Content>
        <Icon />
        <Icon />
        <Icon />
        <Icon />
        <Icon />
        <Icon />
      </Content>
    </Section>
  )
}

function Taxi() {
  return (
    <Section>
      <Title>Restaurants</Title>
      <Content>
        <Button flex={1} backgroundColor="$gray11" color="white" fontSize="$5">
          Quick Ride
        </Button>
        <Button flex={1} backgroundColor="$gray11" color="white" fontSize="$5">
          Shared Ride
        </Button>
      </Content>
    </Section>
  )
}

function Survey() {
  return (
    <XStack backgroundColor="$green10" padding="$4" gap="$4" alignItems="center">
      <LucideIcon icon="MessageCircleHeart" size="$6" color="white" />
      <YStack justifyContent="flex-start" gap="$2">
        <H3 color="white">Do you like the App?</H3>
        <Button
          backgroundColor="$green12"
          pressStyle={{ backgroundColor: '$green11', borderColor: '$green11' }}
          color="white"
          fontSize="$5"
          onPress={navigate('delivery:feedback-form')}
        >
          Send Feedback
        </Button>
      </YStack>
    </XStack>
  )
}

/* Utils */

function Section({ children }: { children: React.ReactNode }) {
  return (
    <YStack
      gap="$2"
      borderColor="$gray11"
      borderRadius="$8"
      borderWidth="$2"
      padding="$4"
      marginHorizontal="$4"
    >
      {children}
    </YStack>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return <H3 color="$gray11">{children}</H3>
}

function Content({ children }: { children: React.ReactNode }) {
  return <XStack gap="$2">{children}</XStack>
}

function Icon() {
  return <Circle size="$5" backgroundColor="$gray11" />
}
