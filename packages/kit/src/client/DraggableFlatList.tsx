import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Label } from 'tamagui'
import { z } from 'zod'

function keyExtractor(item: z.infer<typeof SortableListItemSchema>) {
  return item.key
}

const SortableListItemSchema = z.object({
  key: z.string(),
  label: z.string(),
  onPress: z.function().optional(),
})

const SortableListProps = z.object({
  footer: z.any(),
  header: z.any(),
  items: z.array(SortableListItemSchema),
  onReorder: z.function().optional(),
})

export function RNDraggableFlatList(props: z.infer<typeof SortableListProps>) {
  return (
    <DraggableFlatList
      data={props.items}
      keyExtractor={keyExtractor}
      onDragEnd={({ data }) => {
        props.onReorder?.(data)
      }}
      ListHeaderComponent={() => props.header}
      ListFooterComponent={() => props.footer}
      renderItem={(row) => {
        const { item, drag, isActive } = row
        return (
          <ScaleDecorator>
            <TouchableOpacity
              onPress={() => item.onPress?.()}
              onLongPress={drag}
              disabled={isActive}
              style={[
                {
                  padding: 10,
                  backgroundColor: 'white',
                  margin: 10,
                  borderRadius: 10,
                },
              ]}
            >
              <Label>{item.label}</Label>
            </TouchableOpacity>
          </ScaleDecorator>
        )
      }}
    />
  )
}
