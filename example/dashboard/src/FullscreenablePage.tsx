import { PropsWithChildren } from 'react'
import { View } from 'tamagui'

export function FullscreenablePage({
  children,
  corner,
}: PropsWithChildren<{ corner?: React.ReactNode }>) {
  return (
    <View
      fd="row"
      jc="center"
      bg="black"
      ai="center"
      f={1}
      height="100%"
      onPress={() => {
        toggleFullScreen()
      }}
    >
      {children}
      {corner && (
        <View position="absolute" bottom={0} right={0} borderRadius="$4" overflow="hidden">
          {corner}
        </View>
      )}
    </View>
  )
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    // If not in fullscreen, request it on the 'content' div
    const elem = document.getElementById('__next')!
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    } else if (
      // @ts-expect-error
      elem.mozRequestFullScreen
    ) {
      /* Firefox */
      // @ts-expect-error
      elem.mozRequestFullScreen()
    } else if (
      // @ts-expect-error
      elem.webkitRequestFullscreen
    ) {
      /* Chrome, Safari & Opera */
      // @ts-expect-error
      elem.webkitRequestFullscreen()
    } else if (
      // @ts-expect-error
      elem.msRequestFullscreen
    ) {
      /* IE/Edge */
      // @ts-expect-error
      elem.msRequestFullscreen()
    }
  } else {
    // If in fullscreen, exit it
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (
      // @ts-expect-error
      document.mozCancelFullScreen
    ) {
      /* Firefox */
      // @ts-expect-error
      document.mozCancelFullScreen()
    } else if (
      // @ts-expect-error
      document.webkitExitFullscreen
    ) {
      /* Chrome, Safari and Opera */
      // @ts-expect-error
      document.webkitExitFullscreen()
    } else if (
      // @ts-expect-error
      document.msExitFullscreen
    ) {
      /* IE/Edge */
      // @ts-expect-error
      document.msExitFullscreen()
    }
  }
}
