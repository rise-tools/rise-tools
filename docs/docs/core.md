---
sidebar_position: 20
---

# @rise-tools/react

Rise Tools can be described with 3 core primitives:

The base `<Rise />` components requires:
- Component Library of UI that can be rendered
- Model Source where your client will load+subscribe to data

## Rise Component

First, install `@rise-tools/react`

```tsx
import { Rise } from '@rise-tools/react`

// then, render it in your app:

<Rise
  components={myComponents}
  modelSource={modelSource}
/>
```

## Props

The Template component accepts the following props:

### `components`

The component library object, with all the component that the data can request to be displayed

### `modelSource`

The store of data that will define the views for rendering

### `onEvent`

To handle events that come from your rendered components

### `onAction`


### `path`

Specify the path within the model to render. Useful if you share one `modelSource` with several `<Rise>` components
