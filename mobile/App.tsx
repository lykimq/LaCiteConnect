import React, { useEffect, useState } from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
    statusBarBackground: {
      height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      backgroundColor: themeColors.background,
    },
  });

  // Apply proper status bar style based on theme
  const statusBarStyle = theme === 'dark' ? 'light' : 'dark';

  return (
    <View style={styles.container}>
      <ExpoStatusBar style={statusBarStyle} translucent />
      <View style={styles.statusBarBackground} />
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
        await preloadContent();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize app:', error);
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

  // Return the app content wrapped in the theme provider and language provider
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
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