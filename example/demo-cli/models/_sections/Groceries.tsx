import React from 'react'

import { Content } from '../_components/Content'
import { Icon } from '../_components/Icon'
import { Section } from '../_components/Section'
import { Title } from '../_components/Title'

export function Groceries() {
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
