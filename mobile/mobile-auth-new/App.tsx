import { ExpoRoot } from 'expo-router';
import { registerRootComponent } from 'expo';
import { ErrorBoundary } from 'react-error-boundary';
import React from 'react';

declare const require: {
  context: (path: string, deep?: boolean, filter?: RegExp) => any;
};

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Something went wrong:</h1>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

// Must be exported or Fast Refresh won't update the context
export default function App() {
  const ctx = require.context('./app', true, /\.(js|jsx|ts|tsx)$/);
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ExpoRoot context={ctx} />
    </ErrorBoundary>
  );
}

App.displayName = 'App';

registerRootComponent(App);
