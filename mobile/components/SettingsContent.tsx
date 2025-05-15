import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { useLanguage } from '../contexts/LanguageContext';
import { openUrlWithCorrectDomain } from '../utils/urlUtils';
import Constants from 'expo-constants';

interface SettingsContentData {
    header: {
        title: string;
        subtitle: string;
    };
    sections: Array<{
        id: string;
        icon: string;
        title: string;
        description?: string;
        items?: Array<{
            id: string;
            label: string;
            value?: string;
            type: string;
            url?: string;
        }>;
    }>;
}

export const SettingsContent = () => {
    const { themeColors, theme: currentTheme, changeTheme } = useTheme();
    const { content, isLoading, error, refresh } = useLocalizedContent<SettingsContentData>('settings');
    const [refreshing, setRefreshing] = useState(false);
    const { currentLanguage, setAppLanguage } = useLanguage();

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
        themeOption: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
            marginLeft: 8,
            backgroundColor: themeColors.border + '20',
        },
        themeOptionActive: {
            backgroundColor: themeColors.primary + '20',
        },
        themeOptionText: {
            fontSize: 15,
            color: themeColors.secondary,
            marginLeft: 4,
        },
        themeOptionTextActive: {
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
                                {currentLanguage === 'fr' ? 'Préférences' : 'Preferences'}
                            </Text>
                        </View>

                        <View style={styles.optionItem}>
                            <Text style={styles.optionLabel}>
                                {currentLanguage === 'fr' ? 'Mode Sombre' : 'Dark Mode'}
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
                                    ]}>Light</Text>
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
                                    ]}>Dark</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={[styles.optionItem, { borderBottomWidth: 0 }]}>
                            <Text style={styles.optionLabel}>
                                {currentLanguage === 'fr' ? 'Langue' : 'Language'}
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
                                    ]}>FR</Text>
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
                                    ]}>EN</Text>
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