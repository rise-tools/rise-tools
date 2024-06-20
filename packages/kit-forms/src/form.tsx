import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { createContext, useContext, useEffect, useState } from 'react'
import React from 'react'
import {
  Button,
  ButtonProps,
  Checkbox,
  CheckboxProps,
  Form,
  FormProps,
  Input,
  InputProps,
  Label,
  Slider,
  SliderProps,
  SliderThumb,
  SliderTrack,
  SliderTrackActive,
  Switch,
  SwitchProps,
  SwitchThumb,
  TextArea,
  TextAreaProps,
  XStack,
  YStack,
} from 'tamagui'

type FormContext = {
  values: Record<string, any>
  isSubmitting: boolean
  setValue: (key: string, value: any) => void
}

export const FormContext = createContext<FormContext>({
  get values(): never {
    throw new Error('Wrap your form with a <RiseForm /> component')
  },
  isSubmitting: false,
  setValue: () => {
    throw new Error('Wrap your form with a <RiseForm /> component')
  },
})

type RiseFormProps = Omit<FormProps, 'onSubmit'> & {
  onSubmit: (values: Record<string, any>) => void
}
export function RiseForm({ children, onSubmit, ...props }: RiseFormProps) {
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
      <Form {...props} onSubmit={submit}>
        {children}
      </Form>
    </FormContext.Provider>
  )
}

type InputFieldProps = Omit<InputProps, 'onChangeText' | 'value'> & {
  id: string
  label?: string | React.ReactNode
}
export function InputField({ id, defaultValue, label, ...props }: InputFieldProps) {
  const formContext = useContext(FormContext)
  useEffect(() => {
    formContext.setValue(id, defaultValue)
  }, [])
  return (
    <YStack>
      <Label htmlFor={id}>{label}</Label>
      <Input
        {...props}
        value={formContext.values[id]}
        onChangeText={(text) => formContext.setValue(id, text)}
        id={id}
      />
    </YStack>
  )
}

type TextFieldProps = Omit<TextAreaProps, 'onChangeText' | 'value'> & {
  id: string
  label?: string | React.ReactNode
}
export function TextField({ id, defaultValue, label, ...props }: TextFieldProps) {
  const formContext = useContext(FormContext)
  useEffect(() => {
    formContext.setValue(id, defaultValue)
  }, [])
  return (
    <YStack>
      <Label htmlFor={id}>{label}</Label>
      <TextArea
        {...props}
        value={formContext.values[id]}
        onChangeText={(text) => formContext.setValue(id, text)}
        id={id}
      />
    </YStack>
  )
}

type SubmitButtonProps = ButtonProps & {
  pendingState?: React.ReactNode
}
export const SubmitButton = ({ pendingState, ...props }: SubmitButtonProps) => {
  const formContext = useContext(FormContext)
  if (pendingState && formContext.isSubmitting) {
    return pendingState
  }
  return (
    <Form.Trigger asChild>
      <Button disabled={formContext.isSubmitting} {...props} />
    </Form.Trigger>
  )
}

type CheckboxFieldProps = Omit<CheckboxProps, 'onCheckedChange' | 'checked'> & {
  id: string
  label?: string | React.ReactNode
}
export const CheckboxField = ({ id, label, defaultChecked, ...props }: CheckboxFieldProps) => {
  const formContext = useContext(FormContext)
  useEffect(() => {
    formContext.setValue(id, defaultChecked)
  }, [])
  return (
    <XStack alignItems="center" gap="$2">
      <Checkbox
        id={id}
        checked={formContext.values[id]}
        onCheckedChange={(checked) => formContext.setValue(id, checked)}
        {...props}
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox>
      <Label htmlFor={id}>{label}</Label>
    </XStack>
  )
}

type SwitchFieldProps = Omit<SwitchProps, 'onCheckedChange' | 'checked'> & {
  id: string
  label?: string | React.ReactNode
}
export function SwitchField({ id, defaultChecked, label, ...props }: SwitchFieldProps) {
  const formContext = useContext(FormContext)
  useEffect(() => {
    formContext.setValue(id, defaultChecked)
  }, [])
  return (
    <XStack alignItems="center" justifyContent="space-between">
      <Label htmlFor={id}>{label}</Label>
      <Switch
        {...props}
        id={id}
        checked={formContext.values[id]}
        onCheckedChange={(checked) => formContext.setValue(id, checked)}
      >
        <SwitchThumb animation="quick" />
      </Switch>
    </XStack>
  )
}

type SliderFieldProps = Omit<SliderProps, 'onValueChange' | 'value'> & {
  id: string
  label?: string | React.ReactNode
}
export function SliderField({ id, label, defaultValue, ...props }: SliderFieldProps) {
  const formContext = useContext(FormContext)
  useEffect(() => {
    formContext.setValue(id, defaultValue)
  }, [])
  return (
    <YStack>
      <Label htmlFor={id}>{label}</Label>
      <Slider
        {...props}
        id={id}
        marginVertical="$4"
        defaultValue={defaultValue}
        onValueChange={(value) => formContext.setValue(id, value)}
      >
        <SliderTrack>
          <SliderTrackActive />
        </SliderTrack>
        {defaultValue?.map((_, index) => <SliderThumb key={index} index={index} circular />)}
      </Slider>
    </YStack>
  )
}
