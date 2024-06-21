import type { IconProps } from '@tamagui/helpers-icon'
import * as LucideIcons from '@tamagui/lucide-icons'
import { SizableText } from 'tamagui'

export function LucideIcon({
  icon,
  size = 20,
  ...rest
}: IconProps & { icon: keyof typeof LucideIcons }) {
  const IconComponent = LucideIcons[icon]
  if (IconComponent) {
    return <IconComponent size={size} {...rest} />
  }
  return <SizableText>Icon not found</SizableText>
}
