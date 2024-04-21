import * as LucideIcons from '@tamagui/lucide-icons'
import React from 'react'
import { SizableText } from 'tamagui'

import { IconProps } from '.'

export function Icon({ icon, size = 20, ...rest }: IconProps & { icon: keyof typeof LucideIcons }) {
  const IconComponent = LucideIcons[icon]
  if (IconComponent) {
    return <IconComponent size={size} {...rest} />
  }
  return <SizableText>Icon not found</SizableText>
}
