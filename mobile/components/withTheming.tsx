import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Higher-Order Component to wrap any screen with theming support
 * This ensures that all screens will use the current theme colors
 *
 * @param WrappedComponent The component to wrap with theming
 * @returns A new component with theme support
 */
export const withTheming = <P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
    // Return a new component
    const WithTheming: React.FC<P> = (props) => {
        const { themeColors } = useTheme();

        // Apply base theming to the container
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: themeColors.background,
            },
        });

        // Render the wrapped component inside a themed container
        return (
            <View style={styles.container}>
                <WrappedComponent {...props} />
            </View>
        );
    };

    // Set display name for debugging
    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithTheming.displayName = `WithTheming(${displayName})`;

    return WithTheming;
};