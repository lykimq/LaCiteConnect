import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    getTheme,
    setTheme,
    getColorTheme,
    setColorTheme,
    getThemeCategory,
    setThemeCategory,
    themes,
    themeColors,
    categorizedThemes,
    ThemeType,
    ColorThemeType,
    ThemeCategoryType,
    defaultTheme,
    defaultColorTheme,
    defaultCategory,
    initializeTheme,
    ThemeData
} from '../services/themeService';

// Define custom theme colors type combining the base theme colors with additional primary/secondary
type CustomThemeColors = {
    [K in keyof typeof themes[ThemeType]['colors']]: string
} & {
    primary: string;
    secondary: string;
};

// Define the theme context type
interface ThemeContextType {
    theme: ThemeType;
    colorTheme: ColorThemeType;
    category: ThemeCategoryType;
    themeColors: CustomThemeColors;
    changeTheme: (newTheme: ThemeType) => Promise<void>;
    changeColorTheme: (newColorTheme: ColorThemeType) => Promise<void>;
    changeCategory: (newCategory: ThemeCategoryType) => Promise<void>;
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
    theme: defaultTheme,
    colorTheme: defaultColorTheme,
    category: defaultCategory,
    themeColors: {
        ...themes.light.colors,
        primary: categorizedThemes.default.default.primary,
        secondary: categorizedThemes.default.default.secondary,
    } as CustomThemeColors,
    changeTheme: async () => { },
    changeColorTheme: async () => { },
    changeCategory: async () => { },
});

// Props for ThemeProvider
interface ThemeProviderProps {
    children: ReactNode;
}

// Function to safely access theme data
const getThemeData = (category: ThemeCategoryType, colorTheme: ColorThemeType): ThemeData => {
    // Check if the category exists
    if (!(category in categorizedThemes)) {
        return categorizedThemes.default.default;
    }

    // Check if the theme exists in the category
    const categoryThemes = categorizedThemes[category];
    if (colorTheme in categoryThemes) {
        return categoryThemes[colorTheme as keyof typeof categoryThemes];
    }

    // Default fallback
    return categorizedThemes.default.default;
};

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [themeType, setThemeType] = useState<ThemeType>(defaultTheme);
    const [colorThemeType, setColorThemeType] = useState<ColorThemeType>(defaultColorTheme);
    const [categoryType, setCategoryType] = useState<ThemeCategoryType>(defaultCategory);
    const [initialized, setInitialized] = useState(false);

    // Initialize the theme
    useEffect(() => {
        const initTheme = async () => {
            try {
                const { theme, colorTheme, category } = await initializeTheme();
                setThemeType(theme || defaultTheme);
                setColorThemeType(colorTheme || defaultColorTheme);
                setCategoryType(category || defaultCategory);
            } catch (error) {
                console.error('Failed to initialize theme:', error);
                // Use defaults if initialization fails
                setThemeType(defaultTheme);
                setColorThemeType(defaultColorTheme);
                setCategoryType(defaultCategory);
            } finally {
                setInitialized(true);
            }
        };

        initTheme();
    }, []);

    // Function to change the theme
    const changeTheme = async (newTheme: ThemeType) => {
        try {
            await setTheme(newTheme);
            setThemeType(newTheme);
        } catch (error) {
            console.error('Failed to change theme:', error);
        }
    };

    // Function to change the color theme
    const changeColorTheme = async (newColorTheme: ColorThemeType) => {
        try {
            await setColorTheme(newColorTheme);
            setColorThemeType(newColorTheme);
        } catch (error) {
            console.error('Failed to change color theme:', error);
        }
    };

    // Function to change the theme category
    const changeCategory = async (newCategory: ThemeCategoryType) => {
        try {
            await setThemeCategory(newCategory);
            setCategoryType(newCategory);
        } catch (error) {
            console.error('Failed to change theme category:', error);
        }
    };

    // Get current theme colors merged with color theme
    const currentThemeData = getThemeData(categoryType, colorThemeType);

    const currentThemeColors: CustomThemeColors = {
        ...themes[themeType].colors,
        primary: currentThemeData.primary,
        secondary: currentThemeData.secondary,
    };

    // The context value
    const contextValue: ThemeContextType = {
        theme: themeType,
        colorTheme: colorThemeType,
        category: categoryType,
        themeColors: currentThemeColors,
        changeTheme,
        changeColorTheme,
        changeCategory,
    };

    // Don't render children until initialized to prevent flash of default theme
    if (!initialized) {
        return null;
    }

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);