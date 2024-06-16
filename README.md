![Rise Tools](assets/RiseToolsBanner.png)

Your UI, defined with any data source

> [!WARNING]  
> This repo is a WORK IN PROGRESS. Please, do not use this yet! At the moment, we would welcome contributors but we cannot support any consumers of the system. For now, you can view this repo as inspiration for how easy and powerful it is to leverage Server-Defined Rendering.

- Modular Data Sources - use the [included TypeScript server](https://rise.tools/docs/server-js/), or [bring your own](https://rise.tools/docs/server-spec/)
- Custom Component Suites - use the [Rise Kit](https://rise.tools/docs/category/kit-reference) and [Tamagui](https://rise.tools/docs/kit/tamagui), or [use your own components](https://rise.tools/docs/guides/custom-components)
- References - [Components can refer to other data keys](https://rise.tools/docs/guides/refs).
- Safety - [Server data is guarded by the client](https://rise.tools/docs/guides/server-compatibility). Avoid crashes, even with bad data!
- Rise Playground - [Mobile app for you to quickly prototype custom experiences](https://rise.tools/docs/playground/)
- Extensible Events and Actions - [Interact with the server and handle custom client-side actions](https://rise.tools/docs/guides/actions-events)


This repo contains the following packages:

- `packages/react` - Rise Tools core library
- `packages/tamagui` - Component library based on Tamagui for use with Rise Tools
- `packages/kit` - Our additional components supported in the Playground App
- `packages/http-client` - HTTP client to use with any compatible server
- `packages/ws-client` - Websocket client to use with any compatible server
- `packages/server` - JS/TS Server Implementation