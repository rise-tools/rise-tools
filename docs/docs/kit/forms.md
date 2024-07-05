# kit-forms


> Note: This document is a WIP. Your [contributions](/docs/contributors) to the docs would be greatly appreciated!

For more details on `@rise-tools/kit-forms`, see the [implementation here](https://github.com/rise-tools/rise-tools/blob/main/packages/kit-forms/src/index.tsx).

## Client Installation

```sh
npm install @rise-tools/kit-forms
```

## Components

### RiseForm

Props:

- `onSubmit(values: Record<string, any>)` - Callback after submission for handling of form data
- ... Tamagui Form props

Usage:

```tsx
<Form onSubmit={(values) => {
    console.log("server callback. name is: " + values.name)
}}>
    <TextField id="name" label="What is your name?" />
    <SubmitButton>Submit</SubmitButton>
</Form>
```

### InputField

Text input field

### TextField

Multi-line input

### SelectField

Select dropdown to allow the user to select from a number of items

### CheckboxField

Boolean input with a checkbox UI

### SwitchField

Boolean input with a switch UI

### SliderField

A slider value input.

Usage:

### RadioGroupField

### ToggleGroupField

### SubmitButton

Usage:

```tsx
<SubmitButton pendingState={<Text>Submitting...</Text>}>
    Submit Form
</SubmitButton>
```

## Validating the form

Your server-side function can validate the input and respond with a toast or navigation action to indicate success.

> Note: Built-in validation errors coming soon, will allow you to highlight the fields that are not valid