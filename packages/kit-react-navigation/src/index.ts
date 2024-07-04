import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import z from 'zod'

import { ReactNavigationActions } from './server'

const NavigateActionPayload = z.object({
  path: z.string(),
})

export const useReactNavigationActions = ({
  routeName,
}: {
  routeName: string
}): ReactNavigationActions => {
  const navigation = useNavigation()

  return {
    'rise-tools/kit-react-navigation/navigate': {
      action: ({ path }) => {
        // @ts-expect-error - we don't know the navigation stack ahead of time
        navigation.navigate(routeName, { path })
      },
      validate: (payload) => NavigateActionPayload.parse(payload),
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
