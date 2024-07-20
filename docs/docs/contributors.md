---
sidebar_position: 80
---

# Contributors

Contributions are welcome! For easy fixes and documentation improvements, please go ahead and make a pull request.

For larger feature additions or anything that requires a time investment, please create an issue or discussion so the maintainers can help guide you and avoid wasting your time.

We really appreciate your contributions to the code and the [community](./community).

## Developing

First check out the Rise Tools repository and install dependencies:

```sh
git clone git@github.com:rise-tools/rise-tools.git
cd rise-tools
npm install
```

### Run Tests

`npm run test`

You can also run a specific test and use watch to keep the tests running as you make changes

`npm run test -- model-view --watch`

### Run Playground

You can develop by running the Playground in the iOS simulator. Please make sure you are set up for developing Expo/React Native apps.

First `cd apps/mobile`

For iOS: `npm run ios`
For Android: `npm run android`

### Run Demo Server

First, make sure you are in root folder of the project and run `npm run watch` to start the build watcher to view your changes live.

then `cd example/demo`

`npm run dev`

Now you can open the demo server from the Playground app. Connect to `ws://localhost:3005` and one of the following paths:

- `inventory`
- `controls`
- `delivery`

## Pull Requests

We follow the [Conventional Commits Pattern](https://www.conventionalcommits.org/en/v1.0.0-beta.4/) for our commits and PRs. So each commit should be prefixed with:

- `breaking:` - Make a breaking change triggering a major version
- `feat:` - Add a feature
- `fix:` - Fix a bug
- `refactor:` - Internal only changes
- `chore:` - Minor changes
- `docs:` - Changes to documentation

We use these commit messages to determine SemVer versions and to create a release changelog.