# kit-expo-video

Render video content, powered by the excellent [expo-video](https://docs.expo.dev/versions/latest/sdk/video/). Learn more about the Video features on the [Expo documentation](https://docs.expo.dev/versions/latest/sdk/video/).

## Client Installation

```sh
npm install @rise-tools/kit-expo-video expo-video
```

You must set up `expo-video` in your project. If you're using Expo, run:

```sh
npx expo install react-native-webview
```

In the `<Rise>` client, include the components:

```tsx
import { ExpoVideoComponents } from '@rise-tools/kit-expo-video'

// when rendering <Rise>

<Rise
    components={{
        ...ExpoVideoComponents
    }}
    ...
/>
```

## Server Helper

`import { Video } from '@rise-tools/kit-expo-video/server`

Then you can render a Video Player as such from your server:

```tsx
const MyVideoExample = () => (
  <Video
    source="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    autoplay
    loop
    style={{ width: '100%', aspectRatio: 16 / 9 }}
  />
)
```

Our `Video` component takes care of setting up the `VideoPlayer` instance and `VideoView` component from `expo-video` for you. Both can be customised with the props you pass to our `Video` component.

## Component Props

The `Video` component takes combination of props from [`VideoPlayer`](https://docs.expo.dev/versions/latest/sdk/video/#videoplayer) class and [`VideoView`](https://docs.expo.dev/versions/latest/sdk/video/#videoview) component. 

```tsx
type Props = VideoPlayerProps & VideoViewProps & ViewProps & {
  /* Set this to `true` to start playing the video as soon as it is loaded */
  autoplay?: boolean;
}
```

General rule is that `VideoPlayer` props relate to the video playback, while `VideoView` props relate to the video display.

Here is the breakdown of available props:

```tsx
type VideoPlayerProps = {
  currentTime?: number;
  loop?: boolean;
  muted?: boolean;
  playbackRate?: number;
  preservesPitch?: boolean;
  showNowPlayingNotification?: boolean;
  staysActiveInBackground?: boolean;
  volume?: number;
  source: VideoSource;
}

type VideoViewProps = ViewProps & {
  player: VideoPlayer;
  nativeControls?: boolean;
  contentFit?: VideoContentFit;
  allowsFullscreen?: boolean;
  showsTimecodes?: boolean;
  requiresLinearPlayback?: boolean;
  contentPosition?: { dx?: number; dy?: number };
  onPictureInPictureStart?: () => void;
  onPictureInPictureStop?: () => void;
  allowsPictureInPicture?: boolean;
  startsPictureInPictureAutomatically?: boolean;
  allowsVideoFrameAnalysis?: boolean;
}
```

Refer to the [Expo documentation](https://docs.expo.dev/versions/latest/sdk/video/) for more information on these props.

## JSON Component

Your custom server may define the Video component by using the [component definition](/docs/server-spec/json-types#component-model-state):

```js
{
  $: 'component',
  component: 'rise-tools/kit-expo-video/Video',
  props: {
    source: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  }
}
```
