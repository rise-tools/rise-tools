import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import { LogBox } from 'react-native'

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

LogBox.ignoreLogs([
  // Safe workaround for a pending fix: https://github.com/tamagui/tamagui/issues/1828
  /bad setState[\s\S]*Theme/,
]) 

registerRootComponent(App);
