import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { initializeApp, preloadContent } from './services/appInitService';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Main app content that has access to theme context
const AppContent = () => {
  const { themeColors, theme } = useTheme();

  // Create styles with current theme colors
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
  });

  // Apply proper status bar style based on theme
  // Use light-content for dark mode and dark-content for light mode
  // This ensures the status bar (battery, clock) is visible in both themes
  const statusBarStyle = theme === 'dark' ? 'light' : 'dark';

  return (
    <View style={styles.container}>
      <StatusBar style={statusBarStyle} backgroundColor="transparent" translucent={true} />
      <AppNavigator />
    </View>
  );
};

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
      <View style={[baseStyles.container, baseStyles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF9843" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

// Base styles for the loading state (before theme is initialized)
const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});