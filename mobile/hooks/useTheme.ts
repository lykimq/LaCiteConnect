import { useColorScheme } from 'react-native';

interface ThemeColors {
    primary: string;
    background: string;
    card: string;
    text: string;
    textSecondary: string;
    input: string;
    border: string;
    error: string;
    success: string;
}

const lightColors: ThemeColors = {
    primary: '#007AFF',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    input: '#FFFFFF',
    border: '#C6C6C8',
    error: '#FF3B30',
    success: '#34C759',
};

const darkColors: ThemeColors = {
    primary: '#0A84FF',
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    input: '#2C2C2E',
    border: '#38383A',
    error: '#FF453A',
    success: '#32D74B',
};

export const useTheme = () => {
    const colorScheme = useColorScheme();
    const colors = colorScheme === 'dark' ? darkColors : lightColors;

    return {
        colors,
        isDark: colorScheme === 'dark',
    };
};