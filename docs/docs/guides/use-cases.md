# Rise Use Cases

Let's discuss some interesting and popular use-cases for Server Defined Rendering!

## Electron Applications

Electron desktop apps have a front-end (Chromium) instance for each window, and a nodejs backend that is shared across the application. Most Electron apps put the majority of the logic in the front-end window instances. This is problematic for apps who want to support multi-windows, because each window must have duplicate data and manually synchronize state between them. This could be fixed by using Server-Defined Rendering on the nodejs backplane, keeping the windows very light and stateless.

## A/B Testing

You may wish to run tests after you ship your app, where users will receive a slightly different experience depending on their test group. By using a `<Rise />` component, you can adjust each user's experience on the server.

## Feature Flags

Your server can be used to enable or disable some features on the client. For example a new component can be added to a component library, and the server may render it or not depending on the server-side flags that are enabled by your organiztion.

## Media Streaming Home

A common case where Server Defined Rendering is used in practice are media apps. Several components for the home page are defined on the client, such as a carousel of different videos to watch. The server decides which components to use, and provides props for each of them.

## Notifications

You may want to send push notifications to your users that open a custom server-defined screen. For example if you have a media application and you want to send a "year in review" notification at the end of the year, where the resulting screen is custom defined on the server for each user.

## Live Control

With the Websocket support, you may find Rise useful for a realtime application where several clients are managing shared state on your server.

This is actually the first use case for Rise. It was initially developed alongside an application to control a large scale art installation with 25000 LEDs.
