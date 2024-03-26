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
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen()
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen()
    }
  } else {
    // If in fullscreen, exit it
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen()
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen()
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen()
    }
  }
}
