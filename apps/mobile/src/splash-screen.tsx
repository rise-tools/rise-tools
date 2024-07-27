import * as Splash from 'expo-splash-screen'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

Splash.preventAutoHideAsync()

const AnimatedImage = Animated.createAnimatedComponent(Image)

export function SplashScreen({ children, loaded }: { children: React.ReactNode; loaded: boolean }) {
  const [isAppReady, setIsAppReady] = useState(false)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.5)
  const rotation = useSharedValue(0)

  useEffect(() => {
    startAnimation()
  }, [])

  const startAnimation = async () => {
    await Splash.hideAsync()
    opacity.value = withTiming(1, { duration: 2000 })
    rotation.value = withTiming(360, { duration: 2000 })
    scale.value = withTiming(1, { duration: 2000 }, () => {
      runOnJS(onAnimationComplete)()
    })
  }

  const onAnimationComplete = async () => {
    setTimeout(() => setIsAppReady(true), 1000)
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { rotate: rotation.value + 'deg' }],
    }
  })

  if (!isAppReady || !loaded) {
    return (
      <View style={styles.container}>
        <AnimatedImage
          source={require('../assets/RiseMainIcon.png')}
          style={[styles.logo, animatedStyles]}
          resizeMode="contain"
        />
      </View>
    )
  }

  return <>{children}</>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#260162',
  },
  logo: {
    width: 250,
    height: 250,
  },
})
