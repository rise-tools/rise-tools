import { useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
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
        navigation.navigate(path)
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

export const useReactNavigationStackComponents = ({
  render,
}: {
  render: (name: string) => React.ReactNode
}) => {
  const Stack = createNativeStackNavigator()
  return {
    'rise-tools/kit-react-navigation/NativeStackScreen': {
      component: ({ name, ...props }: any) => (
        <Stack.Screen {...props} name={name}>
          {() => render(name)}
        </Stack.Screen>
      ),
    },
    'rise-tools/kit-react-navigation/NativeStackNavigator': {
      component: ({ screens, ...props }: any) => {
        return (
          <Stack.Navigator {...props}>
            {screens.map((screen) => (
              <Stack.Screen key={screen.name} name={screen.name} options={screen.options}>
                {() => render(screen.name)}
              </Stack.Screen>
            ))}
          </Stack.Navigator>
        )
      },
    },
  }
}
