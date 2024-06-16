---
sidebar_position: 1
---

# JSON Types


This is the base functionality of Rise, to specify which components will be rendered in your `<Rise>`

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
      component: 'Button',
      children: 'Tap A'
    },
    {
      $: 'component',
      component: 'Button',
      children: 'Tap B'
    }
  ]
}
```

There are several context you may wish to specify JSON data:

### Root Model State

These are the values that may be referenced by your `<Rise />` component:

- [Component](#component)
- Primitive `string` or `number`
- Array of [Root Model States](#root-model-state)
- [Ref](#ref) (as long as the resulting Ref points to a Component or Primitive)

### Prop Model State

These values may be included in the `props` object of your [component](#component) values:

- [Component](#component)
- Primitive `string` or `number`
- Custom object for your prop
- [Callback Model State](#callback-model-state)
- [Ref](#ref)

### Callback Model State

These are specific JSON values that may be used for a callback prop of your components:

- [Action](#action)
- [Event](#event)
- [Ref](#ref) (as long as the resulting Ref points to an Action or Event)


## Component

The primary way you specify which component to render here.

```ts
{
  $: 'component',
  key: 'myRow', // used to specify sort order
  component: 'Button', // this component must be defined in your Component Library
  props: {
    gap: '$2'
  },
  children: 'Text'
}
```

### `key`

Required string or number which will be used to sort client components

### `component`

String key of the component in your Rise component library.

### `props`

[Prop values](#prop-model-state) that will be passed to your component

### `children`

More [Root Model State](#root-model-state) values that will be rendered as the children of this component

## Ref

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

## Action

For props that expect a callback, use an `$: 'action'` type to specify that a client-side action will be called.

```ts
{
  $: 'action',
  name: 'navigate', // the name string is required
  // other action fields may be included here, to pass to your client when this action is called
}
```

This action should be handled with the `<Rise onAction={() => {}}` handler.

You may also specify an array of events to a callback prop, allowing you to trigger multiple actions at once.

## Event

For props that are treated as events or callbacks on the client, you may use an `$: 'event'` type to specify that the client will go to the server when this happens.

```ts
{
  $: 'component',
  component: 'Button',
  props: {
    onPress: {
      $: 'event',
    }
  },
  children: 'Tap me'
}
```

You can then listen to the events with the `onEvent` prop on `<Rise>`.

```tsx
<Rise
  components={components}
  modelSource={modelSource} 
  onEvent={async (event) => {
    // you can use this technique to monitor events
    console.log(event)
    // this is the default behavior of onEvent:
    return await model.onEvent(event)
  }} 
/>
```

The event object from `<Rise />` contains properties to let you handle events as desired:

```ts
type RiseEvent<T = any, K = any> = {
  target: {
    key?: string
    path: string
    component: string
  }
  name: string
  actions: Action[]
  payload: K
}
```

### Event Response Payload

#### `target`

Describes the component that trigerred the event:
- `key` - optional, present only if it was explicitly set by you
- `path` - path to the component in a rendered tree 
- `component` - name of the component that trigerred the event, e.g. "TouchableOpacity"

#### `name`

Name of the event handler, e.g. `onPress`.

#### `payload`

First argument that was passed to the event handler, shape is specific to the component that trigerred the event. Note that native events are not serialised and passed. For `TouchableOpacity`'s `onPress`, you will receive `[native code]` instead.

#### `actions`

Optional field that can be helpful to differntiate events within the application or trigger certain actions. Its shape is opaque to this library and can be set to anything that works for your use case.

For example, it can be a string, e.g. `navigation:goBack` or an array: `['navigation', 'goBack']`. 

Then, in the `onEvent` handler, you may want to do as follows:
```tsx
<Rise
  components={components}
  model={model} 
  onEvent={(event) => {
    // assumes event.dataState.action is an array
    if (event.dataState.action?.includes('navigation')) {
      return handleNavigationEvent(event)
    }
    handleGenericEvent(event)
  }} 
/>
```

