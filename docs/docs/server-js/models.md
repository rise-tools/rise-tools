---
title: Models
---
# Server Models

The server-side models can be defined as a graph of "atoms"

## State

The base atom for managing state on the server. Supports any JSON value.

The `state` function returns a state model and a function that allows you to set it.

```tsx
import { state } from '@rise-tools/server'

const [ age, setAge ] = state(0)

console.log(`Just born ${age.get()} years old.`)
```

The state setter can either take a mutation function or an absolute value:

```tsx
function birthday() {
    setAge(age => age + 1)
}
function rebirth() {
    setAge(0)
}
```

### `get`

The state model has a `get()` method:

```tsx
birthday()
birthday()
console.log(`${age.get()} year old`) // "2 years old"
```

### `subscribe`

You can also `subscribe` to a state model. The subscribe handler will be called immediately with the current value.

```tsx
const unsubscribe = age.subscribe(value => console.log(`Now ${value} years old`)) // "Now 0 years old"
rebirth() // "Now 0 years old"
birthday() // "Now 1 years old"

// call the unsubscribe function to remove the subscription.
unsubscribe()
birthday() // nothing logged
```

## Query

An atom that is meant to load data from an external source. Define with an async function that will load the data.

Here we will demonstrate with the node.js file system API, but it will be more common to use databases or data loaded over the network.

```tsx
import { query } from '@rise-tools/server'
import { readdir, writeFile } from 'fs/promises'

const myLists = query(async () => {
    return await readdir('content')
})
```

### `load`

A query atom can be loaded by calling the async `.load()` function

```tsx
console.log(await myLists.load()) "[ 'songs.txt' ]"
```

The atom will cache the most recently loaded value. If you call load twice, the source function will not be re-called.

### `get`

The atom will cache the most recently loaded value, which can be retrieved with `get`

```tsx
console.log(myLists.get()) "[ 'songs.txt' ]"
```

### `invalidate`

When the value may have changed, you can call `invalidate`

```tsx
async function writeList(name: string, items: string[]) {
    await writeFile(`content/${name}.txt`, items.join('\n'))
    myLists.invalidate()
}
```

After invalidation, the next call to `load` will recall the query function.

```tsx
await writeList('games', [ 'factorio', 'gta' ])
console.log(await myLists.load()) // "[ 'songs.txt', 'games.txt' ]"
```

### `subscribe`

You may subscribe to a query model. The model will automatically re-fetch if there is an active subscriber.

```tsx
const unsubscribe = myLists.subscribe(lists => {
    console.log(`lists: ${lists.join(', ')}`)
}) // "lists: songs.txt, games.txt"
await writeList('movies', [ 'hackers', 'johnny mnemonic' ])
// now myLists will be invalidated and re-fetched because of the subscription
// "lists: songs.txt, games.txt, movies.txt
unsubscribe()
```

## Lookup

The `lookup` model allows you to return a different atom based on an input string. This helps you construct a graph of models based on some arguments.

```tsx
const lists = lookup((listName: string) => {
    return query(async () => {
        const list = await readFile(`content/${listName}.txt`)
        return list.split('\n')
    })
})
```

> Note: a lookup must always take a string argument, and the argument should generally not accept slashes. This is so that the model server may use a lookup to construct a path such as /lists/games

### `get`

To fetch a model from a lookup, call `get`:

```tsx
const moviesList = lists.get('movies')
console.log(await moviesList.load().join(', ')) // "hackers, johnny mnemonic"
```

## View

A view is a model that is derived from other models. Define views with a function that takes a getter argument:

```tsx
const summary = view(get => {
    const movieCount = get(moviesList)?.count || 0
    const gameCount = get(gamesList)?.count || 0
    return `${movieCount} movies and ${gameCount} games`
})
```

You will often want to use a `view` to render a user interface based on some state. The [jsx](/docs/guides/jsx-setup) utility comes in handy when defining these views.

```tsx
const movies = view(get => {
    const moviesData = get(moviesList)
    return (
        <YStack>
            {moviesData?.map((movie, index) => (
                <Text key={index}>{movie}</Text>
            ))}
        </YStack>
    )
})
```

### `get`

You call `get()` to immediately retrieve the current value of the view.

> Note: this does not ensure that the dependent values have been loaded. It will work if all the dependencies are states, functions, or other views. Otherwise it may result in a stale value.

### `load`

Asynchronously load the value of the view. This will call the load function of the dependent models, so the result of `load()` will be up to date.

### `subscribe`

Watch the value of the view over time. This will call subscribe on the dependent models, to make sure they are loaded and stay loaded.

## Object Models

Anywhere you can use a model, you can provide an object. For example in the server:

```tsx
createServer({
    foo: () => "Model Foo",
    bar: () => "Model Bar",
})
```

You can also return an object a lookup.

```tsx
const users = lookup((userId) => {
    const profile = query(async () => {
        return db.getUserProfile(userId)
    })
    return {
        profile,
        profilePage: view(get => (
            <ProfilePage profile={get(profile)} />
        ))
    }
})

createServer({ users }, 3000)
```

This example will enable a path such as `users/bob/profile` which is the data of Bob's profile, and you can link to `users/bob/profilePage` to see the page which displays his profile.

## Static Functions

You may also use a function as a model. The result may be cached indefinitely. If you expect this value to change, use a `state` instead.

```tsx
const button = () => ({
    $: 'component',
    key: 'myButton',
    component: 'Button',
    props: {},
    children: 'Press Me',
})
```

Or if you prefer to use [JSX](/docs/guides/jsx-setup):

```tsx
const button = () => <Button>Press Me</Button>
```