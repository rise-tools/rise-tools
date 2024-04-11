import { ComponentProps } from '@react-native-templates/core'
import * as LucideIcons from '@tamagui/lucide-icons'
import React from 'react'
import { SizableText } from 'tamagui'
import { z } from 'zod'

const IconProps = z.object({
  icon: z.string(),
  size: z.number().optional(),
})

export function Icon({ icon, size = 20, ...rest }: z.infer<typeof IconProps> & ComponentProps) {
  // @ts-ignore - TypeScript will complain about this, but it's fine
  const IconComponent = LucideIcons[icon]
  if (IconComponent) {
    return <IconComponent size={size} {...rest} />
  }
  return <SizableText>Icon not found</SizableText>
}

Icon.validate = (props: any) => {
  return IconProps.parse(props)
}
