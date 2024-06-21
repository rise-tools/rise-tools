# Advanced

## JSON Schema

### $staticChildren

In a typical React component, children can be either static:

```tsx
<View>
   <Text>Hello</Text>
   <Text>World</Text>
</View>
```

or dynamic:

```tsx
const greetings = ['Hello', 'World'];
<View>
  {greetings.map((t, idx) => <Text key={idx}>{t}</Text>)}
</View>
```

For static children, React doesn't require keys because their order doesn't change. However, for dynamic children, keys are necessary to track order changes between re-renders.

When using Rise JSX on the server to generate JSON, this distinction is lost. Both static and dynamic children produce the same JSON output:

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

As a result, React will warn about missing keys for each child, regardless of whether they were static or dynamic. Typically, this warning should only appear for dynamic children.

To indicate that the children of a component are static and their order won't change, set `$staticChildren` to true:

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

When using JSX, this setting is automatically applied and you should not worry about this.
