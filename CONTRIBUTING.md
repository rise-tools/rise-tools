Contributing to this project
====

## Building the project

### `packages:build` and `packages:watch`

> Running this script is not required when building React Native application as it runs from source

Before starting any of the projects in [`apps/`](./apps/) folder, make sure to run either of the scripts to make sure you can preview and debug your changes.

> [!NOTE]
> We're passing `--force` while running `packages:build` to make sure all packages are recompiled when this command is run. Otherwise, it is possible that [`tsc` will not compile a project if the timestamp on the `.tsbuildinfo` file says that the last build was after all the files were modified](https://github.com/microsoft/TypeScript/issues/50646). This can lead to bugs when `lib` folder (where compiled code is placed) is removed.

## Adding a new monorepo package

If your project is TypeScript, list it in [tsconfig.build.json](./tsconfig.build.json) to make sure its compiled.
