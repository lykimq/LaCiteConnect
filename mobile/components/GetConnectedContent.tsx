import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS } from '../config/staticData';
import { contentService } from '../services/contentService';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createGetConnectedStyles } from '../styles/GetConnectedContent.styles';
import { openUrlWithCorrectDomain, openGenericUrl } from '../utils/urlUtils';
import { useLanguage } from '../contexts/LanguageContext';

// Define the get connected content interface
interface GetConnectedContent {
    header: {
        title: string;
        subtitle: string;
    };
    ui: {
        quickActions: {
            subscribe: string;
            volunteer: string;
        };
    };
    sections: Array<{
        id: string;
        icon: string;
        title: string;
        content: string;
        button?: {
            text: string;
            icon: string;
        };
        buttons?: Array<{
            text: string;
            icon: string;
        }>;
        contact?: Array<{
            type: string;
            value: string;
            icon: string;
            url?: string;
        }>;
    }>;
}

// Default content for initial state
const defaultContent: GetConnectedContent = {
    header: {
        title: '',
        subtitle: '',
    },
    ui: {
        quickActions: {
            subscribe: '',
            volunteer: '',
        },
    },
    sections: [],
};

export const GetConnectedContent = () => {
    const [content, setContent] = useState<GetConnectedContent>(defaultContent);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createGetConnectedStyles);
    const { currentLanguage } = useLanguage();

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            if (!refreshing) setLoading(true);
            const response = await contentService.getContent<GetConnectedContent>('getConnected');

            if (response.success && response.data) {
                // Validate the response data structure
                const validData = {
                    header: {
                        title: response.data.header?.title || '',
                        subtitle: response.data.header?.subtitle || '',
                    },
                    ui: {
                        quickActions: {
                            subscribe: response.data.ui?.quickActions?.subscribe || '',
                            volunteer: response.data.ui?.quickActions?.volunteer || '',
                        },
                    },
                    sections: response.data.sections || [],
                };
                setContent(validData);
                setError(null);
            } else {
                setError(response.error || 'Failed to load content');
            }
        } catch (err) {
            console.error('Error loading get connected content:', err);
            setError('An error occurred while loading content');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setError(null);
        loadContent();
    }, []);

    const handleSubscribe = () => {
        openUrlWithCorrectDomain(STATIC_URLS.subscribe, currentLanguage);
    };

    const handleVolunteer = () => {
        openUrlWithCorrectDomain(STATIC_URLS.volunteer, currentLanguage);
    };

    const handleEmail = () => {
        openGenericUrl('mailto:salut@egliselacite.com');
    };

    const handleSocialMedia = (url?: string) => {
        if (url) {
            openGenericUrl(url);
        }
    };

    const handleChezNous = () => {
        openUrlWithCorrectDomain(STATIC_URLS.chezNous, currentLanguage);
    };

    const handleChezNousDetails = () => {
        openUrlWithCorrectDomain(STATIC_URLS.chezNousDetails, currentLanguage);
    };

    const handleContactAction = (type: string, url?: string) => {
        if (type === 'email') {
            handleEmail();
        } else {
            handleSocialMedia(url);
        }
    };

    const renderSectionContent = (section: GetConnectedContent['sections'][0]) => {
        return (
            <View style={styles.sectionContent}>
                <Text style={styles.sectionText}>
                    {section.content}
                </Text>

                {section.contact && (
                    <View style={styles.contactGrid}>
                        {section.contact.map((contact, index) => (
                            <TouchableOpacity
                                key={`${section.id}-contact-${index}`}
                                style={styles.contactButton}
                                onPress={() => handleContactAction(contact.type, contact.url)}
                            >
                                <View style={styles.contactIconContainer}>
                                    <Ionicons
                                        name={contact.icon as any}
                                        size={24}
                                        color={themeColors.primary}
                                    />
                                </View>
                                <Text style={styles.contactText}>
                                    {contact.value}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {section.button && (
                    <TouchableOpacity
                        style={styles.sectionButton}
                        onPress={section.id === 'stayUpdated' ? handleSubscribe : handleVolunteer}
                    >
                        <Ionicons
                            name={section.button.icon as any}
                            size={22}
                            color="#FFFFFF"
                            style={styles.sectionButtonIcon}
                        />
                        <Text style={styles.sectionButtonText}>
                            {section.button.text}
                        </Text>
                    </TouchableOpacity>
                )}

                {section.id === 'chezNous' && section.buttons && (
                    <View style={styles.dualButtonContainer}>
                        <TouchableOpacity
                            style={styles.dualButton}
                            onPress={handleChezNous}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={section.buttons[0].icon as any}
                                size={22}
                                color="#FFFFFF"
                                style={styles.sectionButtonIcon}
                            />
                            <Text style={styles.sectionButtonText}>
                                {section.buttons[0].text}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.dualButton}
                            onPress={handleChezNousDetails}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={section.buttons[1].icon as any}
                                size={22}
                                color="#FFFFFF"
                                style={styles.sectionButtonIcon}
                            />
                            <Text style={styles.sectionButtonText}>
                                {section.buttons[1].text}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadContent}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
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
                        <Text style={styles.heroTitle}>
                            {content.header.title || 'Get Connected'}
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            {content.header.subtitle || 'Join our community and stay connected'}
                        </Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <View style={styles.quickActionsRow}>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={handleSubscribe}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="mail"
                                size={24}
                                color={themeColors.primary}
                                style={styles.quickActionIconContainer}
                            />
                            <Text style={styles.quickActionText}>
                                {content.ui.quickActions.subscribe || 'Subscribe'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={handleVolunteer}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name="people"
                                size={24}
                                color={themeColors.primary}
                                style={styles.quickActionIconContainer}
                            />
                            <Text style={styles.quickActionText}>
                                {content.ui.quickActions.volunteer || 'Volunteer'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content Sections */}
                <View style={styles.sectionsContainer}>
                    {content.sections.map((section, index) => (
                        <View key={section.id} style={styles.sectionCard}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIconContainer}>
                                    <Ionicons
                                        name={section.icon as any}
                                        size={24}
                                        color="#FFFFFF"
                                    />
                                </View>
                                <Text style={styles.sectionTitle}>
                                    {section.title}
                                </Text>
                            </View>
                            {renderSectionContent(section)}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};