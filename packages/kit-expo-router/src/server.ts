import { action } from '@rise-tools/react'

export const navigate = (path: string) => action('navigate', { path })
export const goBack = () => action('goBack')
