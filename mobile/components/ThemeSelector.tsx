import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { themes, ThemeType } from '../services/themeService';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeSelectorProps {
    compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ compact = false }) => {
    const { theme: currentTheme, changeTheme, themeColors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);

    const handleThemeSelect = async (themeType: ThemeType) => {
        try {
            // Update theme in context
            await changeTheme(themeType);

            // Close modal
            setModalVisible(false);
        } catch (error) {
            console.error('Error changing theme:', error);
        }
    };

    // Get current theme data
    const currentThemeData = themes[currentTheme];

    // Transform themes object to array for FlatList
    const themesList = Object.entries(themes).map(([key, value]) => ({
        themeId: key as ThemeType,
        ...value
    }));

    const styles = StyleSheet.create({
        container: {
            marginBottom: 20,
        },
        label: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 8,
            color: themeColors.text,
        },
        selectorButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 12,
            borderWidth: 1,
            borderColor: themeColors.border,
            borderRadius: 8,
            backgroundColor: themeColors.card,
        },
        selectedTheme: {
            fontSize: 16,
            color: themeColors.text,
        },
        compactContainer: {
            marginHorizontal: 8,
        },
        compactButton: {
            padding: 8,
            borderRadius: 20,
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
            borderWidth: 1,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: themeColors.background,
            borderRadius: 12,
            width: '80%',
            maxHeight: '70%',
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderColor: themeColors.border,
            borderWidth: 1,
        },
        modalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
            paddingBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: themeColors.text,
        },
        themeOption: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
        },
        selectedThemeOption: {
            backgroundColor: themeColors.accent,
        },
        themeOptionText: {
            flex: 1,
            fontSize: 16,
            color: themeColors.text,
            marginLeft: 15,
        },
        themeColorIndicator: {
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: themeColors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        themeColorAccent: {
            width: 12,
            height: 12,
            borderRadius: 6,
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
                    <Ionicons
                        name={currentTheme === 'dark' ? 'moon' : 'sunny'}
                        size={20}
                        color={themeColors.primary}
                    />
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
                                <Text style={styles.modalTitle}>Select Theme</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color={themeColors.text} />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={themesList}
                                keyExtractor={(item) => item.themeId}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.themeOption,
                                            currentTheme === item.themeId && styles.selectedThemeOption,
                                        ]}
                                        onPress={() => handleThemeSelect(item.themeId)}
                                    >
                                        <View style={[styles.themeColorIndicator, { backgroundColor: item.colors.background }]}>
                                            <View style={[styles.themeColorAccent, { backgroundColor: item.colors.primary }]} />
                                        </View>
                                        <Text style={styles.themeOptionText}>{item.name}</Text>
                                        {currentTheme === item.themeId && (
                                            <Ionicons name="checkmark" size={20} color={themeColors.primary} />
                                        )}
                                    </TouchableOpacity>
                                )}
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
            <Text style={styles.label}>Theme:</Text>
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.selectedTheme}>{currentThemeData.name}</Text>
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
                            <Text style={styles.modalTitle}>Select Theme</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={themeColors.text} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={themesList}
                            keyExtractor={(item) => item.themeId}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.themeOption,
                                        currentTheme === item.themeId && styles.selectedThemeOption,
                                    ]}
                                    onPress={() => handleThemeSelect(item.themeId)}
                                >
                                    <View style={[styles.themeColorIndicator, { backgroundColor: item.colors.background }]}>
                                        <View style={[styles.themeColorAccent, { backgroundColor: item.colors.primary }]} />
                                    </View>
                                    <Text style={styles.themeOptionText}>{item.name}</Text>
                                    {currentTheme === item.themeId && (
                                        <Ionicons name="checkmark" size={20} color={themeColors.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};