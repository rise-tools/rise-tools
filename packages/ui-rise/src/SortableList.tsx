import { ComponentProps } from '@react-native-templates/core'
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
  onPress: z.string().or(z.array(z.string())),
})

const SortableListProps = z.object({
  footer: z.any(),
  items: z.array(SortableListItemSchema),
  onReorder: z.string().or(z.array(z.string())),
})

export function SortableList(props: z.infer<typeof SortableListProps> & ComponentProps) {
  return (
    <View flex={1}>
      <DraggableFlatList
        containerStyle={{ flex: 1 }}
        data={props.items}
        keyExtractor={keyExtractor}
        ListFooterComponent={props.footer}
        onDragEnd={({ data }) => {
          const reordered = data.map((item) => item.key)
          const payload = [
            ...(Array.isArray(props.onReorder) ? props.onReorder : [props.onReorder]),
            reordered,
          ]
          props.onTemplateEvent('update', payload)
        }}
        renderItem={(row) => {
          const { item, drag, isActive } = row
          return (
            <ScaleDecorator>
              <TouchableOpacity
                onPress={() => {
                  if (item.onPress) props.onTemplateEvent('press', item.onPress)
                }}
                onLongPress={drag}
                disabled={isActive}
                style={[{ padding: 10, backgroundColor: 'white', margin: 10 }]}
              >
                <Label style={{}}>{item.label}</Label>
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
