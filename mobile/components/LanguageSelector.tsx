import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { availableLanguages, getLanguage, getLanguageMetadata, setLanguage } from '../services/languageService';
import { contentService } from '../services/contentService';
import { useTheme } from '../contexts/ThemeContext';

interface LanguageSelectorProps {
    compact?: boolean;
    onLanguageChange?: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false, onLanguageChange }) => {
    const [currentLanguage, setCurrentLanguage] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const { themeColors } = useTheme();

    useEffect(() => {
        // Load current language when component mounts
        const loadLanguage = async () => {
            const lang = await getLanguage();
            setCurrentLanguage(lang);
        };

        loadLanguage();
    }, []);

    const handleLanguageSelect = async (languageCode: string) => {
        try {
            // Update language in services
            await setLanguage(languageCode);
            await contentService.setLanguage(languageCode);

            // Update local state
            setCurrentLanguage(languageCode);

            // Close modal
            setModalVisible(false);

            // Notify parent component if needed
            if (onLanguageChange) {
                onLanguageChange(languageCode);
            }
        } catch (error) {
            console.error('Error changing language:', error);
        }
    };

    // If no language loaded yet
    if (!currentLanguage) {
        return null;
    }

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
            backgroundColor: themeColors.accent,
        },
        languageItemText: {
            fontSize: 16,
            color: themeColors.text,
        },
        selectedLanguageItemText: {
            color: themeColors.primary,
            fontWeight: '500',
        },
    });

    if (compact) {
        // Compact version (just an icon button)
        return (
            <View style={styles.compactContainer}>
                <TouchableOpacity
                    style={styles.compactButton}
                    onPress={() => setModalVisible(true)}
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
                                <Text style={styles.modalTitle}>Select Language</Text>
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
            <Text style={styles.label}>Language:</Text>
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setModalVisible(true)}
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
                            <Text style={styles.modalTitle}>Select Language</Text>
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