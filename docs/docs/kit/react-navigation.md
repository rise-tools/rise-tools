# kit-react-navigation

## Client Installation

First make sure you are set up with React Navigation. If not, follow [this guide](https://reactnavigation.org/docs/getting-started). Then install the kit adapter:

```sh
npm install @rise-tools/kit-react-navigation 
```

> This doc is still a Work-in-Progress. Your help would be appreciated in completing it.

You will need a "wildcard" route that will be used for your server-defined screens.

To see an example client implementation that uses React Navigation, see the [source code of the playground app](https://github.com/rise-tools/rise-tools/tree/main/apps/mobile). (Keep in mind this is more complicated than usual because it supports connections to many Rise Servers.)

## Actions

### `navigate(path: string, options: NativeStackNavigationOptions)`

### `goBack`

## Components

### `StackScreen`

https://reactnavigation.org/docs/stack-navigator/#options

## Type checking with TypeScript

Place the following code in your project, next to your server-side models:

```ts
import '@rise-tools/kit-react-navigation/server'
declare module '@rise-tools/kit-react-navigation/server' {
  interface Navigate {
    // your server-defined and local screens go here
    screens:
      // no params
      'home'
      // with param (when used together with lookup() model state)
      | `profile/${string}`
    }
  }
}
```

This will provide type-safety, when calling navigate:

```ts
navigate('home')
navigate('profile/mike', { title: 'Profile of Mike' })
```
