import { ExpoRoot } from 'expo-router';
import { registerRootComponent } from 'expo';

declare const require: {
  context: (path: string, deep?: boolean, filter?: RegExp) => any;
};

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context('./app', true, /\.(js|jsx|ts|tsx)$/);
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
