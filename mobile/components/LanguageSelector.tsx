import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { availableLanguages, getLanguageMetadata } from '../services/languageService';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
    compact?: boolean;
    onLanguageChange?: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false, onLanguageChange }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { themeColors } = useTheme();

    // Use the language context
    const { currentLanguage, setAppLanguage, isLoading, languageName } = useLanguage();

    const handleLanguageSelect = async (languageCode: string) => {
        try {
            console.log(`[LanguageSelector] Language selection requested: ${currentLanguage} -> ${languageCode}`);

            if (languageCode === currentLanguage) {
                // If same language selected, just close modal
                console.log(`[LanguageSelector] Same language selected, no change needed`);
                setModalVisible(false);
                return;
            }

            console.log(`[LanguageSelector] Beginning language change process`);
            setModalVisible(false); // Close modal first for better UX

            // Change language via context
            console.log(`[LanguageSelector] Calling setAppLanguage with: ${languageCode}`);
            await setAppLanguage(languageCode);
            console.log(`[LanguageSelector] Language change successful: ${languageCode}`);

            // Show confirmation toast
            const langMetadata = getLanguageMetadata(languageCode);
            console.log(`[LanguageSelector] Showing confirmation alert for ${langMetadata.nativeName}`);

            Alert.alert(
                languageCode === 'en' ? 'Language Changed' : 'Langue Modifiée',
                languageCode === 'en'
                    ? `The language has been changed to ${langMetadata.nativeName}`
                    : `La langue a été changée en ${langMetadata.nativeName}`
            );

            // Notify parent component if needed
            if (onLanguageChange) {
                console.log(`[LanguageSelector] Notifying parent component of language change`);
                onLanguageChange(languageCode);
            }

            console.log(`[LanguageSelector] Language change process complete`);
        } catch (error) {
            console.error(`[LanguageSelector] Error changing language to ${languageCode}:`, error);
            Alert.alert(
                'Error',
                'Failed to change language. Please try again.'
            );
        }
    };

    // Current language metadata
    const currentLangMetadata = getLanguageMetadata(currentLanguage);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
        },
        compactContainer: {
            padding: 4,
        },
        label: {
            fontSize: 16,
            color: themeColors.text,
            marginRight: 10,
        },
        selectorButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: themeColors.card,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: themeColors.border,
        },
        compactButton: {
            backgroundColor: themeColors.card,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            borderWidth: 1,
            borderColor: themeColors.border,
        },
        selectedLanguage: {
            fontSize: 16,
            color: themeColors.text,
            marginRight: 8,
        },
        languageCode: {
            fontSize: 12,
            fontWeight: 'bold',
            color: themeColors.text,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            width: '80%',
            backgroundColor: themeColors.background,
            borderRadius: 10,
            padding: 20,
            maxHeight: '70%',
            borderWidth: 1,
            borderColor: themeColors.border,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: themeColors.text,
        },
        languageItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
        },
        selectedLanguageItem: {
            backgroundColor: themeColors.accent + '33', // Add transparency
        },
        languageItemText: {
            fontSize: 16,
            color: themeColors.text,
        },
        selectedLanguageItemText: {
            color: themeColors.primary,
            fontWeight: '500',
        },
        loadingOverlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
    });

    if (compact) {
        // Compact version (just an icon button)
        return (
            <View style={styles.compactContainer}>
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="small" color={themeColors.primary} />
                    </View>
                )}
                <TouchableOpacity
                    style={styles.compactButton}
                    onPress={() => setModalVisible(true)}
                    disabled={isLoading}
                >
                    <Text style={styles.languageCode}>{currentLanguage.toUpperCase()}</Text>
                </TouchableOpacity>

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {currentLanguage === 'fr' ? 'Choisir la Langue' : 'Select Language'}
                                </Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={themeColors.text} />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={availableLanguages}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => {
                                    const metadata = getLanguageMetadata(item);
                                    const isSelected = item === currentLanguage;

                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.languageItem,
                                                isSelected && styles.selectedLanguageItem
                                            ]}
                                            onPress={() => handleLanguageSelect(item)}
                                            disabled={isLoading}
                                        >
                                            <Text style={[
                                                styles.languageItemText,
                                                isSelected && styles.selectedLanguageItemText
                                            ]}>
                                                {metadata.nativeName}
                                            </Text>
                                            {isSelected && (
                                                <Ionicons name="checkmark" size={18} color={themeColors.primary} />
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    // Full version (dropdown selector)
    return (
        <View style={styles.container}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={themeColors.primary} />
                </View>
            )}
            <Text style={styles.label}>
                {currentLanguage === 'fr' ? 'Langue :' : 'Language:'}
            </Text>
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setModalVisible(true)}
                disabled={isLoading}
            >
                <Text style={styles.selectedLanguage}>{currentLangMetadata.nativeName}</Text>
                <Ionicons name="chevron-down" size={18} color={themeColors.text} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {currentLanguage === 'fr' ? 'Choisir la Langue' : 'Select Language'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={themeColors.text} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={availableLanguages}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => {
                                const metadata = getLanguageMetadata(item);
                                const isSelected = item === currentLanguage;

                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.languageItem,
                                            isSelected && styles.selectedLanguageItem
                                        ]}
                                        onPress={() => handleLanguageSelect(item)}
                                        disabled={isLoading}
                                    >
                                        <Text style={[
                                            styles.languageItemText,
                                            isSelected && styles.selectedLanguageItemText
                                        ]}>
                                            {metadata.nativeName}
                                        </Text>
                                        {isSelected && (
                                            <Ionicons name="checkmark" size={18} color={themeColors.primary} />
                                        )}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};