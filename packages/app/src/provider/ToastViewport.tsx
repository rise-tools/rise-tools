import { ToastViewport as ToastViewportOg } from '@react-native-templates/demo-ui'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const ToastViewport = () => {
  const { top, right, left } = useSafeAreaInsets()
  return <ToastViewportOg top={top + 5} left={left} right={right} />
}
