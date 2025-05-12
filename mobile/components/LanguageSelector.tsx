import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { availableLanguages, getLanguage, getLanguageMetadata, setLanguage } from '../services/languageService';
import { contentService } from '../services/contentService';

interface LanguageSelectorProps {
    compact?: boolean;
    onLanguageChange?: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false, onLanguageChange }) => {
    const [currentLanguage, setCurrentLanguage] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

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
                                    <Ionicons name="close" size={24} color="#333" />
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
                                                <Ionicons name="checkmark" size={18} color="#FF9843" />
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
                <Ionicons name="chevron-down" size={18} color="#666" />
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
                                <Ionicons name="close" size={24} color="#333" />
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
                                            <Ionicons name="checkmark" size={18} color="#FF9843" />
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
        color: '#333',
        marginRight: 10,
    },
    selectorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    compactButton: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedLanguage: {
        fontSize: 16,
        color: '#333',
        marginRight: 8,
    },
    languageCode: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    languageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    selectedLanguageItem: {
        backgroundColor: '#FFF8F0',
    },
    languageItemText: {
        fontSize: 16,
        color: '#333',
    },
    selectedLanguageItemText: {
        color: '#FF9843',
        fontWeight: '500',
    },
});