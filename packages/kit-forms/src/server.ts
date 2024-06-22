import { createComponentDefinition } from '@rise-tools/react'

import type * as Kit from './form'

export const RiseForm = createComponentDefinition<typeof Kit.RiseForm>('@rise-tools/kit-forms/Form')
export const InputField = createComponentDefinition<typeof Kit.InputField>(
  '@rise-tools/kit-forms/InputField'
)
export const TextField = createComponentDefinition<typeof Kit.TextField>(
  '@rise-tools/kit-forms/TextField'
)
export const SubmitButton = createComponentDefinition<typeof Kit.SubmitButton>(
  '@rise-tools/kit-forms/SubmitButton'
)
export const CheckboxField = createComponentDefinition<typeof Kit.CheckboxField>(
  '@rise-tools/kit-forms/CheckboxField'
)
export const SwitchField = createComponentDefinition<typeof Kit.SwitchField>(
  '@rise-tools/kit-forms/SwitchField'
)
export const SliderField = createComponentDefinition<typeof Kit.SliderField>(
  '@rise-tools/kit-forms/SliderField'
)
export const SelectField = createComponentDefinition<typeof Kit.SelectField>(
  '@rise-tools/kit-forms/SelectField'
)
export const RadioGroupField = createComponentDefinition<typeof Kit.RadioGroupField>(
  '@rise-tools/kit-forms/RadioGroupField'
)
export const ToggleGroupField = createComponentDefinition<typeof Kit.ToggleGroupField>(
  '@rise-tools/kit-forms/ToggleGroupField'
)
