import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Clipboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS, BANK_DETAILS } from '../config/staticData';
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

    const handleCopyToClipboard = (text: string) => {
        Clipboard.setString(text);
        // You might want to add a toast notification here
    };

    const handleOpenLink = (url: string) => {
        Linking.openURL(url);
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
                <Text style={{ fontSize: 16, color: '#FF3B30' }}>{error || 'Content not available'}</Text>
                <TouchableOpacity
                    style={{
                        marginTop: 20,
                        padding: 10,
                        backgroundColor: themeColors.primary,
                        borderRadius: 8
                    }}
                    onPress={loadContent}
                >
                    <Text style={{ color: '#FFFFFF' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Helper function to get the appropriate URL for donation buttons
    const getDonationUrl = (buttonIndex: number) => {
        if (buttonIndex === 0) {
            return STATIC_URLS.donate.mission;
        } else {
            return STATIC_URLS.donate.building;
        }
    };

    // Helper function to get bank details based on section ID
    const getBankDetails = (sectionId: string) => {
        switch (sectionId) {
            case 'missionFund':
                return BANK_DETAILS.missionFund;
            case 'buildingFund':
                return BANK_DETAILS.buildingFund;
            case 'lesMainsTendues':
                return BANK_DETAILS.lesMainsTendues;
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {content.header.title}
                    </Text>
                    <Text style={styles.subtitle}>
                        {content.header.subtitle}
                    </Text>
                </View>

                {content.sections.map((section, index) => {
                    if (section.id === 'quickDonation') {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                                    {section.buttons?.map((button, buttonIndex) => (
                                        <TouchableOpacity
                                            key={`button-${buttonIndex}`}
                                            style={{
                                                backgroundColor: themeColors.primary,
                                                paddingVertical: 12,
                                                paddingHorizontal: 15,
                                                borderRadius: 8,
                                                flex: 1,
                                                marginHorizontal: 5,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                            onPress={() => handleOpenLink(getDonationUrl(buttonIndex))}
                                        >
                                            <Ionicons name={button.icon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                            <Text style={styles.buttonText}>{button.text}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        );
                    } else if (section.content) {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <Text style={styles.paragraph}>
                                    {section.content}
                                </Text>
                            </View>
                        );
                    } else if (section.details && section.labels) {
                        // Ensure section.details is defined before accessing its properties
                        const accountName = section.details?.accountName || '';
                        const iban = section.details?.iban || '';
                        const bic = section.details?.bic || '';

                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <Text style={styles.paragraph}>
                                    {section.description}
                                </Text>
                                <View style={{
                                    marginTop: 10,
                                    backgroundColor: themeColors.card,
                                    padding: 15,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: themeColors.border
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <Text style={{ fontSize: 14, color: themeColors.text, fontWeight: '500' }}>{section.labels.accountName}</Text>
                                        <TouchableOpacity onPress={() => handleCopyToClipboard(accountName)}>
                                            <Text style={{ fontSize: 14, color: themeColors.primary, fontWeight: '600' }}>{accountName}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <Text style={{ fontSize: 14, color: themeColors.text, fontWeight: '500' }}>{section.labels.iban}</Text>
                                        <TouchableOpacity onPress={() => handleCopyToClipboard(iban)}>
                                            <Text style={{ fontSize: 14, color: themeColors.primary, fontWeight: '600' }}>{iban}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 14, color: themeColors.text, fontWeight: '500' }}>{section.labels.bic}</Text>
                                        <TouchableOpacity onPress={() => handleCopyToClipboard(bic)}>
                                            <Text style={{ fontSize: 14, color: themeColors.primary, fontWeight: '600' }}>{bic}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        );
                    } else {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                {section.description && (
                                    <Text style={styles.paragraph}>
                                        {section.description}
                                    </Text>
                                )}
                            </View>
                        );
                    }
                })}
            </ScrollView>
        </View>
    );
};