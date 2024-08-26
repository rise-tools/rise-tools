import { useEffect, useState } from 'react'
import DraggableFlatList, {
  DraggableFlatListProps,
  ScaleDecorator,
} from 'react-native-draggable-flatlist'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

type Item = { key: string; label: React.ReactElement; onPress?: () => void }

export function RNDraggableFlatList(
  props: Omit<DraggableFlatListProps<Item>, 'keyExtractor' | 'renderItem' | 'onDragEnd'> & {
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
  if (props.header) {
    console.warn('DraggableFlatList: header is deprecated, use ListHeaderComponent instead')
  }
  if (props.footer) {
    console.warn('DraggableFlatList: footer is deprecated, use ListHeaderComponent instead')
  }
  return (
    <DraggableFlatList
      {...props}
      ListHeaderComponent={props.header || props.ListHeaderComponent}
      ListFooterComponent={props.footer || props.ListFooterComponent}
      data={data}
      keyExtractor={(item) => item.key}
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
