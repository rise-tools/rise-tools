import { Button, openURL } from '@rise-tools/kitchen-sink/server'
import React from 'react'

import { Content } from '../_components/Content'
import { Section } from '../_components/Section'
import { Title } from '../_components/Title'

/* https://developer.uber.com/docs/riders/ride-requests/tutorials/deep-links/introduction#ride-requests */
const UBER_DEEP_LINK =
  'https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff%5Bformatted_address%5D=Uber%20HQ%2C%20Market%20Street%2C%20San%20Francisco%2C%20CA%2C%20USA&dropoff%5Blatitude%5D=37.775231&dropoff%5Blongitude%5D=-122.417528'
export function Taxi() {
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
        <Button flex={1} color="white" fontWeight="bold" fontSize="$5">
          Shared Ride
        </Button>
      </Content>
    </Section>
  )
}
