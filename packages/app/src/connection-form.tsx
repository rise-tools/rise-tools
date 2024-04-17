import React from 'react'
import { z } from 'zod'

import { AppForm, LabelSchema } from './form'

const connectionFormSchema = z.object({
  label: LabelSchema.describe('Connection Label'),
  host: z.string().url().toLowerCase().describe('Websocket URL // ws://demo-remote.verse.link'),
  path: z.string().describe('Path/Location (optional) // Root Location'),
})

export function ConnectionForm({
  onSubmit,
  defaultValues,
  submitButton,
}: {
  onSubmit: (values: z.infer<typeof connectionFormSchema>) => void
  defaultValues: z.infer<typeof connectionFormSchema>
  submitButton: (input: { submit: () => void }) => React.ReactNode
}) {
  return (
    <AppForm
      schema={connectionFormSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      renderAfter={submitButton}
    />
  )
}
