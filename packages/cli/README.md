# @rise-tools/cli

A command line tool to start the development with rise tools.

## Installation

```bash
npm install -g @rise-tools/cli
# or
yarn global add @rise-tools/cli
```

## Commands

### `npx rise start`
> Start the development server

```
Options:
  -ws                Enable websocket server
  -p, --prod         Start in production mode
  -p, --port [port]  Port for dev server (default: 3500)
  -m, --host [host]  Dev server host, can be localhost, lan, tunnel (default: "lan")
  -h, --help         display help for command
```

### `npx rise eject`

> Eject from Rise CLI and generate server.ts, use with your own server.

```ts
// Generated server.ts
import feedback_form from './app/feedback-form/model'
import feedback_form_social_links from './app/feedback-form/social-links/model'
import default_model from './app/model'

export const models = {
  '': default_model,
  'feedback-form': feedback_form,
  'feedback-form:social-links': feedback_form_social_links,
}
```


