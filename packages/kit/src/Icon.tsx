import * as LucideIcons from '@tamagui/lucide-icons'
import React from 'react'
import { SizableText } from 'tamagui'

export type IconProps = {
  icon: keyof typeof LucideIcons
  size?: number
}

export function Icon({ icon, size = 20 }: IconProps) {
  const IconComponent = LucideIcons[icon]
  if (IconComponent) {
    return <IconComponent size={size} />
  }
  return <SizableText>Icon not found</SizableText>
}
