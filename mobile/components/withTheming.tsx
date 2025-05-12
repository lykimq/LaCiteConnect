import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Higher-Order Component to wrap any screen with theming and language support
 * This ensures that all screens will use the current theme colors and language
 *
 * @param WrappedComponent The component to wrap with theming and language support
 * @returns A new component with theme and language support
 */
export const withTheming = <P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
    // Return a new component
    const WithTheming: React.FC<P> = (props) => {
        const { themeColors } = useTheme();
        const { currentLanguage } = useLanguage();

        // Apply base theming to the container
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: themeColors.background,
            },
        });

        // Use a memo to re-create the component only when theme or language changes
        const MemoizedComponent = useMemo(() => {
            return (
                <View style={styles.container}>
                    <WrappedComponent {...props} />
                </View>
            );
        }, [themeColors, currentLanguage, props]);

        // Render the memoized component
        return MemoizedComponent;
    };

    // Set display name for debugging
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithTheming.displayName = `WithTheming(${displayName})`;

    return WithTheming;
};