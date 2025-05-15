import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Linking,
    Alert,
    RefreshControl,
    Share,
    Pressable,
    Image,
    StatusBar,
    Switch,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { useLanguage } from '../contexts/LanguageContext';
import { openUrlWithCorrectDomain } from '../utils/urlUtils';
import Constants from 'expo-constants';
import {
    ThemeType,
    ColorThemeType,
    ThemeCategoryType,
    themeColors as themeColorOptions,
    categorizedThemes,
    ThemeData,
} from '../services/themeService';

interface SettingsContentData {
    header: {
        title: string;
        subtitle: string;
    };
    sections: {
        preferences: {
            title: string;
            theme: {
                title: string;
                darkMode: string;
                themeColor: string;
                categories: {
                    [key in ThemeCategoryType]: string;
                };
                options: {
                    light: string;
                    dark: string;
                    colors: {
                        [key in ColorThemeType]: string;
                    };
                };
            };
            language: {
                title: string;
                options: {
                    en: string;
                    fr: string;
                };
            };
        };
        support: {
            title: string;
            items: {
                contactSupport: {
                    label: string;
                    type: string;
                    url: string;
                };
                termsOfService: {
                    label: string;
                    type: string;
                    url: string;
                };
                privacyPolicy: {
                    label: string;
                    type: string;
                    url: string;
                };
                shareApp: {
                    label: string;
                    type: string;
                    url: string;
                };
            };
        };
    };
}

export const SettingsContent = () => {
    const {
        themeColors,
        theme: currentTheme,
        colorTheme: currentColorTheme,
        category: currentCategory,
        changeTheme,
        changeColorTheme,
        changeCategory,
    } = useTheme();
    const { content, isLoading, error, refresh } = useLocalizedContent<SettingsContentData>('settings');
    const [refreshing, setRefreshing] = useState(false);
    const { currentLanguage, setAppLanguage } = useLanguage();

    // Get current theme data
    const currentThemeData = useMemo(() => {
        const categoryThemes = categorizedThemes[currentCategory];
        const themeData = categoryThemes[currentColorTheme as keyof typeof categoryThemes] as ThemeData;
        return themeData || categorizedThemes.default.default;
    }, [currentCategory, currentColorTheme]);

    // Theme navigation handlers
    const handlePreviousTheme = () => {
        const categories = Object.keys(categorizedThemes) as ThemeCategoryType[];
        const currentCategoryIndex = categories.indexOf(currentCategory);
        const currentThemes = Object.keys(categorizedThemes[currentCategory]) as ColorThemeType[];
        const currentThemeIndex = currentThemes.indexOf(currentColorTheme);

        if (currentThemeIndex > 0) {
            // Move to previous theme in current category
            const prevThemeId = currentThemes[currentThemeIndex - 1];
            changeColorTheme(prevThemeId);
        } else if (currentCategoryIndex > 0) {
            // Move to last theme of previous category
            const prevCategory = categories[currentCategoryIndex - 1];
            const prevCategoryThemes = Object.keys(categorizedThemes[prevCategory]) as ColorThemeType[];
            const lastThemeId = prevCategoryThemes[prevCategoryThemes.length - 1];
            changeCategory(prevCategory);
            changeColorTheme(lastThemeId);
        }
    };

    const handleNextTheme = () => {
        const categories = Object.keys(categorizedThemes) as ThemeCategoryType[];
        const currentCategoryIndex = categories.indexOf(currentCategory);
        const currentThemes = Object.keys(categorizedThemes[currentCategory]) as ColorThemeType[];
        const currentThemeIndex = currentThemes.indexOf(currentColorTheme);

        if (currentThemeIndex < currentThemes.length - 1) {
            // Move to next theme in current category
            const nextThemeId = currentThemes[currentThemeIndex + 1];
            changeColorTheme(nextThemeId);
        } else if (currentCategoryIndex < categories.length - 1) {
            // Move to first theme of next category
            const nextCategory = categories[currentCategoryIndex + 1];
            const nextCategoryThemes = Object.keys(categorizedThemes[nextCategory]) as ColorThemeType[];
            const firstThemeId = nextCategoryThemes[0];
            changeCategory(nextCategory);
            changeColorTheme(firstThemeId);
        }
    };

    // Calculate if we can navigate
    const canNavigatePrevious = () => {
        const categories = Object.keys(categorizedThemes) as ThemeCategoryType[];
        const currentCategoryIndex = categories.indexOf(currentCategory);
        const currentThemes = Object.keys(categorizedThemes[currentCategory]) as ColorThemeType[];
        const currentThemeIndex = currentThemes.indexOf(currentColorTheme);

        return currentThemeIndex > 0 || currentCategoryIndex > 0;
    };

    const canNavigateNext = () => {
        const categories = Object.keys(categorizedThemes) as ThemeCategoryType[];
        const currentCategoryIndex = categories.indexOf(currentCategory);
        const currentThemes = Object.keys(categorizedThemes[currentCategory]) as ColorThemeType[];
        const currentThemeIndex = currentThemes.indexOf(currentColorTheme);

        return currentThemeIndex < currentThemes.length - 1 || currentCategoryIndex < categories.length - 1;
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    };

    const handleLinkPress = (url?: string, title?: string) => {
        if (!url) return;
        Alert.alert(
            `Open ${title || 'Link'}?`,
            `You're about to open: ${url}`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open', onPress: () => openUrlWithCorrectDomain(url, currentLanguage) }
            ]
        );
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: currentLanguage === 'fr'
                    ? 'Découvrez La Cité Connect, votre lien avec la communauté!'
                    : 'Discover La Cité Connect, your community link!',
                url: 'https://laciteconnect.org/app',
                title: 'La Cité Connect'
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share the app');
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: themeColors.background,
        },
        scrollView: {
            flex: 1,
        },
        heroSection: {
            backgroundColor: themeColors.card,
            paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight || 44 : StatusBar.currentHeight || 0,
            paddingBottom: 20,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },
        heroContent: {
            paddingHorizontal: 20,
            alignItems: 'center',
        },
        logoContainer: {
            width: 80,
            height: 80,
            marginTop: 20,
            marginBottom: 16,
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: themeColors.background,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        logo: {
            width: '100%',
            height: '100%',
        },
        heroTitle: {
            fontSize: 28,
            fontWeight: '700',
            color: themeColors.text,
            marginBottom: 8,
            textAlign: 'center',
        },
        heroSubtitle: {
            fontSize: 16,
            color: themeColors.secondary,
            opacity: 0.8,
            textAlign: 'center',
        },
        contentContainer: {
            padding: 16,
            paddingTop: 24,
        },
        section: {
            backgroundColor: themeColors.card,
            borderRadius: 16,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            overflow: 'hidden',
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: themeColors.primary + '10',
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border + '20',
        },
        sectionIcon: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: themeColors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: themeColors.text,
            flex: 1,
        },
        optionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border + '10',
        },
        optionLabel: {
            fontSize: 16,
            color: themeColors.text,
            flex: 1,
        },
        themeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        themeSelector: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            alignSelf: 'flex-end',
        },
        themePreview: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            backgroundColor: themeColors.card,
            borderWidth: 1,
            borderColor: themeColors.border,
            minWidth: 100,
        },
        themePreviewContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        themeInfo: {
            flexDirection: 'column',
            gap: 4,
        },
        themeCategory: {
            fontSize: 12,
            fontWeight: '500',
            opacity: 0.8,
        },
        themeColorPreview: {
            width: 20,
            height: 20,
            borderRadius: 10,
            position: 'relative',
            borderWidth: 1,
            borderColor: themeColors.border,
        },
        themeColorSecondary: {
            position: 'absolute',
            right: -4,
            bottom: -4,
            width: 12,
            height: 12,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: themeColors.border,
        },
        themeNavButton: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: themeColors.card,
            borderWidth: 1,
            borderColor: themeColors.border,
            justifyContent: 'center',
            alignItems: 'center',
        },
        themeNavButtonDisabled: {
            opacity: 0.5,
        },
        themeOption: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            backgroundColor: themeColors.border + '20',
        },
        themeOptionActive: {
            backgroundColor: themeColors.primary + '20',
        },
        themeOptionText: {
            fontSize: 15,
            fontWeight: '500',
        },
        themeOptionTextActive: {
            color: themeColors.primary,
            fontWeight: '500',
        },
        languageOption: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            backgroundColor: themeColors.border + '20',
            marginLeft: 8,
        },
        languageOptionActive: {
            backgroundColor: themeColors.primary + '20',
        },
        languageOptionText: {
            fontSize: 15,
            color: themeColors.secondary,
        },
        languageOptionTextActive: {
            color: themeColors.primary,
            fontWeight: '500',
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border + '10',
        },
        actionText: {
            fontSize: 16,
            color: themeColors.text,
            flex: 1,
        },
        actionIcon: {
            marginLeft: 8,
            opacity: 0.8,
        },
        footer: {
            alignItems: 'center',
            paddingVertical: 24,
            paddingHorizontal: 20,
        },
        footerText: {
            fontSize: 13,
            color: themeColors.secondary,
            opacity: 0.7,
            textAlign: 'center',
        },
        version: {
            fontSize: 12,
            color: themeColors.secondary,
            marginTop: 4,
            opacity: 0.6,
        },
    });

    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={[styles.optionLabel, { marginBottom: 16, textAlign: 'center' }]}>
                    Failed to load settings. Please check your connection.
                </Text>
                <TouchableOpacity
                    onPress={refresh}
                    style={{
                        backgroundColor: themeColors.primary,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[themeColors.primary]}
                        tintColor={themeColors.primary}
                    />
                }
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroContent}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('../assets/icon-mobile.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.heroTitle}>La Cité Connect</Text>
                        <Text style={styles.heroSubtitle}>
                            {currentLanguage === 'fr' ? 'Paramètres' : 'Settings'}
                        </Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Preferences Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Ionicons name="options-outline" size={20} color={themeColors.primary} />
                            </View>
                            <Text style={styles.sectionTitle}>
                                {content?.sections.preferences.title || 'Preferences'}
                            </Text>
                        </View>

                        {/* Dark Mode Toggle */}
                        <View style={styles.optionItem}>
                            <Text style={styles.optionLabel}>
                                {content?.sections.preferences.theme.darkMode || 'Dark Mode'}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Pressable
                                    style={[
                                        styles.themeOption,
                                        currentTheme === 'light' && styles.themeOptionActive
                                    ]}
                                    onPress={() => changeTheme('light')}
                                >
                                    <Ionicons
                                        name="sunny-outline"
                                        size={18}
                                        color={currentTheme === 'light' ? themeColors.primary : themeColors.secondary}
                                    />
                                    <Text style={[
                                        styles.themeOptionText,
                                        currentTheme === 'light' && styles.themeOptionTextActive
                                    ]}>
                                        {content?.sections.preferences.theme.options.light || 'Light'}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.themeOption,
                                        currentTheme === 'dark' && styles.themeOptionActive
                                    ]}
                                    onPress={() => changeTheme('dark')}
                                >
                                    <Ionicons
                                        name="moon-outline"
                                        size={18}
                                        color={currentTheme === 'dark' ? themeColors.primary : themeColors.secondary}
                                    />
                                    <Text style={[
                                        styles.themeOptionText,
                                        currentTheme === 'dark' && styles.themeOptionTextActive
                                    ]}>
                                        {content?.sections.preferences.theme.options.dark || 'Dark'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Color Theme Selection */}
                        <View style={styles.optionItem}>
                            <Text style={styles.optionLabel}>
                                {content?.sections.preferences.theme.themeColor || 'Theme Colors'}
                            </Text>
                            <View style={[styles.themeSelector, { maxWidth: '60%' }]}>
                                <Pressable
                                    style={[
                                        styles.themeNavButton,
                                        !canNavigatePrevious() && { opacity: 0.5 }
                                    ]}
                                    onPress={handlePreviousTheme}
                                    disabled={!canNavigatePrevious()}
                                >
                                    <Ionicons
                                        name="chevron-back"
                                        size={18}
                                        color={themeColors.text}
                                    />
                                </Pressable>

                                <View style={styles.themePreview}>
                                    <View style={styles.themePreviewContent}>
                                        <View style={[
                                            styles.themeColorPreview,
                                            { backgroundColor: currentThemeData.primary }
                                        ]}>
                                            <View style={[
                                                styles.themeColorSecondary,
                                                { backgroundColor: currentThemeData.secondary }
                                            ]} />
                                        </View>
                                        <View style={styles.themeInfo}>
                                            <Text style={[
                                                styles.themeCategory,
                                                { color: themeColors.secondary }
                                            ]}>
                                                {content?.sections.preferences.theme.categories[currentCategory] || currentCategory}
                                            </Text>
                                            <Text style={[
                                                styles.themeOptionText,
                                                { color: currentThemeData.primary }
                                            ]}>
                                                {currentThemeData.name}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <Pressable
                                    style={[
                                        styles.themeNavButton,
                                        !canNavigateNext() && { opacity: 0.5 }
                                    ]}
                                    onPress={handleNextTheme}
                                    disabled={!canNavigateNext()}
                                >
                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={themeColors.text}
                                    />
                                </Pressable>
                            </View>
                        </View>

                        {/* Language Selection */}
                        <View style={[styles.optionItem, { borderBottomWidth: 0 }]}>
                            <Text style={styles.optionLabel}>
                                {content?.sections.preferences.language.title || 'Language'}
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Pressable
                                    style={[
                                        styles.themeOption,
                                        currentLanguage === 'fr' && styles.themeOptionActive
                                    ]}
                                    onPress={() => setAppLanguage('fr')}
                                >
                                    <Text style={[
                                        styles.themeOptionText,
                                        currentLanguage === 'fr' && styles.themeOptionTextActive
                                    ]}>
                                        {content?.sections.preferences.language.options.fr || 'FR'}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.themeOption,
                                        currentLanguage === 'en' && styles.themeOptionActive
                                    ]}
                                    onPress={() => setAppLanguage('en')}
                                >
                                    <Text style={[
                                        styles.themeOptionText,
                                        currentLanguage === 'en' && styles.themeOptionTextActive
                                    ]}>
                                        {content?.sections.preferences.language.options.en || 'EN'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    {/* Support & Legal Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionIcon}>
                                <Ionicons name="shield-checkmark-outline" size={20} color={themeColors.primary} />
                            </View>
                            <Text style={styles.sectionTitle}>
                                {currentLanguage === 'fr' ? 'Support & Légal' : 'Support & Legal'}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleLinkPress('mailto:support@laciteconnect.org', 'Contact Support')}
                        >
                            <Text style={styles.actionText}>
                                {currentLanguage === 'fr' ? 'Contacter le Support' : 'Contact Support'}
                            </Text>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={themeColors.secondary}
                                style={styles.actionIcon}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleLinkPress('https://laciteconnect.org/terms', 'Terms of Service')}
                        >
                            <Text style={styles.actionText}>
                                {currentLanguage === 'fr' ? 'Conditions d\'Utilisation' : 'Terms of Service'}
                            </Text>
                            <Ionicons
                                name="document-text-outline"
                                size={20}
                                color={themeColors.secondary}
                                style={styles.actionIcon}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleLinkPress('https://laciteconnect.org/privacy', 'Privacy Policy')}
                        >
                            <Text style={styles.actionText}>
                                {currentLanguage === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
                            </Text>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={themeColors.secondary}
                                style={styles.actionIcon}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, { borderBottomWidth: 0 }]}
                            onPress={handleShare}
                        >
                            <Text style={styles.actionText}>
                                {currentLanguage === 'fr' ? 'Partager l\'Application' : 'Share App'}
                            </Text>
                            <Ionicons
                                name="share-outline"
                                size={20}
                                color={themeColors.secondary}
                                style={styles.actionIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            La Cité Connect © {new Date().getFullYear()}
                        </Text>
                        <Text style={styles.version}>
                            Version {Constants.expoConfig?.version || '1.0.0'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};