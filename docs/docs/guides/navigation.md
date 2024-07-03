# Navigation

Lets see how you can use Rise to offer multiple screens of Server-Defined UI in your app.

## Set up Client

If you are using the [Rise Playground app](/docs/playground), navigation is already set up with React Navigation.

In a custom React Native app, you should follow the setup steps for the appropriate navigation library you use:

- [React Navigation Installation](/docs/kit/react-navigation#client-installation) - If your app uses React Navigation
- [Expo Router Installation](/docs/kit/expo-router#client-installation) - If your app uses Expo Router

If your app doesn't already use one of these libraries, you will have to implement your own navigation actions. You can look through these docs and the code to get an idea of how it works.

## Set up Server

From your server, install the appropriate navigation package.

- `@rise-tools/kit-react-navigation` - If you use the Playground App or if your client is set up with React Navigation
- `@rise-tools/kit-expo-router` - If your client is set up with Expo Router

## Navigate to a New Screen

In your existing server, add a button with a navigate action. 

```tsx
const home = () => (
  <YStack>
    <Button onPress={() => {}}>Learn More</Button>
  </YStack>
);

createWSServer({ home }, 8888);
```

Now import the navigate action and call it:

```tsx
import { navigate } from '@rise-tools/kit-react-navigation/server';
// OR if you are using expo router:
import { navigate } from '@rise-tools/kit-expo-router/server';

const home = () => (
  <YStack>
    <Button onPress={navigate('learnMore')}>Learn More</Button>
  </YStack>
);
```

Then, create a new view with the same name that you navigate to, in this case `"learnMore"`.

```tsx
const learnMore = () => (
  <YStack>
    <Text>You should know this too</Text>
  </YStack>
)

// and add it to your server:
createWSServer({ home, learnMore }, 8888);
```

Now your users will see the new screen when they tap the "Learn More" button.

## Navigate Back from Current Screen

Use the `goBack` action to leave the screen.

```tsx
import { goBack } from '@rise-tools/kit-react-navigation/server';
// OR if you are using expo router:
import { goBack } from '@rise-tools/kit-expo-router/server';

const learnMore = () => (
  <YStack>
    <Text>You should know this too</Text>
    <Button onPress={goBack()}>Done</Button>
  </YStack>
)
```

As described in [Actions and Events](/docs/guides/actions-events), you can also return an action from a server-side event handler.

```tsx
const myForm = () => (
    <RiseForm onSubmit={async () => {
        // server side handler of the form submission

        // will navigate back when the client recieves this response
        return goBack()
    }}>
        ...
    </RiseForm>
)
```

## Screen Options

> Details Coming Soon.

## Route Params

Params are supported by using the [models](/docs/server-js/models) from the JS server. Here is a quick example to give you an idea:

```tsx
const home = () => (
  <YStack>
    <Button onPress={navigate('user/bob')}>Bob's Profile</Button>
    <Button onPress={navigate('user/alice')}>Alice's Profile</Button>
  </YStack>
);

const user = lookup((userId) => {
    const userProfile = query(async () => {
        // look up profile in your database and return it
        return await db.getUserProfile(userId)
    })
    return view((get) => {
        const profile = get(userProfile)
        if (!profile) return null
        return (
            <YStack>
                <H1>{profile.name}</H1>
                <Text>{profile.description}</Text>
            </YStack>
        )
    })
})

createWSServer({ home, user }, 8888)
```