import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Dimensions, ActivityIndicator } from 'react-native';
import { homeStyles } from '../styles/HomeContent.styles';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { STATIC_URLS } from '../config/staticData';
import { contentService } from '../services/contentService';

const { width } = Dimensions.get('window');

// Define the home content interface
interface HomeContent {
    header: {
        title: string;
        subtitle: string;
    };
    sections: {
        id: string;
        icon: string;
        title: string;
        content: string;
        buttonText?: string;
        buttonIcon?: string;
        subsections?: Array<{
            title: string;
            text?: string;
            items?: string[];
            itemIcon?: string;
            itemIcons?: string[];
        }>;
    }[];
}

export const HomeContent = () => {
    const [content, setContent] = useState<HomeContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            setLoading(true);
            const response = await contentService.getContent<HomeContent>('home');

            if (response.success && response.data) {
                setContent(response.data);
            } else {
                setError(response.error || 'Failed to load content');
            }
        } catch (err) {
            console.error('Error loading home content:', err);
            setError('An error occurred while loading content');
        } finally {
            setLoading(false);
        }
    };

    const handleFindUs = () => {
        Linking.openURL(STATIC_URLS.location);
    };

    const handleWatchOnline = () => {
        Linking.openURL(STATIC_URLS.youtube);
    };

    if (loading) {
        return (
            <View style={[homeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FF9843" />
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={[homeStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
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

    return (
        <View style={homeStyles.container}>
            <ScrollView
                style={homeStyles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={homeStyles.header}>
                    <Text style={homeStyles.title}>
                        {content.header.title}
                    </Text>
                    <Text style={homeStyles.subtitle}>
                        {content.header.subtitle}
                    </Text>
                </View>

                {content.sections.map((section, index) => {
                    if (section.id === 'sundayService') {
                        return (
                            <View key={section.id} style={homeStyles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                                    <Text style={homeStyles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={homeStyles.infoText}>
                                    {section.content}
                                </Text>
                                <View style={{
                                    marginTop: 15,
                                    width: '100%',
                                    height: 200,
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    backgroundColor: '#000',
                                }}>
                                    <WebView
                                        source={{ uri: STATIC_URLS.youtube }}
                                        style={{ flex: 1, backgroundColor: '#000' }}
                                        allowsFullscreenVideo={true}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                    />
                                </View>
                            </View>
                        );
                    } else if (section.id === 'joinUs') {
                        return (
                            <View key={section.id} style={homeStyles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                                    <Text style={homeStyles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={homeStyles.infoText}>
                                    {section.content}
                                </Text>
                                <TouchableOpacity
                                    style={homeStyles.button}
                                    onPress={handleFindUs}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={section.buttonIcon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={homeStyles.buttonText}>
                                            {section.buttonText}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    } else if (section.id === 'joinOnline') {
                        return (
                            <View key={section.id} style={homeStyles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                                    <Text style={homeStyles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={homeStyles.infoText}>
                                    {section.content}
                                </Text>
                                <TouchableOpacity
                                    style={homeStyles.button}
                                    onPress={handleWatchOnline}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={section.buttonIcon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={homeStyles.buttonText}>{section.buttonText}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    } else if (section.id === 'information' && section.subsections) {
                        return (
                            <View key={section.id} style={homeStyles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                                    <Text style={homeStyles.sectionTitle}>{section.title}</Text>
                                </View>
                                <View>
                                    {section.subsections.map((subsection, subIndex) => (
                                        <View key={`${section.id}-sub-${subIndex}`} style={{ marginBottom: 20 }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 10 }}>
                                                {subsection.title}
                                            </Text>
                                            {subsection.text && (
                                                <Text style={homeStyles.infoText}>
                                                    {subsection.text}
                                                </Text>
                                            )}
                                            {subsection.items && subsection.items.map((item, itemIndex) => (
                                                <View key={`item-${itemIndex}`} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                                    <Ionicons
                                                        name={(subsection.itemIcons?.[itemIndex] || subsection.itemIcon || 'checkmark-circle') as any}
                                                        size={20}
                                                        color="#FF9843"
                                                        style={{ marginRight: 8 }}
                                                    />
                                                    <Text style={homeStyles.infoText}>{item}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    } else {
                        return (
                            <View key={section.id} style={homeStyles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                                    <Text style={homeStyles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={homeStyles.infoText}>
                                    {section.content}
                                </Text>
                            </View>
                        );
                    }
                })}
            </ScrollView>
        </View>
    );
};