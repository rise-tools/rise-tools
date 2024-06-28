---
sidebar_position: 2
---

#  Getting Started

So you want to try Server Defined Rendering with Rise Tools? Lets go!

![when you have no idea what you're doing](./assets/doggie-rise-no-idea-what-doing.png)

## Quick Start Server Dev

Fist we will create a server that controls UI for our app.

Start by cloning the [server quickstart repo](https://github.com/rise-tools/rise-server-quickstart):

```sh
git clone git@github.com:rise-tools/rise-server-quickstart.git
```

This starter includes the following:

- TypeScript and NPM setup
- [@rise-tools/server](/docs/server-js) - The models and servers for your server
- [@rise-tools/kitchen-sink](/docs/kit#rise-toolskitchen-sink) - The components of your app
- [Experimental JSX support for Rise Server](/docs/guides/jsx-setup)

The main code is in `src/index.tsx`:

```tsx
import { createWSServer, state, view } from '@rise-tools/server'
import { YStack, Text, Button } from '@rise-tools/kitchen-sink/server'

const [count, setCount] = state(0)

const incrementer = view(get => (
    <YStack>
        <Text>The count is {get(count)}</Text>
        <Button onPress={() => {
            setCount(c => c + 1)
        }}>
            Plus 1
        </Button>
    </YStack>
))

console.log('Starting server on ws://localhost:8888')

createWSServer({ incrementer }, 8888)
```

This code establishes:

- An internal `state` model, just a simple integer
- A `view` model which renders a `YStack` container,
    - `Text` which displays the current count
    - `Button` with a handler that mutates the internal count state
- The WebSocket server on port `8888` which serves the `incrementer` view

To run the app:

```sh
cd rise-server-quickstart
npm install
npm run dev
```

If everything goes well, your server is ready to use and develop on!

## Playground App

The fastest way to start developing is by downloading the [Rise Playground App](/docs/playground) from the App Store or Play Store.

Connect to your server by adding `ws://<your-computer-ip>:8888` and setting the path to `incrementer`

## React Native Quick Start

> TODO: quick start react native app

## Time to Code on the Server!

At this point you should be able to change the code in `index.tsx` and see the UI reflect your changes in the app.

> TODO: example code changes

## Next Steps

- Navigation
- Custom Components
- ???