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
  -ws                Enable websocket server
  -p, --port [port]  Port for dev server (default: 3500)
  -m, --host [host]  dev server host, can be localhost, lan, tunnel (default: "lan")
  -h, --help         display help for command
```

### `rise-start eject`

> Eject from Rise Start and generate models.ts, use with your own server.

```ts
// Generated models.ts
import feedback_form from './app/feedback-form/model'
import feedback_form_social_links from './app/feedback-form/social-links/model'
import default_model from './app/model'

export const models = {
  '': default_model,
  'feedback-form': feedback_form,
  'feedback-form:social-links': feedback_form_social_links,
}
```


## Development

Build the project and do `npx tsx ../../packages/rise-start/src/bin/cli.ts dev`
