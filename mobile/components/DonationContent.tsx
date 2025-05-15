import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Clipboard, ActivityIndicator, ToastAndroid, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS } from '../config/staticData';
import { contentService } from '../services/contentService';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createDonationStyles } from '../styles/ThemedStyles';

// Define the donation content interface
interface DonationContent {
    header: {
        title: string;
        subtitle: string;
    };
    sections: Array<{
        id: string;
        title: string;
        description?: string;
        content?: string;
        buttons?: Array<{
            text: string;
            icon: string;
        }>;
        details?: {
            accountName: string;
            iban: string;
            bic: string;
        };
        labels?: {
            accountName: string;
            iban: string;
            bic: string;
        };
    }>;
}

export const DonationContent = () => {
    const [content, setContent] = useState<DonationContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createDonationStyles);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            setLoading(true);
            const response = await contentService.getContent<DonationContent>('donation');

            if (response.success && response.data) {
                setContent(response.data);
            } else {
                setError(response.error || 'Failed to load content');
            }
        } catch (err) {
            console.error('Error loading donation content:', err);
            setError('An error occurred while loading content');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyToClipboard = (text: string, label: string) => {
        Clipboard.setString(text);
        setCopiedText(text);

        // Show toast notification
        if (Platform.OS === 'android') {
            ToastAndroid.show(`${label} copied to clipboard`, ToastAndroid.SHORT);
        } else {
            Alert.alert('Copied', `${label} copied to clipboard`);
        }

        // Reset copied text after 3 seconds
        setTimeout(() => {
            setCopiedText(null);
        }, 3000);
    };

    const handleOpenLink = (url: string) => {
        Linking.openURL(url);
    };

    const handleDonate = () => {
        handleOpenLink(STATIC_URLS.donate.mission);
    };

    // Helper function to get the appropriate URL for donation buttons
    const getDonationUrl = (buttonIndex: number) => {
        if (buttonIndex === 0) {
            return STATIC_URLS.donate.mission;
        } else {
            return STATIC_URLS.donate.building;
        }
    };

    // Helper function to get icon for each fund type
    const getFundIcon = (sectionId: string) => {
        switch (sectionId) {
            case 'missionFund':
                return 'heart-circle-outline';
            case 'buildingFund':
                return 'business-outline';
            case 'lesMainsTendues':
                return 'hand-left-outline';
            default:
                return 'cash-outline';
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle" size={48} color={themeColors.error} style={{ marginBottom: 16 }} />
                <Text style={{ color: themeColors.error, fontSize: 16, marginBottom: 20 }}>
                    {error || 'Content not available'}
                </Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: themeColors.primary,
                        padding: 12,
                        borderRadius: 8,
                    }}
                    onPress={loadContent}
                >
                    <Text style={{ color: '#FFFFFF', fontSize: 16 }}>
                        Retry
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>{content.header.title}</Text>
                        <Text style={styles.heroSubtitle}>{content.header.subtitle}</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                {content.sections.find(section => section.id === 'quickDonation')?.buttons && (
                    <View style={styles.quickActionsContainer}>
                        <View style={styles.quickActionsRow}>
                            {content.sections
                                .find(section => section.id === 'quickDonation')
                                ?.buttons?.map((button, buttonIndex) => (
                                    <TouchableOpacity
                                        key={`button-${buttonIndex}`}
                                        style={styles.quickActionButton}
                                        onPress={() => handleOpenLink(getDonationUrl(buttonIndex))}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={button.icon as any}
                                            size={28}
                                            color={themeColors.primary}
                                            style={styles.quickActionIcon}
                                        />
                                        <Text style={styles.quickActionText}>{button.text}</Text>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    </View>
                )}

                {/* Thank You Section */}
                {content.sections.find(section => section.id === 'thankYou') && (
                    <View style={styles.cardContainer}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="heart-circle" size={24} color={themeColors.primary} style={styles.cardHeaderIcon} />
                            <Text style={styles.sectionTitle}>
                                {content.sections.find(section => section.id === 'thankYou')?.title}
                            </Text>
                        </View>
                        <Text style={styles.paragraph}>
                            {content.sections.find(section => section.id === 'thankYou')?.content}
                        </Text>
                    </View>
                )}

                {/* Bank Details Sections */}
                {content.sections
                    .filter(section => section.id !== 'quickDonation' && section.id !== 'thankYou')
                    .map((section, index) => {
                        if (section.details && section.labels) {
                            // Ensure section.details is defined before accessing its properties
                            const accountName = section.details?.accountName || '';
                            const iban = section.details?.iban || '';
                            const bic = section.details?.bic || '';
                            const icon = getFundIcon(section.id);

                            return (
                                <View key={section.id} style={styles.cardContainer}>
                                    <View style={styles.cardHeader}>
                                        <Ionicons name={icon as any} size={24} color={themeColors.primary} style={styles.cardHeaderIcon} />
                                        <Text style={styles.sectionTitle}>{section.title}</Text>
                                    </View>

                                    <Text style={styles.paragraph}>
                                        {section.description}
                                    </Text>

                                    <View style={styles.bankDetailsContainer}>
                                        <View style={styles.bankDetailRow}>
                                            <Text style={styles.bankDetailLabel}>{section.labels.accountName}</Text>
                                            <TouchableOpacity
                                                style={styles.bankDetailValueContainer}
                                                onPress={() => handleCopyToClipboard(accountName, 'Account name')}
                                                activeOpacity={0.6}
                                            >
                                                <Text style={styles.bankDetailValue}>{accountName}</Text>
                                                <Ionicons
                                                    name={copiedText === accountName ? "checkmark" : "copy-outline"}
                                                    size={20}
                                                    color={copiedText === accountName ? "#4CAF50" : themeColors.primary}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.bankDetailRow}>
                                            <Text style={styles.bankDetailLabel}>{section.labels.iban}</Text>
                                            <TouchableOpacity
                                                style={styles.bankDetailValueContainer}
                                                onPress={() => handleCopyToClipboard(iban, 'IBAN')}
                                                activeOpacity={0.6}
                                            >
                                                <Text style={styles.bankDetailValue}>{iban}</Text>
                                                <Ionicons
                                                    name={copiedText === iban ? "checkmark" : "copy-outline"}
                                                    size={20}
                                                    color={copiedText === iban ? "#4CAF50" : themeColors.primary}
                                                />
                                            </TouchableOpacity>
                                        </View>

                                        <View style={[styles.bankDetailRow, { marginBottom: 0, paddingBottom: 0, borderBottomWidth: 0 }]}>
                                            <Text style={styles.bankDetailLabel}>{section.labels.bic}</Text>
                                            <TouchableOpacity
                                                style={styles.bankDetailValueContainer}
                                                onPress={() => handleCopyToClipboard(bic, 'BIC/SWIFT')}
                                                activeOpacity={0.6}
                                            >
                                                <Text style={styles.bankDetailValue}>{bic}</Text>
                                                <Ionicons
                                                    name={copiedText === bic ? "checkmark" : "copy-outline"}
                                                    size={20}
                                                    color={copiedText === bic ? "#4CAF50" : themeColors.primary}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        }
                        return null;
                    })}
            </ScrollView>

            {/* Floating Action Button for Donations */}
            <TouchableOpacity style={styles.fab} onPress={handleDonate}>
                <Ionicons name="heart" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};