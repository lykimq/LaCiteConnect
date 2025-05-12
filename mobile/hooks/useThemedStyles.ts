import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Custom hook to create themed styles for components
 * @param styleCreator Function that takes theme colors and returns StyleSheet styles
 * @returns StyleSheet styles with current theme colors applied
 */
export const useThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
    styleCreator: (colors: ReturnType<typeof useTheme>['themeColors']) => T
): T => {
    const { themeColors } = useTheme();

    // Use useMemo to only recalculate styles when the theme changes
    const styles = useMemo(
        () => StyleSheet.create(styleCreator(themeColors)),
        [themeColors, styleCreator]
    );

    return styles;
};

export default useThemedStyles;