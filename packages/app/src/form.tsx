// @ts-ignore
import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { ComponentProps } from 'react'
import React from 'react'
import { Form, YStack } from 'tamagui'
import { z } from 'zod'

import { TextField } from './fields'

export const fields = {
  text: z.string(),
  url: z.string().url(),
  path: createUniqueFieldSchema(z.string(), 'path'),
}

function FormComponent({ children, ...props }: ComponentProps<typeof Form>) {
  return (
    <Form {...props}>
      <YStack gap="$3">{children}</YStack>
    </Form>
  )
}

export const AppForm = createTsForm(
  [
    [fields.text, TextField],
    [fields.url, TextField],
    [fields.path, TextField],
  ] as const,
  {
    FormComponent,
  }
)
