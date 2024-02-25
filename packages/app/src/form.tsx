import { createTsForm, createUniqueFieldSchema } from '@ts-react/form'
import { TextField } from './fields'
import { z } from 'zod'
import { Form } from '@react-native-templates/demo-ui'

export const fields = {
  text: z.string(),
  url: z.string().url(),
  path: createUniqueFieldSchema(z.string(), 'path'),
}

export const AppForm = createTsForm(
  [
    [fields.text, TextField],
    [fields.url, TextField],
    [fields.path, TextField],
  ] as const,
  {
    FormComponent: Form,
  }
)
