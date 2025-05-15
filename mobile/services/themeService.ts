import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for theme setting
const THEME_STORAGE_KEY = 'APP_THEME';
const COLOR_THEME_STORAGE_KEY = 'APP_COLOR_THEME';

// Theme categories
export const themeCategories = {
    basic: {
        id: 'basic',
        name: 'Basic',
        themes: ['light', 'dark']
    },
    nature: {
        id: 'nature',
        name: 'Nature',
        themes: ['forest', 'ocean']
    },
    warm: {
        id: 'warm',
        name: 'Warm',
        themes: ['sunset']
    }
} as const;

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
    }
};

// Theme colors (separate from light/dark mode)
export const themeColors = {
    default: {
        id: 'default',
        name: 'Default',
        primary: '#FF9843',
        secondary: '#4CAF50',
    },
    ocean: {
        id: 'ocean',
        name: 'Ocean',
        primary: '#0077B6',
        secondary: '#48CAE4',
    },
    forest: {
        id: 'forest',
        name: 'Forest',
        primary: '#2D6A4F',
        secondary: '#40916C',
    },
    sunset: {
        id: 'sunset',
        name: 'Sunset',
        primary: '#E76F51',
        secondary: '#F4A261',
    }
} as const;

// Theme type
export type ThemeType = keyof typeof themes;
export type ColorThemeType = keyof typeof themeColors;

// Default themes
export const defaultTheme: ThemeType = 'light';
export const defaultColorTheme: ColorThemeType = 'default';

/**
 * Get the current theme from storage
 */
export const getTheme = async (): Promise<ThemeType> => {
    try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeType | null;
        if (storedTheme && themes[storedTheme]) {
            return storedTheme;
        }
        return 'light';
    } catch (error) {
        console.error('Error getting theme setting:', error);
        return 'light';
    }
};

/**
 * Get the current color theme from storage
 */
export const getColorTheme = async (): Promise<ColorThemeType> => {
    try {
        const storedTheme = await AsyncStorage.getItem(COLOR_THEME_STORAGE_KEY) as ColorThemeType | null;
        if (storedTheme && themeColors[storedTheme]) {
            return storedTheme;
        }
        return defaultColorTheme;
    } catch (error) {
        console.error('Error getting color theme setting:', error);
        return defaultColorTheme;
    }
};

/**
 * Set the application theme
 */
export const setTheme = async (themeType: ThemeType): Promise<void> => {
    try {
        if (!themes[themeType]) {
            console.error(`Invalid theme type: ${themeType}`);
            return;
        }
        await AsyncStorage.setItem(THEME_STORAGE_KEY, themeType);
        console.log(`Theme set to: ${themeType}`);
    } catch (error) {
        console.error('Error setting theme:', error);
    }
};

/**
 * Set the application color theme
 */
export const setColorTheme = async (colorTheme: ColorThemeType): Promise<void> => {
    try {
        if (!themeColors[colorTheme]) {
            console.error(`Invalid color theme: ${colorTheme}`);
            return;
        }
        await AsyncStorage.setItem(COLOR_THEME_STORAGE_KEY, colorTheme);
        console.log(`Color theme set to: ${colorTheme}`);
    } catch (error) {
        console.error('Error setting color theme:', error);
    }
};

/**
 * Initialize theme settings
 */
export const initializeTheme = async (): Promise<{ theme: ThemeType; colorTheme: ColorThemeType }> => {
    const [currentTheme, currentColorTheme] = await Promise.all([
        getTheme(),
        getColorTheme()
    ]);
    return { theme: currentTheme, colorTheme: currentColorTheme };
};