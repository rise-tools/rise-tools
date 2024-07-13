import feedback_form from './app/feedback-form/model'
import feedback_form_social_links from './app/feedback-form/social-links/model'
import default_model from './app/model'

export const models = {
  '': default_model,
  'feedback-form': feedback_form,
  'feedback-form:social-links': feedback_form_social_links,
}

export type Model = '' | 'feedback-form' | 'feedback-form:social-links' | (string & {})
