import { action } from '@rise-tools/react'

export const toast = (title: string, message?: string, duration?: number) =>
  action('toast', { title, message, duration })
