import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Linking, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';

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
    const { themeColors } = useTheme();
    const { content, isLoading, error, refresh } = useLocalizedContent<SettingsContentData>('settings');
    const [refreshing, setRefreshing] = useState(false);

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
                    onPress: () => Linking.openURL(url)
                }
            ]
        );
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
            marginVertical: 8,
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

    // Get the icon component for a given icon name
    const getIconComponent = (iconName: string) => {
        return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={24} color={themeColors.primary} />;
    };

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

                {/* Language Settings */}
                {content.sections.map((section, sectionIndex) => {
                    if (section.id === 'language') {
                        return (
                            <View key={section.id} style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionIcon}>
                                        {getIconComponent(section.icon)}
                                    </View>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                {section.description && (
                                    <Text style={styles.description}>
                                        {section.description}
                                    </Text>
                                )}
                                <View style={styles.settingItem}>
                                    <LanguageSelector />
                                </View>
                            </View>
                        );
                    }

                    if (section.id === 'theme') {
                        return (
                            <View key={section.id} style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionIcon}>
                                        {getIconComponent(section.icon)}
                                    </View>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                {section.description && (
                                    <Text style={styles.description}>
                                        {section.description}
                                    </Text>
                                )}
                                <View style={styles.settingItem}>
                                    <ThemeSelector />
                                </View>
                            </View>
                        );
                    }

                    if (section.id === 'about' && section.items) {
                        return (
                            <View key={section.id} style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionIcon}>
                                        {getIconComponent(section.icon)}
                                    </View>
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                {section.items.map((item, index) => {
                                    const isLast = index === section.items!.length - 1;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={[styles.infoItem, isLast && styles.lastInfoItem]}
                                            onPress={() => item.type === 'link' && handleLinkPress(item.url || '#', item.label)}
                                            disabled={item.type !== 'link'}
                                        >
                                            <Text style={styles.infoLabel}>{item.label}</Text>
                                            {item.type === 'text' && item.value ? (
                                                <Text style={styles.infoValue}>{item.value}</Text>
                                            ) : item.type === 'link' ? (
                                                <Ionicons
                                                    name="arrow-forward"
                                                    size={18}
                                                    color={themeColors.primary}
                                                />
                                            ) : (
                                                <Ionicons
                                                    name="chevron-forward"
                                                    size={18}
                                                    color={themeColors.text}
                                                    style={{ opacity: 0.6 }}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        );
                    }

                    return null;
                })}

                {/* Support Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            {getIconComponent('help-buoy')}
                        </View>
                        <Text style={styles.sectionTitle}>Support</Text>
                    </View>

                    <TouchableOpacity style={styles.infoItem} onPress={() => handleLinkPress('mailto:support@laciteconnect.org', 'Contact Support')}>
                        <Text style={styles.infoLabel}>Contact Support</Text>
                        <Ionicons name="mail" size={18} color={themeColors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoItem} onPress={() => handleLinkPress('https://laciteconnect.org/faq', 'FAQ')}>
                        <Text style={styles.infoLabel}>Frequently Asked Questions</Text>
                        <Ionicons name="help-circle" size={18} color={themeColors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.infoItem, styles.lastInfoItem]} onPress={() => handleLinkPress('https://laciteconnect.org/feedback', 'Feedback')}>
                        <Text style={styles.infoLabel}>Send Feedback</Text>
                        <Ionicons name="chatbubble" size={18} color={themeColors.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    La Cité Connect © {new Date().getFullYear()}
                </Text>
            </ScrollView>
        </View>
    );
};