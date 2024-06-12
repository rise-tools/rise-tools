import React from 'react'
import { z } from 'zod'

import { AppForm, LabelSchema } from './form'

const connectionFormSchema = z.object({
  label: LabelSchema.describe('Connection Label'),
  host: z.string().url().toLowerCase().describe('Server URL // wss://demo-remote.verse.link'),
  path: z.string().describe('Path/Location (optional) // Root Location').optional(),
})

type ConnectionForm = z.infer<typeof connectionFormSchema>

type DefaultValues = Partial<{
  [P in keyof ConnectionForm]: ConnectionForm[P] extends string ? string : ConnectionForm[P]
}>

export function ConnectionForm({
  onSubmit,
  defaultValues,
  submitButton,
}: {
  onSubmit: (values: ConnectionForm) => void
  defaultValues?: DefaultValues
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
