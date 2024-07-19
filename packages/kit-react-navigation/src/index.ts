import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useEffect } from 'react'

import { ReactNavigationActions } from './server'

export const useReactNavigationActions = ({
  routeName,
}: {
  routeName: string
}): ReactNavigationActions => {
  const navigation = useNavigation()

  return {
    'rise-tools/kit-react-navigation/navigate': {
      action: ({ path, options }) => {
        // @ts-expect-error - we don't know the navigation stack ahead of time
        navigation.navigate(routeName, { path, options })
      },
    },
    'rise-tools/kit-react-navigation/goBack': {
      action: () => {
        navigation.goBack()
      },
    },
  }
}

export const ReactNavigationComponents = {
  'rise-tools/kit-react-navigation/StackScreen': {
    component: Screen,
  },
}

export function Screen(options: NativeStackNavigationOptions) {
  const navigation = useNavigation()
  useEffect(() => {
    navigation.setOptions(options)
  }, [options])
  return null
}
