import { use, useEffect, useRef, useState } from 'react'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { View } from 'tamagui'
// import QRCode from 'react-native-qrcode-svg'
import { toCanvas } from 'qrcode'

function EGPreview({ url, size }: { url: string; size: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const writeFrame = useRef<(frame: Uint8Array) => void | null>(null)
  useEffect(() => {
    const ws = new ReconnectingWebSocket(url)

    ws.binaryType = 'arraybuffer'
    ws.onopen = function () {
      console.log('connected')
    }
    ws.onclose = function () {
      console.log('disconnected')
    }

    ws.onmessage = function (event) {
      var frame = new Uint8Array(event.data)
      writeFrame.current?.(frame)
    }

    return () => {
      ws.close()
    }
  }, [url])
  useEffect(() => {
    const egStageRadials = 64
    const egStageStripLength = 378 // ??
    const egStageInnerRadiusRatio = 0.2416 // calculated with virtual stats from EG laptop: 375 strip length, 989 total diameter

    const egStageMap = []

    for (let angularIndex = 0; angularIndex < egStageRadials; angularIndex++) {
      const angle = (angularIndex / egStageRadials) * Math.PI * 2
      const maxY = Math.sin(angle)
      const maxX = Math.cos(angle)
      for (let radialIndex = 0; radialIndex < egStageStripLength; radialIndex++) {
        const radialRatio = radialIndex / egStageStripLength
        const offsetRadialRatio =
          egStageInnerRadiusRatio + (1 - egStageInnerRadiusRatio) * radialRatio
        const relativeX = maxX * offsetRadialRatio
        const relativeY = maxY * offsetRadialRatio
        const absoluteX = 0.5 + relativeX / 2
        const absoluteY = 0.5 + relativeY / 2

        egStageMap.push({
          x: absoluteX,
          y: absoluteY,
        })
      }
    }

    const egCanvasMap = egStageMap.map((point) => {
      return {
        x: Math.floor(point.x * size),
        y: Math.floor(point.y * size),
      }
    })
    const ctx = canvas?.current?.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, size, size)
    writeFrame.current = (frame: Uint8Array) => {
      egCanvasMap.forEach((point, pointIndex) => {
        const startIndex = pointIndex * 3
        ctx.fillStyle = `rgb(${frame[startIndex]}, ${frame[startIndex + 1]}, ${
          frame[startIndex + 2]
        })`
        ctx.fillRect(point.x, point.y, 1, 1)
      })
    }
  }, [size])
  return <canvas ref={canvas} width={size} height={size} />
}

function AutoSizeEGPreview({ url }: { url: string }) {
  const [size, setSize] = useState(1024)
  return (
    <View f={1} bg="green" onLayout={(e) => setSize(e.nativeEvent.layout.width)}>
      <EGPreview url={'ws://localhost:3998'} size={size} />
    </View>
  )
}

function QRCode({ value }: { value: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    toCanvas(
      canvas.current,
      value,
      { color: { light: '#000000', dark: '#eeeeee' }, margin: 2, scale: 2 },
      (error) => {
        if (error) console.error(error)
        console.log('success!')
      }
    )
  }, [value])
  return <canvas ref={canvas} width={164} height={164} />
}
export default function PreviewPage() {
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
      <View f={1} aspectRatio={1} maxHeight="100vw" maxWidth="100vh" padding="$4">
        <AutoSizeEGPreview url={'ws://localhost:3998'} />
      </View>
      <View position="absolute" bottom={0} right={0} borderRadius="$4" overflow="hidden">
        <QRCode value="https://github.com/ericvicenti/react-native-templates" />
      </View>
    </View>
  )
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    // If not in fullscreen, request it on the 'content' div
    var elem = document.getElementById('__next')
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
