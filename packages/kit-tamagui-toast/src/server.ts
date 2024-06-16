import { action } from '@rise-tools/react'

export const toast = (title: string, message?: string) => action('toast', { title, message })
