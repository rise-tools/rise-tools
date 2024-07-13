import { RadioGroupField } from '@rise-tools/kitchen-sink/server'
import React from 'react'

export function RatingField() {
  return (
    <RadioGroupField
      id="usefulness"
      mode="horizontal"
      label="How useful is Rise?"
      options={[
        { label: '1', key: '1' },
        { label: '2', key: '2' },
        { label: '3', key: '3' },
        { label: '4', key: '4' },
        { label: '5', key: '5' },
      ]}
    />
  )
}
