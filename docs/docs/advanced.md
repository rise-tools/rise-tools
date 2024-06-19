# Advanced

## JSON Schema

### `$staticChildren`

React has two JSX factories - `jsx` and `jsxs`.

In a typical React component, children are either static:
```tsx
<View>
   <Text>Hello</Text>
   <Text>World</Text>
</View>
```

or dynamic:
```tsx
const greetings = ['Hello', 'World']

<View>
  {greetings.map((t) => <Text key={t.id}>{t.label}</Text>)}
</View>
```

For static children, React knows their order is not changing and does not require key to be provided for each item in children array. For dynamic children, key is required in case order of components changes between re-renders.

When using Rise JSX on the server to generate JSON, that information gets lost. Both dynamic and static children lead to the same JSON output:
```ts
{
  $: 'component',
  type: 'View',
  children: [
    {
      $: 'component',
      type: 'Text',
      children: 'Hello'
    },
    {
      $: 'component',
      type: 'Text',
      children: 'World'
    }
  ]
}
```

As a result, React is going to warn you about missing keys for each children, no matter whether you declared them statically or dynamically. In practice, you should only receive this warning if your children were set dynamically.

To do so, you can set `$staticChildren` to `true` to indicate that the children of a given component are static and their order is not going to change. 
```ts
{
  $: 'component',
  type: 'View',
  $staticChildren: true,
  children: [
    {
      $: 'component',
      type: 'Text',
      children: 'Hello'
    },
    {
      $: 'component',
      type: 'Text',
      children: 'World'
    }
  ]
}
```

> Note: When using Rise JSX, this is automatically set for you.
