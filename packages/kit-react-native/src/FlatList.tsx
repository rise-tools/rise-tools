import React from 'react'
import { FlatList, FlatListProps } from 'react-native'

type Item = { key: string; label: React.ReactElement }

export function RNFlatList(
  props: Omit<
    FlatListProps<Item>,
    'ListHeaderComponent' | 'ListFooterComponent' | 'keyExtractor' | 'renderItem'
  > & {
    header?: React.ReactElement
    footer?: React.ReactElement
  }
) {
  return (
    <FlatList
      {...props}
      keyExtractor={(item) => item.key}
      ListHeaderComponent={props.header ? () => props.header : undefined}
      ListFooterComponent={props.footer ? () => props.footer : undefined}
      renderItem={({ item }) => item.label}
    />
  )
}
