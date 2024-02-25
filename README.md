![React Native Templates](assets/BannerReame.png)

Your UI, defined with any data source

- Modular Data Sources - use the websocket data source or build your own
- Custom Component Suites - use the Rise components based on Tamagui, or build your own
- References - Components can refer to other data keys
- Safety - components validate their own props. Avoid crashes, even with bad data
- Rise Remote - Out-of-the box client app for you to build custom experiences quickly
- Extensible Events
- WS Server - Build custom apps entirely on the server

### This repo is a MESSY WORK IN PROGRESS. Please, do not use this yet! At the moment I would welcome contributors but I cannot support any consumers of the system

For now, you can view this repo as inspiration for how easy and powerful it is to leverage server-driven UI.

I am building an app+server to control a large art project with 25,000 LEDs, and that is my current focus of this side project.

This repo contains the following sub-projects:

- React Native Templates core - `packages/core`
- Demo Component Library - `packages/app/demoComponents.tsx`
- Websocket Data source client+server `packages/ws-client` and `apps/server/ws-rnt-server.ts`
- Art project server - `apps/server`
- Rise App: app with UI that is entirely server-defined, used as a remote control for the art project - `apps/rise-mobile`

Later in 2024 I will hopefully focus on the open source side of things.

## Overview

React Native Templates (RNT) can be described with 3 core primitives:

- Component Library of UI your client can render
- Data Source where your templates will load+subscribe to data
- Template component to render in the app, using the data source and component library

## Template Component

This will be published from `@react-native-templates/core`

```ts
import { Template } from '@react-native-templates/core`

// then, render it:

<Template
  components={myComponents}
  dataSource={dataSource}
/>
```

The Template component accepts the following props:

### `components`

The component library object, with all the component that the data can request to be displayed

### `dataSource`

The store of data that will define the views for rendering

### `onEvent`

To handle events that come from your rendered components

### `path`

Specify the path within the dataSource to render. Useful if you share one data source with several `<Template>`s

## Component Library

The components are an object that you pass to the template. Your library could be defined as:

```ts
import { View, Text } from 'react-native'

const components = {
  View: { component: View },
  Text: { component: Text },
}
```

Each component definition may also have a `validator` which is a function that accepts the props from the dataSource and returns the props if they are valid. If they are invalid, an error is thrown. This is in place to prevent crashes in situations where invalid props are passed into your components.

## Data Sources

The template uses "stores" of data to decide what UI to render. RNT is entirely network-agnostic, but it is designed for realtime scenarios where your server can push updates to the UI.

The `DataSource` is an object with one mandatory function to returns a store for a given path. If no `path` prop was provided to the `<Template>`, the root path of "" (empty string) will be used to query for the UI data.

```ts
type DataSource = {
  get: (key: string) => Store
}
```

A Store allows the template to get and subscribe to data changes:

```ts
export type Store<V = unknown> = {
  get: () => V
  subscribe: (handler: () => void) => () => void
}
```

### Component Data

This is the base functionality of RNT, to specify which components will be rendered in your `<Template>`

```ts
{
    $: 'component',
    key: 'myRow', // used to specify sort order
    component: 'XStack', // this component must be defined in your Component Library
    props: {
        gap: '$2'
    },
    children: [
        {
            $: 'component',
            key: 'a',
            component: 'Button',
            children: 'Tap A'
        },
        {
            $: 'component',
            key: 'b',
            component: 'Button',
            children: 'Tap B'
        }
    ]
}
```

### Ref Data

Your store data can include references to data from other stores.

```ts
{
    $: 'ref',
    key: 'myOtherThing',
    ref: 'otherPath'
}
```

Refs can be specified as arrays, to look up data within objects and arrays of the other path value:

```ts
{
    $: 'ref',
    key: 'myOtherThing',
    ref: ['otherPath', 'key1', 0, 'key3']
}
```

You can specify Refs as children components or props of any component. (Maybe even deep props?)

### Events

Docs coming soon. tldr: define `onTemplateEvent` on your library component. Listen with the `onEvent` prop on `<Template>`. Pass custom values in the props of the event in the component data. For an example, see how Rise handles navigation.

## Rise Component Library

This is a messy set of components that I am using for the development of Rise. It is mostly based on Tamagui and should eventually be published as `@react-native-templates/tamagui-components` and/or `/rise-components`

## WebSocket Data Source

This is a reference implementation of the data source, built with websockets. The server allows you to define UI that will be updated in realtime from the client.

## Rise App

This app will be used for my own purposes and will hopefully be published to the app stores soon. I see it as a "remote control" for arbitrary servers, such as controlling art projects or automating my home and work. As long as the server uses the `ws-source-server` and renders components from the Component Library, I can build new mobile experiences without shipping new apps through the app stores.

The Rise app allows the user to specify different "connections", which are WebSocket URLs that will define their UI.

Also, Rise supports navigation between different screens in the app. With a custom event definition such as `props: { onPress: [ 'navigate', 'myOtherPath' ] }`

## Dev Workflow

Step 1. Checkout and run `yarn`

Usually I develop by running the `apps/rise-mobile` app in the iOS simulator.

Step 2. `yarn ios`

Then I run `apps/server`, which is focused on the LED art project and various integrations.

Step 3. `yarn server`

## Big TODOs:

- Publish Rise app to the iOS and Android app stores
- Move `ws-rnt-server.ts` to standalone package `ws-source-server`
- Move `demoComponents.tsx` to standalone package `tamagui-components`
- Publish packages to NPM under the `@react-native-templates` org:
  - `core`
  - `ws-source-client`
  - `ws-source-server`
  - `tamagui-components` and/or `rise-components`
- RNT Documentation
- Rise app Website
- API Reference
- Move lighting-related server code to independent repo
- Improve type safety across the system
- Web support
