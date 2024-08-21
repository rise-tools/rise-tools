import React from 'react'
import { FlatList, FlatListProps, SectionList, SectionListProps } from 'react-native'

type Item = { key: string; label: React.ReactElement }

export function RNFlatList(props: Omit<FlatListProps<Item>, 'keyExtractor' | 'renderItem'>) {
  return (
    <FlatList {...props} keyExtractor={(item) => item.key} renderItem={({ item }) => item.label} />
  )
}

export function RNSectionList(props: Omit<SectionListProps<Item>, 'keyExtractor' | 'renderItem'>) {
  return (
    <SectionList
      {...props}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => item.label}
    />
  )
}
