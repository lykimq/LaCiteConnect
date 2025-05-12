import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getTheme, setTheme, themes, ThemeType } from '../services/themeService';

// Define the theme context type
interface ThemeContextType {
    theme: ThemeType;
    themeColors: typeof themes.light.colors;
    changeTheme: (newTheme: ThemeType) => Promise<void>;
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    themeColors: themes.light.colors,
    changeTheme: async () => { },
});

// Props for ThemeProvider
interface ThemeProviderProps {
    children: ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [themeType, setThemeType] = useState<ThemeType>('light');
    const [initialized, setInitialized] = useState(false);

    // Initialize the theme
    useEffect(() => {
        const initTheme = async () => {
            try {
                const savedTheme = await getTheme();
                setThemeType(savedTheme);
                setInitialized(true);
            } catch (error) {
                console.error('Failed to initialize theme:', error);
                setInitialized(true); // Still set initialized so the app renders
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

    // Get current theme colors
    const themeColors = themes[themeType].colors;

    // The context value
    const contextValue: ThemeContextType = {
        theme: themeType,
        themeColors,
        changeTheme,
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