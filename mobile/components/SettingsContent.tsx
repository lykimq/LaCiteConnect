import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { useTheme } from '../contexts/ThemeContext';
import { useLocalizedContent } from '../hooks/useLocalizedContent';

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
        }>;
    }>;
}

export const SettingsContent = () => {
    const { themeColors } = useTheme();
    const { content, isLoading, error } = useLocalizedContent<SettingsContentData>('settings');

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: themeColors.background,
        },
        scrollView: {
            flex: 1,
        },
        header: {
            marginBottom: 20,
            marginTop: 30,
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
            fontSize: 18,
            color: '#666',
            marginBottom: 10,
            textAlign: 'center',
        },
        section: {
            backgroundColor: themeColors.card,
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            borderColor: themeColors.border,
            borderWidth: 1,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: themeColors.text,
            marginLeft: 10,
        },
        description: {
            fontSize: 16,
            color: themeColors.text,
            marginBottom: 16,
            opacity: 0.7,
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
            borderBottomColor: themeColors.border,
        },
        infoLabel: {
            fontSize: 16,
            color: themeColors.text,
        },
        infoValue: {
            fontSize: 16,
            color: themeColors.text,
            opacity: 0.6,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        errorText: {
            color: 'red',
            textAlign: 'center',
            margin: 20,
        },
    });

    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>
                    Failed to load settings. Please try again later.
                </Text>
            </View>
        );
    }

    // Get the icon component for a given icon name
    const getIconComponent = (iconName: string) => {
        return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={22} color={themeColors.primary} />;
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{content.header.title}</Text>
                    <Text style={styles.subtitle}>{content.header.subtitle}</Text>
                </View>

                {/* Language Settings */}
                {content.sections.map((section) => {
                    if (section.id === 'language') {
                        return (
                            <View key={section.id} style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    {getIconComponent(section.icon)}
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
                                    {getIconComponent(section.icon)}
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
                                    {getIconComponent(section.icon)}
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                {section.items.map((item) => (
                                    <TouchableOpacity key={item.id} style={styles.infoItem}>
                                        <Text style={styles.infoLabel}>{item.label}</Text>
                                        {item.type === 'text' && item.value ? (
                                            <Text style={styles.infoValue}>{item.value}</Text>
                                        ) : (
                                            <Ionicons
                                                name="chevron-forward"
                                                size={18}
                                                color={themeColors.text}
                                                style={{ opacity: 0.6 }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        );
                    }

                    return null;
                })}
            </ScrollView>
        </View>
    );
};