import { EventDataStateSchema, TemplateComponentProps } from '@final-ui/react'
import React from 'react'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Label, View } from 'tamagui'
import { z } from 'zod'

function keyExtractor(item: z.infer<typeof SortableListItemSchema>) {
  return item.key
}

const SortableListItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  onPress: EventDataStateSchema.optional(),
})

const SortableListProps = z.object({
  footer: z.any(),
  header: z.any(),
  items: z.array(SortableListItemSchema),
  // tbd: support this event again
  onReorder: EventDataStateSchema.optional(),
})

export function SortableList(props: TemplateComponentProps<z.infer<typeof SortableListProps>>) {
  return (
    <View flex={1}>
      <DraggableFlatList
        containerStyle={{ flex: 1 }}
        data={props.items}
        keyExtractor={keyExtractor}
        ListHeaderComponent={() => props.header}
        ListFooterComponent={() => props.footer}
        renderItem={(row) => {
          const { item, drag, isActive } = row
          return (
            <ScaleDecorator>
              <TouchableOpacity
                // @ts-ignore tbd: update `TemplateComponentProps` to avoid type error
                onPress={() => item.onPress?.()}
                onLongPress={drag}
                disabled={isActive}
                style={[{ padding: 10, backgroundColor: 'white', margin: 10 }]}
              >
                <Label>{item.label}</Label>
              </TouchableOpacity>
            </ScaleDecorator>
          )
        }}
      />
    </View>
  )
}

SortableList.validate = (props: any) => {
  return SortableListProps.parse(props)
}
