import { useStringFieldInfo, useTsController } from '@ts-react/form'
import { useId } from 'react'
import {
  Fieldset,
  Input,
  InputProps,
  Label,
  Theme,
  useThemeName,
} from '@react-native-templates/demo-ui'

import { AnimatePresence, Paragraph } from 'tamagui'

const FieldError = ({ message }: { message?: string }) => {
  return (
    <AnimatePresence>
      {!!message && (
        <Paragraph
          key="error"
          animation="100ms"
          mt="$2"
          theme="alt2"
          enterStyle={{
            y: -6,
            scaleY: 0.1,
            opacity: 0,
          }}
          exitStyle={{
            y: -6,
            opacity: 0,
            scaleY: 0,
          }}
          opacity={1}
          y={0}
          scaleY={1}
        >
          {message}
        </Paragraph>
      )}
    </AnimatePresence>
  )
}

export const TextField = (props: Pick<InputProps, 'size' | 'autoFocus' | 'secureTextEntry'>) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<string>()
  const { label, placeholder, isOptional, maxLength, isEmail, isURL, uniqueId } =
    useStringFieldInfo()
  const themeName = useThemeName()
  const id = useId()
  const disabled = isSubmitting
  const isPrettyName = !isURL && !isEmail && uniqueId !== 'path'
  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset>
        {!!label && (
          <Label theme="alt1" size={props.size || '$3'} htmlFor={id}>
            {label} {isOptional && `(Optional)`}
          </Label>
        )}
        <Input
          disabled={disabled}
          maxLength={maxLength}
          placeholderTextColor="$color10"
          spellCheck={isPrettyName ? false : undefined}
          autoCapitalize={isPrettyName ? 'none' : undefined}
          keyboardType={isEmail ? 'email-address' : undefined}
          value={field.value}
          onChangeText={(text) => field.onChange(text)}
          onBlur={field.onBlur}
          ref={field.ref}
          placeholder={placeholder}
          id={id}
          {...props}
        />
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}
