import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const THEME_STORAGE_KEY = 'APP_THEME';
const COLOR_THEME_STORAGE_KEY = 'APP_COLOR_THEME';
const THEME_CATEGORY_STORAGE_KEY = 'APP_THEME_CATEGORY';

// Theme categories
export const categorizedThemes = {
    default: {
        default: {
            id: 'default',
            name: 'Default',
            primary: '#FF9843',
            secondary: '#4CAF50',
        },
    },
    seasonal: {
        spring: {
            id: 'spring',
            name: 'Spring',
            primary: '#B5E48C',
            secondary: '#FFCBCB',
        },
        summer: {
            id: 'summer',
            name: 'Summer',
            primary: '#FFB703',
            secondary: '#00B4D8',
        },
        autumn: {
            id: 'autumn',
            name: 'Autumn',
            primary: '#D2691E',
            secondary: '#FF7F50',
        },
        winter: {
            id: 'winter',
            name: 'Winter',
            primary: '#4A90E2',
            secondary: '#E0F7FA',
        },
    },
    pastel: {
        lavender: {
            id: 'lavender',
            name: 'Lavender',
            primary: '#9B5DE5',
            secondary: '#F15BB5',
        },
        sand: {
            id: 'sand',
            name: 'Sand',
            primary: '#E1C699',
            secondary: '#DDB892',
        },
        mint: {
            id: 'mint',
            name: 'Mint',
            primary: '#52B788',
            secondary: '#B7E4C7',
        },
    },
    neon: {
        neon: {
            id: 'neon',
            name: 'Neon',
            primary: '#39FF14',
            secondary: '#FF3131',
        },
        cyberpunk: {
            id: 'cyberpunk',
            name: 'Cyberpunk',
            primary: '#FF00FF',
            secondary: '#00FFFF',
        },
    },
    monochrome: {
        slate: {
            id: 'slate',
            name: 'Slate',
            primary: '#6C757D',
            secondary: '#ADB5BD',
        },
        monochrome: {
            id: 'monochrome',
            name: 'Monochrome',
            primary: '#333333',
            secondary: '#BDBDBD',
        },
    },
    nature: {
        forest: {
            id: 'forest',
            name: 'Forest',
            primary: '#2D6A4F',
            secondary: '#40916C',
        },
        ocean: {
            id: 'ocean',
            name: 'Ocean',
            primary: '#0077B6',
            secondary: '#48CAE4',
        },
        sunset: {
            id: 'sunset',
            name: 'Sunset',
            primary: '#E76F51',
            secondary: '#F4A261',
        },
    },
    accessibility: {
        protanopia: {
            id: 'protanopia',
            name: 'Protanopia-Friendly',
            primary: '#3366CC',
            secondary: '#FFCC00',
        },
        deuteranopia: {
            id: 'deuteranopia',
            name: 'Deuteranopia-Friendly',
            primary: '#990099',
            secondary: '#FF9933',
        },
        tritanopia: {
            id: 'tritanopia',
            name: 'Tritanopia-Friendly',
            primary: '#0000CC',
            secondary: '#FFFF66',
        },
    },
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
} as const;

// Theme types
export type ThemeType = keyof typeof themes;
export type ThemeCategoryType = keyof typeof categorizedThemes;

// Helper type to get all theme IDs from a category
type CategoryThemes = {
    [C in ThemeCategoryType]: typeof categorizedThemes[C]
};

// Theme interface
export interface ThemeData {
    id: string;
    name: string;
    primary: string;
    secondary: string;
}

// Get all possible theme IDs
export type ColorThemeType = {
    [C in ThemeCategoryType]: keyof CategoryThemes[C]
}[ThemeCategoryType];

// Flatten theme colors for easier access
export const themeColors = Object.entries(categorizedThemes).reduce<Record<string, ThemeData>>((acc, [_, categoryThemes]) => {
    return { ...acc, ...categoryThemes };
}, {});

// Default themes
export const defaultTheme: ThemeType = 'light';
export const defaultColorTheme: ColorThemeType = 'default';
export const defaultCategory: ThemeCategoryType = 'default';

/**
 * Get the current theme from storage
 */
export const getTheme = async (): Promise<ThemeType> => {
    try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeType | null;
        if (storedTheme && themes[storedTheme]) {
            return storedTheme;
        }
        return defaultTheme;
    } catch (error) {
        console.error('Error getting theme setting:', error);
        return defaultTheme;
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
 * Get the current theme category from storage
 */
export const getThemeCategory = async (): Promise<ThemeCategoryType> => {
    try {
        const storedCategory = await AsyncStorage.getItem(THEME_CATEGORY_STORAGE_KEY) as ThemeCategoryType | null;
        if (storedCategory && categorizedThemes[storedCategory]) {
            return storedCategory;
        }
        return defaultCategory;
    } catch (error) {
        console.error('Error getting theme category setting:', error);
        return defaultCategory;
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
 * Set the application theme category
 */
export const setThemeCategory = async (category: ThemeCategoryType): Promise<void> => {
    try {
        if (!categorizedThemes[category]) {
            console.error(`Invalid theme category: ${category}`);
            return;
        }
        await AsyncStorage.setItem(THEME_CATEGORY_STORAGE_KEY, category);
        console.log(`Theme category set to: ${category}`);
    } catch (error) {
        console.error('Error setting theme category:', error);
    }
};

/**
 * Initialize theme settings
 */
export const initializeTheme = async (): Promise<{ theme: ThemeType; colorTheme: ColorThemeType; category: ThemeCategoryType }> => {
    const [theme, colorTheme, category] = await Promise.all([
        getTheme(),
        getColorTheme(),
        getThemeCategory(),
    ]);

    return { theme, colorTheme, category };
};