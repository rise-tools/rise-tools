import { useEffect, useState } from 'react'
import DraggableFlatList, {
  DraggableFlatListProps,
  ScaleDecorator,
} from 'react-native-draggable-flatlist'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

type Item = { key: string; label: React.ReactElement; onPress?: () => void }

export function RNDraggableFlatList(
  props: Omit<
    DraggableFlatListProps<Item>,
    'ListHeaderComponent' | 'ListFooterComponent' | 'keyExtractor' | 'renderItem' | 'onDragEnd'
  > & {
    header?: React.ReactElement
    footer?: React.ReactElement
    onItemPress?: (key: Item['key']) => void
    onReorder?: (data: Item['key'][]) => void
  }
) {
  const [data, setData] = useState(props.data)
  useEffect(() => {
    setData(props.data)
  }, [props.data])
  return (
    <DraggableFlatList
      {...props}
      data={data}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={props.header ? () => props.header : undefined}
      ListFooterComponent={props.footer ? () => props.footer : undefined}
      onDragEnd={(e) => {
        setData(e.data)
        props.onReorder?.(e.data.map((item) => item.key))
      }}
      renderItem={({ item, drag, isActive }) => {
        const Item = () => item.label
        return (
          <ScaleDecorator>
            <TouchableWithoutFeedback
              onLongPress={drag}
              disabled={isActive}
              onPress={() => {
                item.onPress?.()
                props.onItemPress?.(item.key)
              }}
            >
              <Item />
            </TouchableWithoutFeedback>
          </ScaleDecorator>
        )
      }}
    />
  )
}
