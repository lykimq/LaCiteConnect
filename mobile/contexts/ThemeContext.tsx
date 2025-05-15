import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    getTheme,
    setTheme,
    getColorTheme,
    setColorTheme,
    themes,
    themeColors,
    ThemeType,
    ColorThemeType,
    defaultTheme,
    defaultColorTheme,
    initializeTheme
} from '../services/themeService';

// Define the theme context type
interface ThemeContextType {
    theme: ThemeType;
    colorTheme: ColorThemeType;
    themeColors: typeof themes.light.colors & {
        primary: string;
        secondary: string;
    };
    changeTheme: (newTheme: ThemeType) => Promise<void>;
    changeColorTheme: (newColorTheme: ColorThemeType) => Promise<void>;
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
    theme: defaultTheme,
    colorTheme: defaultColorTheme,
    themeColors: {
        ...themes.light.colors,
        ...themeColors.default
    },
    changeTheme: async () => { },
    changeColorTheme: async () => { },
});

// Props for ThemeProvider
interface ThemeProviderProps {
    children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [themeType, setThemeType] = useState<ThemeType>(defaultTheme);
    const [colorThemeType, setColorThemeType] = useState<ColorThemeType>(defaultColorTheme);
    const [initialized, setInitialized] = useState(false);

    // Initialize the theme
    useEffect(() => {
        const initTheme = async () => {
            try {
                const { theme, colorTheme } = await initializeTheme();
                setThemeType(theme || defaultTheme);
                setColorThemeType(colorTheme || defaultColorTheme);
            } catch (error) {
                console.error('Failed to initialize theme:', error);
                // Use defaults if initialization fails
                setThemeType(defaultTheme);
                setColorThemeType(defaultColorTheme);
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

    // Get current theme colors merged with color theme
    const currentThemeColors = {
        ...themes[themeType].colors,
        primary: themeColors[colorThemeType]?.primary || themeColors[defaultColorTheme].primary,
        secondary: themeColors[colorThemeType]?.secondary || themeColors[defaultColorTheme].secondary,
    };

    // The context value
    const contextValue: ThemeContextType = {
        theme: themeType,
        colorTheme: colorThemeType,
        themeColors: currentThemeColors,
        changeTheme,
        changeColorTheme,
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