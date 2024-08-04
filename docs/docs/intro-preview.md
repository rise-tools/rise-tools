# Introducing Rise Tools (Preview)

Rise is built by independent developers and entrepreneurs who have been building web and mobile apps for many years. Over our careers, software development has become incredibly complicated, and we are dreaming of simplifying the landscape of tools required to build great software for the world. Our mission is to help small teams build useful apps faster than they ever could before.

## Server Defined Rendering

The approach of defining the UI server-side, using high-level components on the client. The server code handles all of the application concerns, while the client is considered infrastructure that can usually be shared between different applications.

This allows a rapid pace of development and deployment that is usually not available, especially for mobile app development.

SDR is frequently used by big enterprises, we want to open it up for small teams and indie devs. With Rise Tools, Server Defined UI is accessible to everyone, at any scale.

## Introducing the Tools

We aim to provide a complete full-stack development environment. At the heart is the `<Rise />` React component, which acts as the rendering engine for Server-Defined UI.

We include a modular client which connects to your server over the Rise HTTP or WebSocket protocol. HTTP is appropriate for larger deployments in cases where the UI doesn’t change very often. WebSockets enable highly-interactive apps and powers a rapid development and deployment workflow.

Our server framework allows you to rapidly build new UI and APIs. You can build custom experiences for different users, connect to external Databases and APIs, and have server-side state.

The Rise Kit is our built-in suite of components and actions that can be used by your server to extend the capabilities of your app, or build a completely new app.

With the Rise Playground, you can immediately preview new experiences on your phone, directly from your development environment. It includes the whole Rise Kit, as well as dynamic navigation which allows you to have several screens that are defined on your server.

## Development Principles

Rise Tools is open source and infinitely customizable. You can incrementally adopt, at any level of abstraction.

On the client, Rise is easy to adopt as a library. This means you can add it to your existing React / React Native app without rearchitecting your app. When you need, you can easily extend your toolkit with custom components and actions.

Rise can work with any server. We are starting with support for Node.js servers. Using our server framework you can quickly start rendering on the server, build new APIs, and integrate into your existing server code.

Or you can follow the API specification and use another server environment according to your preference, requirements, or existing infrastructure.

## Looking to the Future

The community is jumping into action to build more. Just a few weeks after launch, we have seen the development of new frontend environments, component libraries, and server tooling. We are inspired by the response of the community to jump in and participate in the movement.

The core team has ambitious dreams for the future. We hope to support other server languages to make full-stack development more inclusive. Production-ready apps can be created with one click. We can reduce friction with CMS and deployment services. We imagine radical new development workflows such as a visual builder so designers can participate refinement of real-world UI. Even further forward, LLMs could enable an explosive improvement in software development, and generative UI could allow users can extend their app as they use it.

We have a long road ahead, but with the support of our new community, we have a chance to radically accelerate the development of beautiful and performant apps.