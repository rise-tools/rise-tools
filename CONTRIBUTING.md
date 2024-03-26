Contributing to this project
====

### `packages:build` and `packages:watch`

> Running this script is not required when building React Native application as it runs from source

Before starting any of the projects in [`apps/`](./apps/) folder, make sure to run either of the scripts to make sure you can preview and debug your changes.

> [!NOTE]
> We're using `tsc` (TypeScript compiler) to compile `@react-native-templates/app` project. Because that project uses `references` field to point to other TypeScript projects in this monorepo, `tsc` will compile everything in the right order.
