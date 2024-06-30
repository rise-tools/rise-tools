## Introduce the <Rise> component 

```tsx
const components = {
  Taxis: {
    component: Taxis,
  },
  Restaurants: {
    component: Restaurants,
  },
  Groceries: {
    component: Groceries,
  },
}
```

```tsx
const modelSource = createModelSource('http://localhost:3000/api')
```

```tsx
<Rise
  components={components}
  modelSource={modelSource}
/>
```

```tsx
// First variant
[
  {
    $: 'component',
    component: 'Groceries',
  }
  {
    $: 'component',
    component: 'Restaurants',
  },
  {
    $: 'component',
    component: 'Taxis',
  }
]

// Second variant
[
  {
    $: 'component',
    component: 'Groceries',
  },
  {
    $: 'component',
    component: 'Taxis',
  },
  {
    $: 'component',
    component: 'Restaurants',
  }
]
```

## When you shipped the app, you included design system components into components= prop: Title, Image, Button

```tsx
import { View, H2, Icon, Button } from 'tamagui'
```

```tsx
{
  View: {
    component: View,
  },
  H2: {
    component: H2,
  },
  Icon: {
    component: Icon,
  },
  Button: {
    component: Button,
  },
  /*
  Taxis: {
    component: Taxis,
  },
  Restaurants: {
    component: Restaurants,
  },
  Groceries: {
    component: Groceries,
  },
  */
}
```

```tsx
{
  $: 'component',
  component: 'View',
  children: [
    {
      $: 'component',
      component: 'Icon',
      props: {
        icon: 'MessageCircleHeart'
      }
    },
    {
      $: 'component',
      component: 'View',
      children: [
        {
          $: 'component',
          type: 'H2',
          children: 'Do you like the App?'
        },
        {
          $: 'component',
          type: 'Button',
          children: 'Send Feedback',
          props: {
            onPress: {
              $: 'action',
              action: 'navigate',
              path: 'survey',
            }
          }
        }
      ]
    }
  ]
}
```

### Introduce JSX because the json looks like crap

```tsx
import { View, Icon, Button, H2, navigate } from '@rise-tools/kitchen-sink'

<View>
  <Icon icon="MessageCircleHeart" />
  <View>
    <H2>Do you like the App?</H2>
    <Button onPress={navigate('delivery:feedback-form')}>Send Feedback</Button>
  </View>
</View>
```

#### Note

In our live demo, we will be using Tamagui. Some of the most common components are:
- `XStack` - like `<View />`, but with flex direction `row` (which is default)
- `YStack` - like `<View />`, but with flex direction `column`

In Rise Tools, we have Tamagui support out of the box. You can use `XStack` and `YStack` to create layouts, among other components and see the results in Rise Playground. 

### Live code survey

Starting point:

```tsx
export const models = {
  delivery: UI,
}

function UI() {
  return (
    <YStack gap="$4" backgroundColor="$background">
      <Survey />
      <Groceries />
      <Restaurants />
      <Taxi />
    </YStack>
  )
}
```

Steps:
- show current `ui.tsx` file (as above, "starting point")
- show tapping on the button renders nothing
- create `delivery/feedback-form.tsx` on the server and add it to `models`
- tap the button again and see it render that dummy screen back
- implement the feedback form using Rise Tools `kit` components
- demonstrate their interactivity
- implement actions: `navigate` (to go back), `toast` (to show success)
- demonstrate full flow
- now, add validation: show `toast` message if nothing was selected, perform other action otherwise
- demonstrate full flow (once with error, second time with success)

End point: `./example/demo/src/delivery/feedback-form.tsx`
