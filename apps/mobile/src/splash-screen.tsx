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
  const [isInitialAnimationDone, setIsInitialAnimationDone] = useState(false)
  const opacity = useSharedValue(0)
  const bgOpacity = useSharedValue(1)
  const scale = useSharedValue(0.5)
  const rotation = useSharedValue(270)

  useEffect(() => {
    startInitialAnimation()
  }, [])

  useEffect(() => {
    if (isInitialAnimationDone && loaded) {
      startFinalAnimation()
    }
  }, [isInitialAnimationDone, loaded])

  const startInitialAnimation = async () => {
    await Splash.hideAsync()
    opacity.value = withTiming(1, { duration: 1000 })
    rotation.value = withTiming(360, { duration: 1000 })
    scale.value = withTiming(1, { duration: 1000 }, () => {
      runOnJS(setIsInitialAnimationDone)(true)
    })
  }

  const startFinalAnimation = () => {
    bgOpacity.value = withTiming(0, { duration: 1000 }, () => {
      runOnJS(setIsAppReady)(true)
    })
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
    <View style={styles.wrapper}>
      {children}
      {!isAppReady && (
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
  wrapper: {
    flex: 1,
  },
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
