import Constants, { ExecutionEnvironment } from 'expo-constants'
import React from 'react'

import { NativeToast as Toast } from './NativeToast'

const isExpo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient

export const CustomToast = () => {
  if (isExpo) {
    return null
  } else {
    return <Toast />
  }
}
