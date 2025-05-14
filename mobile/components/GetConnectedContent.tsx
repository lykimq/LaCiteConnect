import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS } from '../config/staticData';
import { contentService } from '../services/contentService';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createGetConnectedStyles } from '../styles/ThemedStyles';
import { openUrlWithCorrectDomain, openGenericUrl } from '../utils/urlUtils';
import { useLanguage } from '../contexts/LanguageContext';

// Define the get connected content interface
interface GetConnectedContent {
    header: {
        title: string;
        subtitle: string;
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

export const GetConnectedContent = () => {
    const [content, setContent] = useState<GetConnectedContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createGetConnectedStyles);
    const scrollViewRef = useRef<ScrollView>(null);
    const { currentLanguage } = useLanguage();

    useEffect(() => {
        loadContent();
    }, []);

    useEffect(() => {
        if (content) {
            const initialExpandedState: { [key: string]: boolean } = {};
            content.sections.forEach(section => {
                initialExpandedState[section.id] = false;
            });
            setExpandedSections(initialExpandedState);
        }
    }, [content]);

    const loadContent = async () => {
        try {
            setLoading(true);
            const response = await contentService.getContent<GetConnectedContent>('getConnected');

            if (response.success && response.data) {
                setContent(response.data);
            } else {
                setError(response.error || 'Failed to load content');
            }
        } catch (err) {
            console.error('Error loading get connected content:', err);
            setError('An error occurred while loading content');
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const newState = { ...prev, [sectionId]: !prev[sectionId] };

            // Scroll to the expanded section if it was expanded
            if (newState[sectionId] && scrollViewRef.current && content) {
                const sectionIndex = content.sections.findIndex(s => s.id === sectionId);
                if (sectionIndex !== -1) {
                    setTimeout(() => {
                        if (scrollViewRef.current) {
                            scrollViewRef.current.scrollTo({
                                y: sectionIndex * 150,
                                animated: true
                            });
                        }
                    }, 100);
                }
            }

            return newState;
        });
    };

    const handleSubscribe = () => {
        openUrlWithCorrectDomain(STATIC_URLS.subscribe, currentLanguage);
    };

    const handleVolunteer = () => {
        openUrlWithCorrectDomain(STATIC_URLS.volunteer, currentLanguage);
    };

    const handlePrayerRequest = () => {
        openUrlWithCorrectDomain(STATIC_URLS.prayerRequest, currentLanguage);
    };

    const handleChezNous = () => {
        openUrlWithCorrectDomain(STATIC_URLS.chezNous, currentLanguage);
    };

    const handleChezNousDetails = () => {
        openUrlWithCorrectDomain(STATIC_URLS.chezNousDetails, currentLanguage);
    };

    const handleSocialMedia = (url: string) => {
        openGenericUrl(url);
    };

    const handleEmail = () => {
        openGenericUrl('mailto:salut@egliselacite.com');
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.errorText}>{error || 'Content not available'}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadContent}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Helper function to handle button actions based on section ID
    const handleButtonAction = (sectionId: string) => {
        switch (sectionId) {
            case 'stayUpdated':
                return handleSubscribe;
            case 'getInvolved':
                return handleVolunteer;
            case 'prayerRequest':
                return handlePrayerRequest;
            default:
                return () => console.log(`No action defined for section: ${sectionId}`);
        }
    };

    // Helper function to handle contact item actions
    const handleContactAction = (contactType: string, url?: string) => {
        if (contactType === 'email') {
            return handleEmail;
        } else if (url) {
            return () => handleSocialMedia(url);
        }
        return () => console.log(`No action defined for contact type: ${contactType}`);
    };

    // Get appropriate icon for social media platform
    const getSocialMediaIcon = (type: string, icon: string) => {
        return icon as any; // Cast to any to avoid type errors with Ionicons
    };

    const renderSectionContent = (section: GetConnectedContent['sections'][0]) => {
        if (!expandedSections[section.id]) return null;

        return (
            <View>
                <Text style={styles.paragraph}>
                    {section.content}
                </Text>

                {section.button && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleButtonAction(section.id)}
                    >
                        <View style={styles.buttonContent}>
                            <Ionicons name={section.button.icon as any} size={22} color="#FFFFFF" style={{ marginRight: 10 }} />
                            <Text style={styles.buttonText}>
                                {section.button.text}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}

                {section.contact && (
                    <View style={styles.contactsContainer}>
                        {section.contact.map((contactItem, contactIndex) => (
                            <TouchableOpacity
                                key={`contact-${contactIndex}`}
                                style={styles.contactButton}
                                onPress={handleContactAction(contactItem.type, contactItem.url)}
                            >
                                <View style={styles.contactIconContainer}>
                                    <Ionicons
                                        name={getSocialMediaIcon(contactItem.type, contactItem.icon)}
                                        size={24}
                                        color="#FFFFFF"
                                    />
                                </View>
                                <Text style={styles.contactButtonText}>
                                    {contactItem.value}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {section.id === 'chezNous' && section.buttons && (
                    <View style={styles.dualButtonContainer}>
                        <TouchableOpacity
                            style={styles.dualButton}
                            onPress={handleChezNous}
                        >
                            <Ionicons name={section.buttons[0].icon as any} size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>
                                {section.buttons[0].text}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.dualButton}
                            onPress={handleChezNousDetails}
                        >
                            <Ionicons name={section.buttons[1].icon as any} size={22} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>
                                {section.buttons[1].text}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const renderSection = (section: GetConnectedContent['sections'][0], index: number) => {
        const isExpanded = expandedSections[section.id];

        return (
            <View key={section.id} style={styles.sectionCard}>
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => toggleSection(section.id)}
                    activeOpacity={0.6}
                >
                    <View style={styles.sectionIconContainer}>
                        <Ionicons name={section.icon as any} size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color={themeColors.text}
                        style={styles.expandIcon}
                    />
                </TouchableOpacity>
                {renderSectionContent(section)}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.header}>
                    <Ionicons name="link" size={60} color={themeColors.primary} />
                    <View style={styles.headerDivider} />
                    <Text style={styles.title}>
                        {content.header.title}
                    </Text>
                    <Text style={styles.subtitle}>
                        {content.header.subtitle}
                    </Text>
                </View>

                <View style={styles.sectionsContainer}>
                    {content.sections.map(renderSection)}
                </View>
            </ScrollView>
        </View>
    );
};