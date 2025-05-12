import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { STATIC_URLS } from '../config/staticData';
import { contentService } from '../services/contentService';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createHomeStyles } from '../styles/ThemedStyles';

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
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createHomeStyles);

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
                    if (section.id === 'sundayService') {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={styles.infoText}>
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
                    }
                    if (section.id === 'findUs') {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={styles.infoText}>
                                    {section.content}
                                </Text>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleFindUs}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={section.buttonIcon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={styles.buttonText}>
                                            {section.buttonText}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }
                    if (section.id === 'watchOnline') {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={styles.infoText}>
                                    {section.content}
                                </Text>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleWatchOnline}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name={section.buttonIcon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                        <Text style={styles.buttonText}>{section.buttonText}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }
                    if (section.subsections) {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <View>
                                    {section.subsections.map((subsection, subIndex) => (
                                        <View key={`${section.id}-sub-${subIndex}`} style={{ marginBottom: 20 }}>
                                            <Text style={styles.subsectionTitle}>
                                                {subsection.title}
                                            </Text>
                                            {subsection.text && (
                                                <Text style={styles.infoText}>
                                                    {subsection.text}
                                                </Text>
                                            )}
                                            {subsection.items && subsection.items.map((item, itemIndex) => (
                                                <View key={`item-${itemIndex}`} style={styles.itemRow}>
                                                    <Ionicons
                                                        name={(subsection.itemIcons?.[itemIndex] || subsection.itemIcon || 'checkmark-circle') as any}
                                                        size={20}
                                                        color={themeColors.primary}
                                                        style={{ marginRight: 8 }}
                                                    />
                                                    <Text style={styles.infoText}>{item}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    } else {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Ionicons name={section.icon as any} size={24} color={themeColors.primary} style={{ marginRight: 10 }} />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={styles.infoText}>
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