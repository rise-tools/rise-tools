# rise-start

Rise Start is a command line tool to start the development server for the rise tools.

## Installation

```bash
npm install -g rise-start
# or
yarn global add rise-start
```

## Commands

### `rise-start dev`
> Start the development server

```
Options:
  -ws                Websocket server
  -p, --port [port]  Port for dev server (default: 3500)
  -m, --host [host]  dev server host, can be localhost, lan, tunnel (default: "lan")
  -h, --help         display help for command
```

### `rise-start gen`

> Generate models.tsx for the project, example for demo-cli:

```ts
import feedback_form from './app/feedback-form/model'
import feedback_form_social_links from './app/feedback-form/social-links/model'
import default_model from './app/model'

export const models = {
  '': default_model,
  'feedback-form': feedback_form,
  'feedback-form:social-links': feedback_form_social_links,
}

export type Model = '' | 'feedback-form' | 'feedback-form:social-links' | (string & {})
```
