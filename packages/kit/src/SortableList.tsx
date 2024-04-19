import { EventDataStateProp, TemplateComponentProps } from '@final-ui/react'
import React from 'react'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Label, View } from 'tamagui'

function keyExtractor(item: SortableListItem) {
  return item.key
}

type SortableListItem = {
  key: string
  label: string
  onPress?: EventDataStateProp
}

export type SortableListProps = {
  footer: any
  items: SortableListItem[]
  // tbd: support this event again
  onReorder?: EventDataStateProp
}

export function SortableList(props: TemplateComponentProps<SortableListProps>) {
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
