---
sidebar_position: 2
---

#  Getting Started

So you want to try Server Defined Rendering with Rise Tools? Lets go!

![when you have no idea what you're doing](./assets/doggie-rise-no-idea-what-doing.png)

## Quick Start Server Dev

First we will create a server that controls UI for our app. Run the command:

```sh
npm create rise@latest
```

You will name the project and it will install the dependencies (this takes a while, we plan to reduce the required dependencies soon).

This starter includes the following:

- TypeScript and NPM setup
- [@rise-tools/server](/docs/server-js) - The models and servers for your server
- [@rise-tools/kitchen-sink](/docs/kit#rise-toolskitchen-sink) - The components of your app
- [Experimental JSX support for Rise Server](/docs/guides/jsx-setup)

To get started:

```sh
cd <my-project-name>
npm run dev
```

> Note: To start the server over the public internet, run `npm run dev -- --tunnel` and your server will be available through our public proxy

Now your server should be ready to use and develop on!

Paste this new code in `src/models.tsx`:

```tsx
import { state, view } from '@rise-tools/server'
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

export const models = {
  '': incrementer,
}
```

This code establishes:

- An internal `state` model, just a simple integer
- A `view` model which renders a `YStack` container,
    - `Text` which displays the current count
    - `Button` with a handler that mutates the internal count state

Now lets test your new code!

## Option 1: Playground App

The fastest way to start developing is by downloading the [Rise Playground App](/docs/playground) from the App Store or Play Store.

Then, scan the QR Code from the terminal to add the connection to your dev server.

> Note: You may also connect to your server by manually adding `ws://<your-computer-ip>:3005` and setting the path to `home`

## Option 2: React Native Quick Start

Or you can connect a React Native app to your new server. We will demonstrate in a fresh Expo app. Start by cloning the [mobile quickstart repo](https://github.com/rise-tools/rise-mobile-quickstart):

```sh
git clone git@github.com:rise-tools/rise-mobile-quickstart.git
```

This starter app has the following setup:

- [Create a new Expo App](https://docs.expo.dev/tutorial/create-your-first-app/)
- [Set up Tamagui](https://tamagui.dev/docs/intro/installation)
- Install [@rise-tools/react](/docs/core) - The component responsible for rendering the server-defined UI
- Install `@rise-tools/ws-client` - The network client that will talk to your server
- Install [@rise-tools/kitchen-sink](/docs/kit/#rise-toolskitchen-sink) - Components and Actions for getting started quickly

See `src/riseComponents.ts` which defines the local component library for the app:

```tsx
import {
  FormComponents,
  LucideIconsComponents,
  QRCodeComponents,
  RiseComponents,
  SVGComponents,
  TamaguiComponents,
} from "@rise-tools/kitchen-sink";

export const components = {
  ...FormComponents,
  ...LucideIconsComponents,
  ...QRCodeComponents,
  ...RiseComponents,
  ...SVGComponents,
  ...TamaguiComponents,
};
```

Next, look at `src/modelSource.ts` which defines the connection to the WebSocket server we created earlier:

```tsx
import { createWSModelSource } from "@rise-tools/ws-client";

export const modelSource = createWSModelSource("ws://localhost:3005");
```

Finally lets see how it all ties together in the home screen `app/index.tsx`:

```tsx
import { Rise } from '@rise-tools/react'
import {
  useHapticsActions,
  useLinkingActions,
  useToastActions,
} from '@rise-tools/kitchen-sink'
import { modelSource } from '@/src/modelSource';
import { components } from '@/src/riseComponents';

export default function HomeScreen() {
  return (
    <Rise
      modelSource={modelSource}
      components={components}
      path="home"
      actions={{
        ...useHapticsActions(),
        ...useLinkingActions(),
        ...useToastActions(),
      }}
    />
  );
}
```

Here we render the main `<Rise>` component, we specify the component library and model source, and we specify the `incrementer` path to reference the model on the server which provides our UI. We also include the actions from the kit, so the server can perform certain local behaviors such as [haptics](/docs/kit/haptics) and [linking](/docs/kit/linking).

## Time to Code on the Server!

At this point you should be able to change the code in `index.tsx` and see the UI reflect your changes in the app.

See the [docs on models](/docs/server-js/models) to see how to manage data in the server, and browse the [Kit docs](/docs/kit) to see what components are available out-of-the-box.

## Navigation

The starter app supports [navigation](/docs/guides/navigation). If you have a custom integration in your React Native app, follow the setup guide for [Expo Router](/docs/kit/expo-router#client-installation) or [React Navigation](/docs/kit/react-navigation#client-installation).

To see how this works, replace `index.tsx` with:

```tsx
import { navigationExample } from './examples/navigation'
createWSServer(navigationExample, 8888)
```

And see the `examples/navigation.tsx` file:

```tsx
import { goBack, navigate } from "@rise-tools/kit-expo-router/server";
import { Button, Text, YStack } from "@rise-tools/kitchen-sink/server";


const home = (() => (
    <YStack>
        <Text>{'Home From Server'}</Text>
        <Button onPress={navigate('details')}>Go to Details</Button>
    </YStack>
));

const details = (() => (
    <YStack>
        <Text>{'Details From Server'}</Text>
        <Button onPress={goBack()}>Go Back</Button>
    </YStack>
));


export const navigationExample = {
    home,
    details
}
```

Now your app has a button that will go to a new screen.