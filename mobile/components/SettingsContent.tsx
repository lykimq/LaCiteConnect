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
    Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';
import { useLanguage } from '../contexts/LanguageContext';
import { openUrlWithCorrectDomain } from '../utils/urlUtils';
import Constants from 'expo-constants';

// Enhanced interface for settings data
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

    // Pull to refresh functionality
    const onRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    };

    // Handle link press
    const handleLinkPress = (url?: string, title?: string) => {
        if (!url) return;

        Alert.alert(
            `Open ${title || 'Link'}?`,
            `You're about to open: ${url}`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Open',
                    onPress: () => openUrlWithCorrectDomain(url, currentLanguage)
                }
            ]
        );
    };

    // Handle share
    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: currentLanguage === 'fr'
                    ? 'Découvrez La Cité Connect, votre lien avec la communauté! Téléchargez l\'application:'
                    : 'Discover La Cité Connect, your community link! Download the app:',
                url: 'https://laciteconnect.org/app',
                title: 'La Cité Connect'
            });
        } catch (error) {
            Alert.alert('Error', 'Failed to share the app');
        }
    };

    // Get the icon component for a given icon name
    const getIconComponent = (iconName: string) => {
        return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={24} color={themeColors.primary} />;
    };

    // Create dynamic styles based on theme
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: themeColors.background,
        },
        scrollView: {
            flex: 1,
        },
        contentContainer: {
            padding: 16,
            paddingBottom: 40,
        },
        header: {
            marginBottom: 24,
            marginTop: Platform.OS === 'ios' ? 50 : 30,
            alignItems: 'center',
        },
        title: {
            fontSize: 28,
            fontWeight: 'bold',
            color: themeColors.text,
            marginVertical: 10,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: themeColors.secondary || '#666',
            marginBottom: 10,
            textAlign: 'center',
        },
        section: {
            backgroundColor: themeColors.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderColor: themeColors.border,
            borderWidth: 1,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            paddingBottom: 8,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
        },
        sectionIcon: {
            marginRight: 12,
            padding: 8,
            borderRadius: 8,
            backgroundColor: `${themeColors.primary}20`,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: themeColors.text,
        },
        description: {
            fontSize: 14,
            color: themeColors.secondary || '#666',
            marginBottom: 16,
            lineHeight: 20,
        },
        settingItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: `${themeColors.border}80`,
        },
        settingLabel: {
            fontSize: 16,
            color: themeColors.text,
        },
        infoItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: `${themeColors.border}80`,
        },
        lastInfoItem: {
            borderBottomWidth: 0,
        },
        infoLabel: {
            fontSize: 16,
            color: themeColors.text,
        },
        infoValue: {
            fontSize: 16,
            color: themeColors.secondary || themeColors.text,
            opacity: 0.7,
        },
        linkText: {
            color: themeColors.primary,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        errorText: {
            color: themeColors.error || 'red',
            textAlign: 'center',
            marginBottom: 20,
        },
        retryButton: {
            backgroundColor: themeColors.primary,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
        },
        retryButtonText: {
            color: '#fff',
            fontWeight: '600',
        },
        footerText: {
            fontSize: 12,
            color: themeColors.secondary || '#666',
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 10,
        },
        version: {
            fontSize: 14,
            color: themeColors.secondary || '#666',
            textAlign: 'center',
            marginTop: 8,
        },
        themeSwitch: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        activeTheme: {
            color: themeColors.primary,
            fontWeight: '700',
        },
        languageSwitch: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        languageLabel: {
            fontSize: 14,
            color: themeColors.secondary || '#666',
            marginHorizontal: 4,
            fontWeight: '600',
        },
        activeLanguage: {
            color: themeColors.primary,
            fontWeight: '700',
        },
    });

    // Loading state UI
    if (isLoading && !refreshing) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    // Error state UI with retry button
    if (error || !content) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>
                    Failed to load settings. Please check your connection.
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={refresh}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
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
                <View style={styles.header}>
                    <Text style={styles.title}>{content.header.title}</Text>
                    <Text style={styles.subtitle}>{content.header.subtitle}</Text>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <Ionicons name="settings-outline" size={24} color={themeColors.primary} />
                        </View>
                        <Text style={styles.sectionTitle}>
                            {currentLanguage === 'fr' ? 'Préférences' : 'Preferences'}
                        </Text>
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>
                            {currentLanguage === 'fr' ? 'Mode Sombre' : 'Dark Mode'}
                        </Text>
                        <View style={styles.themeSwitch}>
                            <Text style={[
                                styles.languageLabel,
                                currentTheme === 'dark' && styles.activeTheme
                            ]}>Dark</Text>
                            <Switch
                                value={currentTheme === 'dark'}
                                onValueChange={(value) => changeTheme(value ? 'dark' : 'light')}
                                trackColor={{ false: '#767577', true: themeColors.primary }}
                                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : undefined}
                            />
                            <Text style={[
                                styles.languageLabel,
                                currentTheme === 'light' && styles.activeTheme
                            ]}>Light</Text>
                        </View>
                    </View>

                    <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                        <Text style={styles.settingLabel}>
                            {currentLanguage === 'fr' ? 'Langue' : 'Language'}
                        </Text>
                        <View style={styles.languageSwitch}>
                            <Text style={[
                                styles.languageLabel,
                                currentLanguage === 'fr' && styles.activeLanguage
                            ]}>FR</Text>
                            <Switch
                                value={currentLanguage === 'en'}
                                onValueChange={(value) => setAppLanguage(value ? 'en' : 'fr')}
                                trackColor={{ false: '#767577', true: themeColors.primary }}
                                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : undefined}
                            />
                            <Text style={[
                                styles.languageLabel,
                                currentLanguage === 'en' && styles.activeLanguage
                            ]}>EN</Text>
                        </View>
                    </View>
                </View>

                {/* Share Section */}
                <View style={styles.section}>
                    <TouchableOpacity onPress={handleShare} style={styles.infoItem}>
                        <Text style={styles.infoLabel}>
                            {currentLanguage === 'fr' ? 'Partager l\'Application' : 'Share App'}
                        </Text>
                        <Ionicons name="share-outline" size={24} color={themeColors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Legal Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <Ionicons name="shield-outline" size={24} color={themeColors.primary} />
                        </View>
                        <Text style={styles.sectionTitle}>
                            {currentLanguage === 'fr' ? 'Légal' : 'Legal'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.infoItem}
                        onPress={() => handleLinkPress('https://laciteconnect.org/terms', 'Terms of Service')}
                    >
                        <Text style={styles.infoLabel}>
                            {currentLanguage === 'fr' ? 'Conditions d\'Utilisation' : 'Terms of Service'}
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color={themeColors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.infoItem, styles.lastInfoItem]}
                        onPress={() => handleLinkPress('https://laciteconnect.org/privacy', 'Privacy Policy')}
                    >
                        <Text style={styles.infoLabel}>
                            {currentLanguage === 'fr' ? 'Politique de Confidentialité' : 'Privacy Policy'}
                        </Text>
                        <Ionicons name="chevron-forward" size={24} color={themeColors.text} />
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <Ionicons name="help-buoy-outline" size={24} color={themeColors.primary} />
                        </View>
                        <Text style={styles.sectionTitle}>
                            {currentLanguage === 'fr' ? 'Support' : 'Support'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.infoItem}
                        onPress={() => handleLinkPress('mailto:support@laciteconnect.org', 'Contact Support')}
                    >
                        <Text style={styles.infoLabel}>
                            {currentLanguage === 'fr' ? 'Contacter le Support' : 'Contact Support'}
                        </Text>
                        <Ionicons name="mail-outline" size={24} color={themeColors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.infoItem}
                        onPress={() => handleLinkPress('https://laciteconnect.org/faq', 'FAQ')}
                    >
                        <Text style={styles.infoLabel}>
                            {currentLanguage === 'fr' ? 'FAQ' : 'FAQ'}
                        </Text>
                        <Ionicons name="help-circle-outline" size={24} color={themeColors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.infoItem, styles.lastInfoItem]}
                        onPress={() => handleLinkPress('https://laciteconnect.org/feedback', 'Feedback')}
                    >
                        <Text style={styles.infoLabel}>
                            {currentLanguage === 'fr' ? 'Envoyer un Retour' : 'Send Feedback'}
                        </Text>
                        <Ionicons name="chatbubble-outline" size={24} color={themeColors.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    La Cité Connect © {new Date().getFullYear()}
                </Text>
                <Text style={styles.version}>
                    Version {Constants.expoConfig?.version || '1.0.0'}
                </Text>
            </ScrollView>
        </View>
    );
};