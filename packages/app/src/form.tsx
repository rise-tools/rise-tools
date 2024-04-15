import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { ComponentProps } from 'react'
import React from 'react'
import { Form, YStack } from 'tamagui'
import { z } from 'zod'

import { PrettyTextField, TextField } from './fields'

function FormComponent({ children, ...props }: ComponentProps<typeof Form>) {
  return (
    <Form {...props}>
      <YStack gap="$3">{children}</YStack>
    </Form>
  )
}

export const LabelSchema = createUniqueFieldSchema(z.string(), 'label')
export const UrlSchema = createUniqueFieldSchema(z.string().url().toLowerCase(), 'url')

export const AppForm = createTsForm(
  [
    [z.string(), TextField],
    [LabelSchema, PrettyTextField],
    [UrlSchema, TextField],
  ],
  {
    FormComponent,
  }
)
