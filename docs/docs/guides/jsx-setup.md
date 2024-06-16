# JSX

We support JSX in our JS server, but we are not running React! This means there are __no hooks__ and no __rendering life cycle__.

> Note: This is still an experimental API

To set up your JS server so you can use JSX, you should configure your `tsconfig.json` with the following:

```tsx
{
    "compilerOptions": {
        "jsx": "react-jsx",
        "jsxImportSource": "@rise-tools/react",
    }
}
```

> Known limitation: we don't support fragments yet (`<> </>`)