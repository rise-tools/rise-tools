import { useStringFieldInfo, useTsController } from '@ts-react/form'
import React, { useId } from 'react'
import { Fieldset, Input, InputProps, Label, Theme, useThemeName } from 'tamagui'
import { AnimatePresence, Paragraph } from 'tamagui'

const FieldError = ({ message }: { message?: string }) => {
  return (
    <AnimatePresence>
      {!!message && (
        <Paragraph
          key="error"
          animation="100ms"
          marginTop="$2"
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

export const TextField = ({
  autoCapitalize = 'none',
  spellCheck = false,
  autoCorrect = false,
}: Pick<InputProps, 'autoCapitalize' | 'spellCheck' | 'autoCorrect'>) => {
  const {
    field,
    error,
    formState: { isSubmitting },
  } = useTsController<string>()
  const { label, placeholder, isOptional, isURL, maxLength } = useStringFieldInfo()

  const themeName = useThemeName()
  const disabled = isSubmitting

  const id = useId()

  return (
    <Theme name={error ? 'red' : themeName} forceClassName>
      <Fieldset>
        {!!label && (
          <Label theme="alt1" htmlFor={id}>
            {label} {isOptional && `(Optional)`}
          </Label>
        )}
        <Input
          disabled={disabled}
          maxLength={maxLength}
          placeholderTextColor="$color10"
          value={field.value}
          onChangeText={(text) => field.onChange(isURL ? text.toLowerCase() : text)}
          onBlur={field.onBlur}
          ref={field.ref}
          id={id}
          placeholder={placeholder}
          keyboardType={isURL ? 'url' : 'default'}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          autoCorrect={autoCorrect}
        />
        <FieldError message={error?.errorMessage} />
      </Fieldset>
    </Theme>
  )
}

export const PrettyTextField = () => (
  <TextField autoCapitalize="words" spellCheck={true} autoCorrect={true} />
)
