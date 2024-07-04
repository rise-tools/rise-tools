import {
  goBack,
  navigate,
} from '@rise-tools/kit-react-navigation/server'
import {
  Button,
  Circle,
  H3,
  InputField,
  LucideIcon,
  openURL,
  RadioGroupField,
  RiseForm,
  SubmitButton,
  Theme,
  toast,
  XStack,
  YStack,
} from '@rise-tools/kitchen-sink/server'
import { response } from '@rise-tools/react'

export const models = {
  delivery: UI,
  feedbackForm: FeedbackUI,
}

function FeedbackUI() {
  return (
    <YStack padding="$4">
      <RiseForm
        onSubmit={(values) => {
          console.log(values)
          // tbd: validation
          return response([
            toast('Thank you for your comments!'),
            goBack(),
          ])
        }}
      >
        <InputField
          id="comments"
          label="What do you think?"
        />
        <RatingInputField
          id="usefulness"
          label="How useful is Rise?"
        />
        <RatingInputField
          id="easiness"
          label="How easy is Rise to use?"
        />
        <SubmitButton>Submit</SubmitButton>
      </RiseForm>
    </YStack>
  )
}

function RatingInputField({
  id,
  label,
}: {
  id: string
  label: string
}) {
  return (
    <RadioGroupField
      id={id}
      label={label}
      mode="horizontal"
      options={[
        { label: 'Good', key: 'good' },
        { label: 'Greatly', key: 'greatly' },
        {
          label: 'Incredibly',
          key: 'incredibly',
        },
      ]}
    />
  )
}

function UI() {
  return (
    <YStack gap="$4" backgroundColor="$background">
      <Theme name="green_active">
        <XStack
          backgroundColor="$backgroundFocus"
          padding="$4"
          gap="$4"
          alignItems="center"
        >
          <LucideIcon
            icon="MessageCircleHeart"
            size="$6"
            color="white"
          />
          <YStack justifyContent="flex-start" gap="$2">
            <H3 color="white">Do you like Rise Tools?</H3>
            <Button
              fontSize="$5"
              fontWeight="bold"
              color="white"
              onPress={navigate('feedbackForm')}
            >
              Send Feedback
            </Button>
          </YStack>
        </XStack>
      </Theme>
      <Groceries />
      <Restaurants />
      <Taxi />
    </YStack>
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

/* https://developer.uber.com/docs/riders/ride-requests/tutorials/deep-links/introduction#ride-requests */
const UBER_DEEP_LINK =
  'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Bformatted_address%5D=Uber%20HQ%2C%20Market%20Street%2C%20San%20Francisco%2C%20CA%2C%20USA&dropoff%5Blatitude%5D=37.775231&dropoff%5Blongitude%5D=-122.417528'

function Taxi() {
  return (
    <Section>
      <Title>Summon Taxi</Title>
      <Content>
        <Button
          flex={1}
          color="white"
          fontWeight="bold"
          fontSize="$5"
          onPress={openURL(UBER_DEEP_LINK)}
        >
          Quick Ride
        </Button>
        <Button
          flex={1}
          color="white"
          fontWeight="bold"
          fontSize="$5"
        >
          Shared Ride
        </Button>
      </Content>
    </Section>
  )
}

/* Utils */

function Section({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Theme name="green_active">
      <YStack
        gap="$2"
        borderColor="$borderColor"
        borderRadius="$8"
        borderWidth="$2"
        padding="$4"
        overflow="hidden"
        marginHorizontal="$4"
      >
        {children}
      </YStack>
    </Theme>
  )
}

function Title({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <H3 color="$backgroundFocus" lineHeight="$2">
      {children}
    </H3>
  )
}

function Content({
  children,
}: {
  children: React.ReactNode
}) {
  return <XStack gap="$2">{children}</XStack>
}

function Icon() {
  return (
    <Circle size="$5" backgroundColor="$backgroundFocus" />
  )
}
