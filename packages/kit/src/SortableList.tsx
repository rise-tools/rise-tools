import React from 'react'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Label, View } from 'tamagui'

import { SortableListItemSchema, SortableListProps } from '.'

function keyExtractor(item: SortableListItemSchema) {
  return item.key
}

export function SortableList(props: SortableListProps) {
  return (
    <View flex={1}>
      <DraggableFlatList
        containerStyle={{ flex: 1 }}
        data={props.items}
        keyExtractor={keyExtractor}
        ListFooterComponent={props.footer}
        renderItem={(row) => {
          const { item, drag, isActive } = row
          return (
            <ScaleDecorator>
              <TouchableOpacity
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
