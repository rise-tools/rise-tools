import feedback_form from '../app/feedback-form/model'
import feedback_form_rating_field from '../app/feedback-form/rating-field/model'
import default_model from '../app/model'

export const models = {
  '': default_model,
  'feedback-form': feedback_form,
  'feedback-form:rating-field': feedback_form_rating_field,
}

export type Model = '' | 'feedback-form' | 'feedback-form:rating-field' | (string & {})
