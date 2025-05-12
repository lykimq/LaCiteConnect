import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { initializeApp, preloadContent } from './services/appInitService';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize app services
        await initializeApp();

        // Optionally preload content
        // This can be moved to a more appropriate place if needed
        await preloadContent();

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // Still set initialized to true to show the app even if there was an error
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  // Show a loading indicator while initializing
  if (!isInitialized) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF9843" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppNavigator />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});