# JSX

We support JSX in our JS server, but we are not running React! This means there are __no hooks__ and no __rendering life cycle__.

> Note: This is still an experimental API

To set up your JS server so you can use JSX, you should install our TypeScript preset:

```sh
npm install @rise-tools/preset-typescript
```

and then, reference it from your `tsconfig.json`:

```tsx
{
  "preset": "@rise-tools/preset-typescript",
}
```
