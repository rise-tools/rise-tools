import { useNavigation } from '@react-navigation/native'
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
        // @ts-ignore
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
