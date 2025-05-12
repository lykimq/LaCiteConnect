import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { availableLanguages } from '../services/languageService';

/**
 * A debug component that displays current language state
 * and provides buttons to test language switching
 */
export const LanguageDebugger: React.FC = () => {
    const { currentLanguage, setAppLanguage, isLoading } = useLanguage();
    const { themeColors } = useTheme();

    return (
        <View style={[styles.container, { borderColor: themeColors.border }]}>
            <Text style={[styles.title, { color: themeColors.text }]}>
                Language Debug Info
            </Text>

            <Text style={[styles.info, { color: themeColors.text }]}>
                Current Language: {currentLanguage}
            </Text>

            <Text style={[styles.info, { color: themeColors.text }]}>
                Loading State: {isLoading ? 'Loading...' : 'Ready'}
            </Text>

            <View style={styles.buttonContainer}>
                {availableLanguages.map(lang => (
                    <Button
                        key={lang}
                        title={`Switch to ${lang.toUpperCase()}`}
                        onPress={() => setAppLanguage(lang)}
                        disabled={isLoading || lang === currentLanguage}
                        color={themeColors.primary}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    info: {
        fontSize: 14,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
});