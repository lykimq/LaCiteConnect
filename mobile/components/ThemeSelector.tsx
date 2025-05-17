import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, AccessibilityInfo, SectionList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { categorizedThemes, ThemeCategoryType, ColorThemeType, ThemeData } from '../services/themeService';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';

interface ThemeSelectorProps {
    compact?: boolean;
}

interface ThemeItem extends ThemeData {
    themeId: ColorThemeType;
}

interface ThemeSection {
    category: ThemeCategoryType;
    title: string;
    data: ThemeItem[];
}

interface SettingsContent {
    sections: {
        preferences: {
            theme: {
                categories: Record<ThemeCategoryType, string>;
            };
        };
    };
}

// Helper function to safely get theme data
const getThemeData = (category: ThemeCategoryType, colorTheme: ColorThemeType): ThemeData | undefined => {
    // Check if the category exists
    if (!(category in categorizedThemes)) {
        return categorizedThemes.default.default;
    }

    // Check if the theme exists in the category
    const categoryThemes = categorizedThemes[category];
    if (colorTheme in categoryThemes) {
        return categoryThemes[colorTheme as keyof typeof categoryThemes];
    }

    // Default fallback
    return categorizedThemes.default.default;
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ compact = false }) => {
    const { theme: currentTheme, colorTheme, category: currentCategory, changeTheme, changeColorTheme, changeCategory, themeColors } = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const { content } = useLocalizedContent<SettingsContent>('settings');

    // Memoize theme sections
    const themeSections = useMemo(() => {
        return Object.entries(categorizedThemes).map(([category, themes]) => ({
            category: category as ThemeCategoryType,
            title: content?.sections?.preferences?.theme?.categories?.[category as ThemeCategoryType] || category,
            data: Object.entries(themes).map(([id, theme]) => ({
                themeId: id as ColorThemeType,
                ...theme
            }))
        }));
    }, [content]);

    // Get current theme data
    const currentThemeData = useMemo(() => {
        return getThemeData(currentCategory, colorTheme) || categorizedThemes.default.default;
    }, [currentCategory, colorTheme]);

    const handleThemeSelect = useCallback(async (themeId: ColorThemeType, category: ThemeCategoryType) => {
        try {
            await Haptics.selectionAsync();
            await changeCategory(category);
            await changeColorTheme(themeId);
            setModalVisible(false);

            const themeData = getThemeData(category, themeId);
            const themeName = themeData?.name || themeId;
            const categoryName = content?.sections?.preferences?.theme?.categories?.[category] || category;

            // Announce theme change to screen readers
            AccessibilityInfo.announceForAccessibility(
                `Theme changed to ${themeName} from ${categoryName} category`
            );
        } catch (error) {
            console.error('Error changing theme:', error);
        }
    }, [changeColorTheme, changeCategory, content]);

    const styles = StyleSheet.create({
        container: {
            marginBottom: 20,
        },
        categorySelector: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
        },
        categoryText: {
            fontSize: 14,
            color: themeColors.text,
            textTransform: 'capitalize',
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
        themeInfo: {
            flex: 1,
        },
        selectedTheme: {
            fontSize: 16,
            color: themeColors.text,
        },
        colorPreview: {
            flexDirection: 'row',
            marginTop: 4,
        },
        colorSwatch: {
            width: 20,
            height: 20,
            borderRadius: 4,
            marginRight: 8,
            borderWidth: 1,
            borderColor: themeColors.border,
        },
        navigationButtons: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        navButton: {
            padding: 8,
            marginHorizontal: 4,
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
        themeItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border + '20',
        },
        selectedThemeItem: {
            backgroundColor: themeColors.primary + '10',
        },
        themePreview: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        colorIndicator: {
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: themeColors.border,
        },
        colorSecondary: {
            position: 'absolute',
            right: -4,
            bottom: -4,
            width: 16,
            height: 16,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: themeColors.border,
        },
        themeName: {
            fontSize: 16,
            color: themeColors.text,
            marginLeft: 12,
            flex: 1,
        },
        sectionHeader: {
            backgroundColor: themeColors.card,
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: themeColors.primary,
            textTransform: 'capitalize',
        },
    });

    const renderThemeItem = ({ item, section }: { item: ThemeItem; section: ThemeSection }) => (
        <TouchableOpacity
            style={[
                styles.themeItem,
                colorTheme === item.themeId && currentCategory === section.category && styles.selectedThemeItem
            ]}
            onPress={() => handleThemeSelect(item.themeId, section.category)}
        >
            <View style={styles.themePreview}>
                <View style={[styles.colorIndicator, { backgroundColor: item.primary }]}>
                    <View style={[styles.colorSecondary, { backgroundColor: item.secondary }]} />
                </View>
                <Text style={styles.themeName}>{item.name}</Text>
            </View>
            {colorTheme === item.themeId && currentCategory === section.category && (
                <Ionicons name="checkmark-circle" size={24} color={themeColors.primary} />
            )}
        </TouchableOpacity>
    );

    const renderSectionHeader = ({ section }: { section: ThemeSection }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>
    );

    if (compact) {
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

                            <SectionList
                                sections={themeSections}
                                renderItem={renderThemeItem}
                                renderSectionHeader={renderSectionHeader}
                                keyExtractor={(item) => item.themeId}
                                stickySectionHeadersEnabled={true}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    // Full version
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.selectorButton}
                onPress={() => setModalVisible(true)}
            >
                <View style={styles.themeInfo}>
                    <Text style={styles.categoryText}>
                        {content?.sections.preferences.theme.categories[currentCategory] || currentCategory}
                    </Text>
                    <Text style={styles.selectedTheme}>{currentThemeData.name}</Text>
                    <View style={styles.colorPreview}>
                        <View style={[styles.colorSwatch, { backgroundColor: currentThemeData.primary }]} />
                        <View style={[styles.colorSwatch, { backgroundColor: currentThemeData.secondary }]} />
                    </View>
                </View>
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

                        <SectionList
                            sections={themeSections}
                            renderItem={renderThemeItem}
                            renderSectionHeader={renderSectionHeader}
                            keyExtractor={(item) => item.themeId}
                            stickySectionHeadersEnabled={true}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};