import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for theme setting
const THEME_STORAGE_KEY = 'APP_THEME';

// Available themes
export const themes = {
    light: {
        id: 'light',
        name: 'Light',
        colors: {
            primary: '#FF9843',
            secondary: '#4CAF50',
            background: '#FFFFFF',
            card: '#F8F9FA',
            text: '#333333',
            border: '#E0E0E0',
            notification: '#FF9843',
            accent: '#FFE4C4',
            error: '#FF3B30',
        }
    },
    dark: {
        id: 'dark',
        name: 'Dark',
        colors: {
            primary: '#FF9843',
            secondary: '#4CAF50',
            background: '#121212',
            card: '#1E1E1E',
            text: '#E0E0E0',
            border: '#333333',
            notification: '#FF9843',
            accent: '#442D1A',
            error: '#FF453A',
        }
    },
};

// Theme type
export type ThemeType = keyof typeof themes;

// Default theme
export const defaultTheme: ThemeType = 'light';

/**
 * Get the current theme from storage
 * @returns The theme type (e.g., 'light', 'dark')
 */
export const getTheme = async (): Promise<ThemeType> => {
    try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeType | null;

        if (storedTheme && themes[storedTheme]) {
            return storedTheme;
        }

        // Return default theme if not found or invalid
        return defaultTheme;
    } catch (error) {
        console.error('Error getting theme setting:', error);
        return defaultTheme;
    }
};

/**
 * Set the application theme
 * @param themeType The theme type to set
 */
export const setTheme = async (themeType: ThemeType): Promise<void> => {
    try {
        // Validate theme type
        if (!themes[themeType]) {
            console.error(`Invalid theme type: ${themeType}`);
            return;
        }

        // Save theme type to storage
        await AsyncStorage.setItem(THEME_STORAGE_KEY, themeType);

        console.log(`Theme set to: ${themeType}`);
    } catch (error) {
        console.error('Error setting theme:', error);
    }
};

/**
 * Initialize theme settings
 */
export const initializeTheme = async (): Promise<ThemeType> => {
    const currentTheme = await getTheme();
    return currentTheme;
};