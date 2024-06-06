import * as LucideIcons from '@tamagui/lucide-icons'
import { SizableText } from 'tamagui'
import { z } from 'zod'

const IconProps = z.object({
  icon: z.string(),
  size: z.number().optional(),
})

export function LucideIcon({
  icon,
  size = 20,
  ...rest
}: z.infer<typeof IconProps> & { icon: keyof typeof LucideIcons }) {
  const IconComponent = LucideIcons[icon]
  if (IconComponent) {
    return <IconComponent size={size} {...rest} />
  }
  return <SizableText>Icon not found</SizableText>
}

LucideIcon.validate = (props: any) => {
  return IconProps.parse(props)
}
