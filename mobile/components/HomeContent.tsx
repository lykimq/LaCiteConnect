import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Dimensions, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { STATIC_URLS, CHURCH_INFO } from '../config/staticData';
import { contentService } from '../services/contentService';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createHomeStyles } from '../styles/ThemedStyles';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');

// Define the section interface
interface Section {
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
}

// Define the home content interface
interface HomeContent {
    header: {
        title: string;
        subtitle: string;
    };
    sections: Section[];
}

// Skeleton loading component
const HomeContentSkeleton = () => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createHomeStyles);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                {/* Header skeleton */}
                <View style={styles.heroSection}>
                    <View style={[styles.skeletonBox, { width: '70%', height: 30, marginBottom: 8 }]} />
                    <View style={[styles.skeletonBox, { width: '90%', height: 16, marginBottom: 24 }]} />
                </View>

                {/* Feature grid skeleton */}
                <View style={styles.featureGridContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[styles.featureCard, styles.skeletonContainer]}>
                            <View style={[styles.featureIconContainer, styles.skeletonCircle]} />
                            <View style={[styles.skeletonBox, { width: '60%', height: 14 }]} />
                        </View>
                        <View style={[styles.featureCard, styles.skeletonContainer]}>
                            <View style={[styles.featureIconContainer, styles.skeletonCircle]} />
                            <View style={[styles.skeletonBox, { width: '60%', height: 14 }]} />
                        </View>
                    </View>
                </View>

                {/* Card skeletons */}
                {[1, 2].map((item) => (
                    <View key={`skeleton-${item}`} style={[styles.cardContainer, styles.skeletonContainer]}>
                        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
                            <View style={[styles.skeletonCircle, { width: 24, height: 24, marginRight: 10 }]} />
                            <View style={[styles.skeletonBox, { width: '60%', height: 22 }]} />
                        </View>
                        <View style={[styles.skeletonBox, { width: '100%', height: 16, marginBottom: 8 }]} />
                        <View style={[styles.skeletonBox, { width: '90%', height: 16, marginBottom: 8 }]} />
                        <View style={[styles.skeletonBox, { width: '80%', height: 16 }]} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export const HomeContent = () => {
    const [content, setContent] = useState<HomeContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { themeColors, theme } = useTheme();
    const styles = useThemedStyles(createHomeStyles);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            if (!refreshing) setLoading(true);
            const response = await contentService.getContent<HomeContent>('home');

            if (response.success && response.data) {
                setContent(response.data);
                setError(null);
            } else {
                setError(response.error || 'Failed to load content');
            }
        } catch (err) {
            console.error('Error loading home content:', err);
            setError('An error occurred while loading content');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setError(null);
        loadContent();
    }, []);

    const handleFindUs = () => {
        Linking.openURL(STATIC_URLS.location);
    };

    const handleWatchOnline = () => {
        Linking.openURL(STATIC_URLS.youtubeDirectLink);
    };

    // Display skeleton loading UI
    if (loading && !refreshing) {
        return <HomeContentSkeleton />;
    }

    if (error && !content) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Ionicons
                    name="alert-circle"
                    size={48}
                    color={themeColors.error || '#FF3B30'}
                    style={{ marginBottom: 16 }}
                />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadContent}
                    activeOpacity={0.7}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!content) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    // Feature cards for grid layout
    const renderFeatureCard = ({ item: section }: { item: Section }) => {
        const { id, icon, title } = section;

        // Select the right action based on section id
        const handlePress = () => {
            if (id === 'findUs') {
                handleFindUs();
            } else if (id === 'watchOnline') {
                handleWatchOnline();
            }
        };

        return (
            <TouchableOpacity
                style={styles.featureCard}
                onPress={handlePress}
                activeOpacity={0.7}
            >
                <View style={styles.featureIconContainer}>
                    <Ionicons
                        name={icon as any}
                        size={28}
                        color={themeColors.primary}
                    />
                </View>
                <Text style={styles.featureTitle}>{title}</Text>
            </TouchableOpacity>
        );
    };

    // Filter sections to show in the feature grid
    const featureSections = content.sections.filter(
        section => section.id === 'findUs' || section.id === 'watchOnline'
    );

    // Get sections that should be displayed as full cards
    const cardSections = content.sections.filter(
        section => section.id !== 'findUs' && section.id !== 'watchOnline'
    );

    // Helper function to render address with clickable link
    const renderAddressWithLink = (text: string) => {
        if (text.includes('24 Rue Antoine-Julien Hénard')) {
            const addressText = CHURCH_INFO.address;
            const parts = text.split(addressText);

            if (parts.length === 1) {
                // Try with just the street name in case the full address isn't in the text
                const streetPart = '24 Rue Antoine-Julien Hénard';
                const streetParts = text.split(streetPart);

                if (streetParts.length > 1) {
                    return (
                        <>
                            {streetParts[0]}
                            <Text
                                style={[styles.infoText, { color: themeColors.primary, textDecorationLine: 'underline' }]}
                                onPress={handleFindUs}
                            >
                                {addressText}
                            </Text>
                            {streetParts[1]}
                        </>
                    );
                }
            }

            return (
                <>
                    {parts[0]}
                    <Text
                        style={[styles.infoText, { color: themeColors.primary, textDecorationLine: 'underline' }]}
                        onPress={handleFindUs}
                    >
                        {addressText}
                    </Text>
                    {parts.length > 1 ? parts[1] : ''}
                </>
            );
        }
        return text;
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[themeColors.primary]}
                        tintColor={themeColors.primary}
                    />
                }
            >
                <View style={styles.heroSection}>
                    <Text style={styles.title}>
                        {content.header.title}
                    </Text>
                    <Text style={styles.subtitle}>
                        {content.header.subtitle}
                    </Text>
                </View>

                {/* Feature Grid for Quick Access */}
                <View style={styles.featureGridContainer}>
                    <FlatList
                        data={featureSections}
                        renderItem={renderFeatureCard}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={styles.featureRow}
                        scrollEnabled={false}
                    />
                </View>

                {/* Main Content Cards */}
                {cardSections.map((section) => {
                    if (section.id === 'sundayService') {
                        return (
                            <View key={section.id} style={styles.streamCardContainer}>
                                <View style={styles.sectionHeaderRow}>
                                    <Ionicons
                                        name={section.icon as any}
                                        size={24}
                                        color={themeColors.primary}
                                        style={styles.sectionHeaderIcon}
                                    />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={styles.infoText}>
                                    {section.content}
                                </Text>
                                <TouchableOpacity
                                    style={styles.videoContainer}
                                    onPress={handleWatchOnline}
                                    activeOpacity={0.9}
                                >
                                    <WebView
                                        source={{ uri: STATIC_URLS.youtube }}
                                        style={styles.videoWebView}
                                        allowsFullscreenVideo={true}
                                        javaScriptEnabled={true}
                                        domStorageEnabled={true}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    if (section.id === 'joinUs') {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <View style={styles.sectionHeaderRow}>
                                    <Ionicons
                                        name={section.icon as any}
                                        size={24}
                                        color={themeColors.primary}
                                        style={styles.sectionHeaderIcon}
                                    />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={styles.infoText}>
                                    {renderAddressWithLink(section.content)}
                                </Text>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleFindUs}
                                    activeOpacity={0.7}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons
                                            name={(section.buttonIcon || 'map') as any}
                                            size={20}
                                            color="#FFFFFF"
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text style={styles.buttonText}>
                                            {CHURCH_INFO.address}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    if (section.id === 'joinOnline') {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <View style={styles.sectionHeaderRow}>
                                    <Ionicons
                                        name={section.icon as any}
                                        size={24}
                                        color={themeColors.primary}
                                        style={styles.sectionHeaderIcon}
                                    />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={styles.infoText}>
                                    {section.content}
                                </Text>

                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleWatchOnline}
                                    activeOpacity={0.7}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons
                                            name={(section.buttonIcon || 'videocam') as any}
                                            size={20}
                                            color="#FFFFFF"
                                            style={{ marginRight: 8 }}
                                        />
                                        <Text style={styles.buttonText}>
                                            {section.buttonText || "Watch Live Stream"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }

                    if (section.subsections) {
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <View style={styles.sectionHeaderRow}>
                                    <Ionicons
                                        name={section.icon as any}
                                        size={24}
                                        color={themeColors.primary}
                                        style={styles.sectionHeaderIcon}
                                    />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <View>
                                    {section.subsections.map((subsection, subIndex) => (
                                        <View key={`${section.id}-sub-${subIndex}`} style={styles.subsectionContainer}>
                                            <Text style={styles.subsectionTitle}>
                                                {subsection.title}
                                            </Text>
                                            {subsection.text && (
                                                <Text style={styles.infoText}>
                                                    {renderAddressWithLink(subsection.text)}
                                                </Text>
                                            )}
                                            {subsection.items && subsection.items.map((item, itemIndex) => (
                                                <View key={`item-${itemIndex}`} style={styles.itemRow}>
                                                    <Ionicons
                                                        name={(subsection.itemIcons?.[itemIndex] || subsection.itemIcon || 'checkmark-circle') as any}
                                                        size={20}
                                                        color={themeColors.primary}
                                                        style={styles.itemIcon}
                                                    />
                                                    <Text style={[styles.infoText, { marginBottom: 0, flex: 1 }]}>
                                                        {renderAddressWithLink(item)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        );
                    } else {
                        // Render standard content card
                        return (
                            <View key={section.id} style={styles.cardContainer}>
                                <View style={styles.sectionHeaderRow}>
                                    <Ionicons
                                        name={section.icon as any}
                                        size={24}
                                        color={themeColors.primary}
                                        style={styles.sectionHeaderIcon}
                                    />
                                    <Text style={styles.sectionTitle}>{section.title}</Text>
                                </View>
                                <Text style={styles.infoText}>
                                    {renderAddressWithLink(section.content)}
                                </Text>

                                {section.buttonText && (
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={section.id === 'findUs' ? handleFindUs : section.id === 'watchOnline' ? handleWatchOnline : undefined}
                                        activeOpacity={0.7}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            {section.buttonIcon && (
                                                <Ionicons
                                                    name={section.buttonIcon as any}
                                                    size={20}
                                                    color="#FFFFFF"
                                                    style={{ marginRight: 8 }}
                                                />
                                            )}
                                            <Text style={styles.buttonText}>{section.buttonText}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    }
                })}
            </ScrollView>
        </View>
    );
};