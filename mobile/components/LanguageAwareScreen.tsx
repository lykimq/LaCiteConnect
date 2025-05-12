import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface LanguageAwareScreenProps {
    children: React.ReactNode;
}

/**
 * A component that forces re-rendering when language changes
 * Use this as a wrapper for screens that need to adapt to language changes
 */
export const LanguageAwareScreen: React.FC<LanguageAwareScreenProps> = ({ children }) => {
    const { currentLanguage, isLoading } = useLanguage();
    const { themeColors } = useTheme();
    const [key, setKey] = useState(currentLanguage);

    // Update the key when language changes to force a re-render
    useEffect(() => {
        setKey(currentLanguage);
    }, [currentLanguage]);

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: themeColors.background }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    // Use the key to force re-mounting of children when language changes
    return <React.Fragment key={key}>{children}</React.Fragment>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});