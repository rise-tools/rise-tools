import { createComponentDefinition } from '@rise-tools/react'
import type { WebView as RNWebview } from 'react-native-webview'

export const WebView = createComponentDefinition<typeof RNWebview>('rise-tools/kit-webview/WebView')
