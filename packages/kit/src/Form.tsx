import { ComponentProps, createContext, ReactNode, useContext, useEffect, useState } from 'react'
import React from 'react'
import { Button, Fieldset, Form as TForm, Input } from 'tamagui'

type FormContext = {
  values: {
    [key: string]: any
  }
  isSubmitting: boolean
  setValue: (key: string, value: any) => void
}

const FormContext = createContext<FormContext>({
  get values(): never {
    throw new Error('Wrap your form with a <RiseForm /> component')
  },
  isSubmitting: false,
  setValue: () => {
    throw new Error('Wrap your form with a <RiseForm /> component')
  },
})

export function Form({ children, onSubmit, ...props }: ComponentProps<typeof TForm>) {
  const [values, setValues] = useState({})
  const [isSubmitting, setSubmitting] = useState(false)

  const submit = async () => {
    setSubmitting(true)
    // @ts-ignore replace ComponentProps with our own, so that we allow functions to receive args
    await onSubmit?.(values)
    setSubmitting(false)
  }

  return (
    <FormContext.Provider
      value={{
        values,
        isSubmitting,
        setValue: (key, value) => setValues((state) => ({ ...state, [key]: value })),
      }}
    >
      <TForm {...props} onSubmit={submit}>
        {children}
      </TForm>
    </FormContext.Provider>
  )
}

export const TextField = ({
  label,
  name,
  value,
  ...props
}: ComponentProps<typeof Input> & {
  name: string
  label: ReactNode
}) => {
  const formContext = useContext(FormContext)

  useEffect(() => {
    formContext.setValue(name, value)
  }, [value])

  return (
    <Fieldset>
      {label}
      <Input
        disabled={formContext.isSubmitting}
        value={formContext.values[name]}
        onChangeText={(text) => formContext.setValue(name, text)}
        id={name}
        {...props}
      />
    </Fieldset>
  )
}

export const SubmitButton = (props: ComponentProps<typeof Button>) => {
  const formContext = useContext(FormContext)

  return (
    <TForm.Trigger asChild>
      <Button disabled={formContext.isSubmitting} {...props} />
    </TForm.Trigger>
  )
}

// tbd: add validation with Zod
Form.validate = (props: any) => props
SubmitButton.validate = (props: any) => props
TextField.validate = (props: any) => props
