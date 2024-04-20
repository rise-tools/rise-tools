import { ComponentProps, createContext, ReactNode, useContext, useEffect, useState } from 'react'
import React from 'react'
import { Button, Fieldset, Form, Input } from 'tamagui'

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

export function RiseForm({ children, onSubmit, ...props }: ComponentProps<typeof Form>) {
  const [values, setValues] = useState({})
  const [isSubmitting, setSubmitting] = useState(false)

  const submit = async () => {
    setSubmitting(true)
    // @ts-ignore
    // tbd: in the future, parse response from the server and perform update locally
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
      <Form {...props} onSubmit={submit}>
        {children}
      </Form>
    </FormContext.Provider>
  )
}

export const RiseTextField = ({
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

export const RiseSubmitButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Form.Trigger asChild>
      <Button {...props} />
    </Form.Trigger>
  )
}

// tbd: add validation with Zod
RiseForm.validate = (props: any) => props
RiseSubmitButton.validate = (props: any) => props
RiseTextField.validate = (props: any) => props
