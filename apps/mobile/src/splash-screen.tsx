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
const AnimatedView = Animated.createAnimatedComponent(View)

export function SplashScreen({ children, loaded }: { children: React.ReactNode; loaded: boolean }) {
  const [isAppReady, setIsAppReady] = useState(false)
  const opacity = useSharedValue(0)
  const bgOpacity = useSharedValue(1)
  const scale = useSharedValue(0.5)
  const rotation = useSharedValue(315)

  useEffect(() => {
    startAnimation()
  }, [])

  const startAnimation = async () => {
    await Splash.hideAsync()
    opacity.value = withTiming(1, { duration: 500 })
    rotation.value = withTiming(360, { duration: 500 })
    scale.value = withTiming(1, { duration: 500 }, () => {
      bgOpacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onAnimationComplete)()
      })
    })
  }

  const onAnimationComplete = async () => {
    setTimeout(() => setIsAppReady(true), 500)
  }

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { rotate: rotation.value + 'deg' }],
    }
  })
  const animatedBgStyles = useAnimatedStyle(() => {
    return {
      opacity: bgOpacity.value,
    }
  })

  return (
    <View style={{ flex: 1 }}>
      {children}
      {(!isAppReady || !loaded) && (
        <AnimatedView style={[styles.container, animatedBgStyles]}>
          <AnimatedImage
            source={require('../assets/RiseMainIcon.png')}
            style={[styles.logo, animatedStyles]}
            resizeMode="contain"
          />
        </AnimatedView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#260162',
  },
  logo: {
    width: 250,
    height: 250,
  },
})
