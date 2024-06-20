import { createContext, useContext, useEffect, useState } from 'react'
import React from 'react'
import * as Tamagui from 'tamagui'

type FormContext = {
  values: Record<string, any>
  isSubmitting: boolean
  setValue: (key: string, value: any) => void
}

export const FormContext = createContext<FormContext>({
  get values(): never {
    throw new Error('Wrap your form with a <Form /> component')
  },
  isSubmitting: false,
  setValue: () => {
    throw new Error('Wrap your form with a <Form /> component')
  },
})

type FormProps = Omit<Tamagui.FormProps, 'onSubmit'> & {
  onSubmit: (values: Record<string, any>) => void
}
export function Form({ children, onSubmit, ...props }: FormProps) {
  const [values, setValues] = useState({})
  const [isSubmitting, setSubmitting] = useState(false)

  const submit = async () => {
    setSubmitting(true)
    await onSubmit(values)
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
      <Tamagui.Form {...props} onSubmit={submit}>
        {children}
      </Tamagui.Form>
    </FormContext.Provider>
  )
}

type InputProps = Omit<Tamagui.InputProps, 'onChangeText'> & {
  id: string
}
export function Input({ id, defaultValue, ...props }: InputProps) {
  const formContext = useContext(FormContext)

  useEffect(() => {
    formContext.setValue(id, defaultValue)
  }, [])

  return (
    <Tamagui.Input
      {...props}
      value={formContext.values[id]}
      onChangeText={(text) => formContext.setValue(id, text)}
      id={id}
    />
  )
}

type TextAreaProps = Omit<Tamagui.TextAreaProps, 'onChangeText'> & {
  id: string
}
export function TextArea({ id, defaultValue, ...props }: TextAreaProps) {
  const formContext = useContext(FormContext)

  useEffect(() => {
    formContext.setValue(id, defaultValue)
  }, [])

  return (
    <Tamagui.TextArea
      {...props}
      value={formContext.values[id]}
      onChangeText={(text) => formContext.setValue(id, text)}
      id={id}
    />
  )
}

type ButtonProps = Tamagui.ButtonProps & {
  pendingState?: React.ReactNode
}
export const FormButton = ({ pendingState, ...props }: ButtonProps) => {
  const formContext = useContext(FormContext)

  if (pendingState && formContext.isSubmitting) {
    return pendingState
  }

  return (
    <Tamagui.Form.Trigger asChild>
      <Tamagui.Button disabled={formContext.isSubmitting} {...props} />
    </Tamagui.Form.Trigger>
  )
}
