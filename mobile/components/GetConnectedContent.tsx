import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { getConnectedStyles } from '../styles/GetConnectedContent.styles';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS } from '../config/staticData';
import { contentService } from '../services/contentService';

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

    useEffect(() => {
        loadContent();
    }, []);

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

    const handleSubscribe = () => {
        Linking.openURL(STATIC_URLS.subscribe);
    };

    const handleVolunteer = () => {
        Linking.openURL(STATIC_URLS.volunteer);
    };

    const handlePrayerRequest = () => {
        Linking.openURL(STATIC_URLS.prayerRequest);
    };

    const handleChezNous = () => {
        Linking.openURL(STATIC_URLS.chezNous);
    };

    const handleChezNousDetails = () => {
        Linking.openURL(STATIC_URLS.chezNousDetails);
    };

    const handleSocialMedia = (url: string) => {
        Linking.openURL(url);
    };

    const handleEmail = () => {
        Linking.openURL('mailto:salut@egliselacite.com');
    };

    if (loading) {
        return (
            <View style={[getConnectedStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FF9843" />
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={[getConnectedStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#FF3B30' }}>{error || 'Content not available'}</Text>
                <TouchableOpacity
                    style={{ marginTop: 20, padding: 10, backgroundColor: '#FF9843', borderRadius: 8 }}
                    onPress={loadContent}
                >
                    <Text style={{ color: '#FFFFFF' }}>Retry</Text>
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

    return (
        <View style={getConnectedStyles.container}>
            <ScrollView
                style={getConnectedStyles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={getConnectedStyles.header}>
                    <Text style={getConnectedStyles.title}>
                        {content.header.title}
                    </Text>
                    <Text style={getConnectedStyles.subtitle}>
                        {content.header.subtitle}
                    </Text>
                </View>

                {content.sections.map((section, index) => (
                    <View key={section.id} style={getConnectedStyles.cardContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={getConnectedStyles.sectionTitle}>{section.title}</Text>
                        </View>
                        <Text style={getConnectedStyles.paragraph}>
                            {section.content}
                        </Text>

                        {section.button && (
                            <TouchableOpacity
                                style={getConnectedStyles.contactButton}
                                onPress={handleButtonAction(section.id)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Ionicons name={section.button.icon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                    <Text style={getConnectedStyles.buttonText}>
                                        {section.button.text}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {section.contact && section.contact.map((contactItem, contactIndex) => (
                            <React.Fragment key={`contact-${contactIndex}`}>
                                {contactIndex > 0 && <View style={{ marginTop: 10 }} />}
                                <TouchableOpacity
                                    style={getConnectedStyles.contactButton}
                                    onPress={handleContactAction(contactItem.type, contactItem.url)}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={contactItem.icon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={getConnectedStyles.buttonText}>
                                            {contactItem.value}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </React.Fragment>
                        ))}

                        {section.id === 'chezNous' && section.buttons && (
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                                <TouchableOpacity
                                    style={[getConnectedStyles.contactButton, { flex: 1, marginRight: 5 }]}
                                    onPress={handleChezNous}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={section.buttons[0].icon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={getConnectedStyles.buttonText}>
                                            {section.buttons[0].text}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[getConnectedStyles.contactButton, { flex: 1, marginLeft: 5 }]}
                                    onPress={handleChezNousDetails}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={section.buttons[1].icon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={getConnectedStyles.buttonText}>
                                            {section.buttons[1].text}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};