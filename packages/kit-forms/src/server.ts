import { createComponentDefinition } from '@rise-tools/react'

import type * as Kit from './form'

export const FormProvider = createComponentDefinition<typeof Kit.FormContext.Provider>(
  '@rise-tools/kit-form/FormProvider'
)

export const Form = createComponentDefinition<typeof Kit.Form>('@rise-tools/kit-forms/Form')
export const Input = createComponentDefinition<typeof Kit.Input>('@rise-tools/kit-forms/Input')
export const TextArea = createComponentDefinition<typeof Kit.TextArea>(
  '@rise-tools/kit-forms/TextArea'
)
export const FormButton = createComponentDefinition<typeof Kit.FormButton>(
  '@rise-tools/kit-forms/FormButton'
)
