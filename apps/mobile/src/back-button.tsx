import { useNavigation } from '@react-navigation/native'
import { Button, Image } from 'tamagui'

export function BackButton() {
  const navigation = useNavigation()

  return (
    <Button unstyled onPress={() => navigation.goBack()}>
      <Image src={require('../assets/RiseMainIcon.png')} aspectRatio={1} height={25} />
    </Button>
  )
}
