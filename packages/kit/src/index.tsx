import { ReactElement } from 'react'
import z from 'zod'

function createServerComponent<T = any>(type: string, validator: (props: T) => T) {
  return (props: T): ReactElement => ({
    type,
    props: validator(props),
    key: null,
  })
}

export type IconProps = z.infer<typeof IconSchema>
export const IconSchema = z.object({
  icon: z.string(),
  size: z.number().optional(),
})
export const Icon = createServerComponent('RiseIcon', IconSchema.parse)

export type QRCodeProps = z.infer<typeof QRCodeSchema>
export const QRCodeSchema = z.object({
  value: z.string().nullable().optional(),
})
export const QRCode = createServerComponent('RiseQRCode', QRCodeSchema.parse)

export type SelectFieldProps = z.infer<typeof SelectFieldSchema>
export const SelectFieldSchema = z.object({
  value: z.string().nullable(),
  id: z.string().optional(),
  label: z.string().optional(),
  unselectedLabel: z.string().optional().default('...'),
  onValueChange: z.function().optional(),
  options: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
      })
    )
    .optional(),
})
export const SelectField = createServerComponent('RiseSelectField', SelectFieldSchema.parse)

export type SliderProps = z.infer<typeof SliderSchema>
export const SliderSchema = z.object({
  value: z.number(),
  min: z.number().optional().default(0),
  max: z.number().optional().default(100),
  step: z.number().optional().default(1),
  onValueChange: z.function().optional(),
})
export const Slider = createServerComponent('RiseSlider', SliderSchema.parse)

export type SliderFieldProps = z.infer<typeof SliderFieldSchema>
export const SliderFieldSchema = SliderSchema.extend({
  defaultValue: z.number().optional(),
  onValueChange: z.function().optional(),
  label: z.string().optional(),
})
export const SliderField = createServerComponent('RiseSliderField', SliderFieldSchema.parse)

export type SortableListItemSchema = z.infer<typeof SortableListItemSchema>
export const SortableListItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  onPress: z.function().optional(),
})

export type SortableListProps = z.infer<typeof SortableListSchema>
export const SortableListSchema = z.object({
  footer: z.any(),
  items: z.array(SortableListItemSchema),
  // tbd: support this event again
  onReorder: z.function().optional(),
})
export const SortableList = createServerComponent('RiseSortableList', SortableListSchema.parse)

export type SwitchFieldProps = z.infer<typeof SwitchFieldSchema>
export const SwitchFieldSchema = z.object({
  value: z.boolean().nullable().optional(),
  label: z.string().optional(),
  onCheckedChange: z.function().optional(),
})
export const SwitchField = createServerComponent('RiseSwitchField', SwitchFieldSchema.parse)
