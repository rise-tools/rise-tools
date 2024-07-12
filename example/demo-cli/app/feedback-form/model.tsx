import { goBack, navigate } from '@rise-tools/kit-react-navigation/server'
import { RiseForm, SubmitButton, TextField, toast, View } from '@rise-tools/kitchen-sink/server'
import { response } from '@rise-tools/react'
import React from 'react'

import { RatingField } from './RatingField'

export default function FeedbackForm() {
  return (
    <View padding="$4">
      <RiseForm
        onSubmit={(values) => {
          if (!values['usefulness']) {
            navigate('')
            return response(toast('Please tell us how useful Rise is!'))
          }
          return response([toast('Thank you for your feedback!'), goBack()])
        }}
      >
        <RatingField />
        <TextField id="notes" label="Additional comments" />
        <SubmitButton>Submit</SubmitButton>
      </RiseForm>
    </View>
  )
}
