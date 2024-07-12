import { H3 } from '@rise-tools/kitchen-sink/server'
import React from 'react'

export function Title({ children }: { children: React.ReactNode }) {
  return (
    <H3 color="$backgroundFocus" lineHeight="$2">
      {children}
    </H3>
  )
}
