# Refs

You can use a Ref to include one value from your model into another.


## Refs for Components

A ref may be used to defer loading of a subtree of components.

```tsx
import { ref } from '@rise-tools/server'

createWSServer({
    home: () => (
        <View>
            <H3>This component will be loaded after this text:</H3>
            {ref('otherView')}
        </View>
    ),
    otherView: () => (
        <H3>This component loads next, and can be updated independently</H3>
    )
})
```

This `otherView` may be defined as a [state](/docs/server-js/models#state) or a [view](/docs/server-js/models#view) model, and the home component does not need to be re-transmitted when `otherView` changes. 
s
## Refs for Props

Say you have a value that is used in several places, like a number. The client will fetch this value independently.

```tsx
const [volume, setVolume] = state(0)

createWSServer({
    volume,
    slider: () => (
        <Slider
            value={ref('volume')}
            onValue={newVolume => setVolume(newVolume)}
        />
    ),
    volumeHeading: () => <H2>The volume is {ref('volume')}</H2>
})
```

You can contrast this with the implementation that uses the [view model](/docs/server-js/models#view) instead of refs. This will result in both `slider` and `volumeHeading` values being sent independently to the client when the volume changes:

```tsx
const [volume, setVolume] = state(0)

createWSServer({
    slider: view(get => (
        <Slider
            value={get(volume)}
            onValue={(newVolume) => setVolume(newVolume)}
        />
    )),
    volumeHeading: view(get => <H2>The volume is {get(volume)}</H2>)
})
```


## Raw JSON definition

Over the network, refs are expressed with the [Ref State](/docs/server-spec/json-types#ref).