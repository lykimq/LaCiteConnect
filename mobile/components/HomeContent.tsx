import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Dimensions, ActivityIndicator, FlatList, RefreshControl, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { STATIC_URLS, CHURCH_INFO } from '../config/staticData';
import { contentService } from '../services/contentService';
import { calendarService } from '../services/calendarService';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createHomeStyles } from '../styles/ThemedStyles';
import { openGenericUrl, openUrlWithCorrectDomain } from '../utils/urlUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { TabParamList } from '../navigation/AppNavigator';
import { formatDate, formatTime } from '../utils/dateUtils';

// Define the UI strings interface
interface UIStrings {
    quickActions: {
        watchLive: string;
        findUs: string;
    };
    liveStream: {
        title: string;
        watchNow: string;
        status: string;
        viewerCount: string;
        serviceTitle: string;
    };
    upcomingEvents: {
        title: string;
        seeAll: string;
        noEvents: string;
    };
    location: {
        title: string;
        getDirections: string;
    };
    loading: string;
    error: string;
    retry: string;
}

// Define the section interface
interface Section {
    id: string;
    icon: string;
    title: string;
    content?: string;
    buttonText?: string;
    buttonIcon?: string;
    times?: Array<{
        name: string;
        time: string;
        note?: string;
        icon: string;
    }>;
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
    ui: UIStrings;
    sections: Section[];
}

// Add CalendarEvent interface
interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    location?: string;
}

// Add a new section for service times
const ServiceTimesSection = ({ styles, themeColors, content }: { styles: any; themeColors: any; content: any }) => {
    const serviceTimesSection = content?.sections.find((section: any) => section.id === 'serviceTimes');
    if (!serviceTimesSection) return null;

    return (
        <View style={styles.sectionContainer}>
            <View style={[styles.serviceTimesCard, { overflow: 'hidden' }]}>
                {/* Header with gradient background */}
                <View style={styles.serviceTimesHeader}>
                    <View style={styles.serviceTimesHeaderContent}>
                        <Ionicons name={serviceTimesSection.icon} size={24} color={themeColors.primary} />
                        <Text style={styles.serviceTimesTitle}>{serviceTimesSection.title}</Text>
                    </View>
                </View>

                {/* Service times list */}
                <View style={styles.serviceTimesList}>
                    {serviceTimesSection.times.map((service: any, index: number) => (
                        <React.Fragment key={service.name}>
                            <View style={styles.serviceTimeItem}>
                                {/* Left side - Icon */}
                                <View style={styles.serviceTimeIconContainer}>
                                    <Ionicons name={service.icon} size={24} color={themeColors.primary} />
                                </View>

                                {/* Right side - Content */}
                                <View style={styles.serviceTimeContent}>
                                    <Text style={styles.serviceTimeName}>{service.name}</Text>
                                    <View style={styles.serviceTimeRow}>
                                        <Ionicons name="time-outline" size={16} color={themeColors.text} style={styles.timeIcon} />
                                        <Text style={styles.serviceTimeDetails}>{service.time}</Text>
                                    </View>
                                    {service.note && (
                                        <View style={styles.serviceNoteContainer}>
                                            <Text style={styles.serviceTimeNote}>{service.note}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            {index < serviceTimesSection.times.length - 1 && (
                                <View style={styles.serviceTimeDivider} />
                            )}
                        </React.Fragment>
                    ))}
                </View>
            </View>
        </View>
    );
};

export const HomeContent = () => {
    const [content, setContent] = useState<HomeContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
    const { themeColors, theme } = useTheme();
    const styles = useThemedStyles(createHomeStyles);
    const { currentLanguage } = useLanguage();
    const navigation = useNavigation<NavigationProp<TabParamList>>();

    useEffect(() => {
        loadContent();
        loadTodayEvents();
    }, []);

    // Add language change effect
    useEffect(() => {
        calendarService.updateLanguage(currentLanguage)
            .then(() => loadTodayEvents())
            .catch(err => console.error('Error updating calendar language:', err));
    }, [currentLanguage]);

    const loadTodayEvents = async () => {
        try {
            setLoadingEvents(true);
            const events = await calendarService.getEvents();

            // Filter for today's events
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todaysEvents = events.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate >= today && eventDate < tomorrow;
            });

            setTodayEvents(todaysEvents);
        } catch (err) {
            console.error('Error loading events:', err);
        } finally {
            setLoadingEvents(false);
        }
    };

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
        openUrlWithCorrectDomain(STATIC_URLS.location, currentLanguage);
    };

    const handleWatchOnline = () => {
        openUrlWithCorrectDomain(STATIC_URLS.youtubeDirectLink, currentLanguage);
    };

    const handleDonate = () => {
        openUrlWithCorrectDomain(STATIC_URLS.donate.mission, currentLanguage);
    };

    const handleOpenLocation = (location: string) => {
        const encodedLocation = encodeURIComponent(location);
        const mapsUrl = Platform.select({
            ios: `maps://maps.apple.com/?q=${encodedLocation}`,
            android: `geo:0,0?q=${encodedLocation}`,
            default: `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`
        });
        Linking.openURL(mapsUrl);
    };

    // Add styles for service times
    const additionalStyles = StyleSheet.create({
        serviceTimesCard: {
            backgroundColor: themeColors.card,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderWidth: 1,
            borderColor: themeColors.border,
        },
        serviceTimesHeader: {
            backgroundColor: themeColors.primary + '10',
            paddingVertical: 16,
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.border,
        },
        serviceTimesHeaderContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        serviceTimesTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: themeColors.text,
            marginLeft: 12,
        },
        serviceTimesList: {
            padding: 16,
        },
        serviceTimeItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingVertical: 12,
        },
        serviceTimeIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: themeColors.primary + '15',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
        },
        serviceTimeContent: {
            flex: 1,
            justifyContent: 'center',
        },
        serviceTimeName: {
            fontSize: 18,
            fontWeight: '600',
            color: themeColors.text,
            marginBottom: 6,
        },
        serviceTimeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
        },
        timeIcon: {
            marginRight: 6,
        },
        serviceTimeDetails: {
            fontSize: 16,
            color: themeColors.text,
            opacity: 0.8,
        },
        serviceNoteContainer: {
            backgroundColor: themeColors.primary + '10',
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 12,
            alignSelf: 'flex-start',
            marginTop: 6,
        },
        serviceTimeNote: {
            fontSize: 13,
            color: themeColors.primary,
            fontWeight: '500',
        },
        serviceTimeDivider: {
            height: 1,
            backgroundColor: themeColors.border,
            opacity: 0.5,
            marginHorizontal: 16,
        },
    });

    // Combine styles
    const combinedStyles = {
        ...styles,
        ...additionalStyles,
    };

    const renderEventCard = (event: CalendarEvent) => {
        const eventDate = new Date(event.start.dateTime || event.start.date || '');

        return (
            <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventDate}>
                    <Text style={styles.eventDay}>{eventDate.getDate()}</Text>
                    <Text style={styles.eventMonth}>
                        {eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.summary}
                    </Text>
                    <Text style={styles.eventTime}>
                        {event.start.dateTime ? formatTime(eventDate) : 'All Day'}
                    </Text>
                    {event.location && (
                        <TouchableOpacity
                            style={styles.eventLocation}
                            onPress={() => handleOpenLocation(event.location || '')}
                        >
                            <Ionicons name="location-outline" size={14} color={themeColors.primary} />
                            <Text style={[styles.eventLocationText, { color: themeColors.primary }]} numberOfLines={1}>
                                {event.location}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
                {content?.ui?.loading && (
                    <Text style={{ color: themeColors.text, marginTop: 10 }}>{content.ui.loading}</Text>
                )}
            </View>
        );
    }

    if (error && !content) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle" size={48} color={themeColors.error} style={{ marginBottom: 16 }} />
                <Text style={{ color: themeColors.error, fontSize: 16, marginBottom: 20 }}>
                    {error}
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
        <View style={combinedStyles.container}>
            <ScrollView
                style={styles.scrollView}
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
                        <Text style={styles.heroTitle}>{content?.header?.title || ''}</Text>
                        <Text style={styles.heroSubtitle}>{content?.header?.subtitle || ''}</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <View style={styles.quickActionsRow}>
                        <TouchableOpacity style={styles.quickActionButton} onPress={handleWatchOnline}>
                            <Ionicons
                                name="videocam"
                                size={24}
                                color={themeColors.primary}
                                style={styles.quickActionIcon}
                            />
                            <Text style={styles.quickActionText}>
                                {content?.ui?.quickActions?.watchLive || 'Watch Live'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickActionButton} onPress={handleFindUs}>
                            <Ionicons
                                name="location"
                                size={24}
                                color={themeColors.primary}
                                style={styles.quickActionIcon}
                            />
                            <Text style={styles.quickActionText}>
                                {content?.ui?.quickActions?.findUs || 'Find Us'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Service Times Section */}
                <ServiceTimesSection styles={combinedStyles} themeColors={themeColors} content={content} />

                {/* Live Stream Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{content?.ui?.liveStream?.title || 'Live Stream'}</Text>
                        <TouchableOpacity style={styles.seeAllButton} onPress={handleWatchOnline}>
                            <Text style={styles.seeAllText}>{content?.ui?.liveStream?.watchNow || 'Watch Now'}</Text>
                            <Ionicons name="arrow-forward" size={16} color={themeColors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.liveStreamCard}>
                        <WebView
                            source={{ uri: STATIC_URLS.youtube }}
                            style={styles.liveStreamThumbnail}
                            allowsFullscreenVideo={true}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                        />
                        <View style={styles.liveStreamInfo}>
                            <Text style={styles.liveStreamTitle}>
                                {content?.ui?.liveStream?.serviceTitle || 'Sunday Service'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Upcoming Events Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>
                            {content?.ui?.upcomingEvents?.title || 'Upcoming Events'}
                        </Text>
                        <TouchableOpacity
                            style={styles.seeAllButton}
                            onPress={() => navigation.navigate('Events')}
                        >
                            <Text style={styles.seeAllText}>
                                {content?.ui?.upcomingEvents?.seeAll || 'See All'}
                            </Text>
                            <Ionicons name="arrow-forward" size={16} color={themeColors.primary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.upcomingEventsContainer}>
                        {loadingEvents ? (
                            <ActivityIndicator size="small" color={themeColors.primary} />
                        ) : todayEvents.length > 0 ? (
                            todayEvents.map(event => renderEventCard(event))
                        ) : (
                            <View style={styles.noEventsContainer}>
                                <Text style={styles.noEventsText}>
                                    {content?.ui?.upcomingEvents?.noEvents || 'No events scheduled for today'}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Location Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.locationSection}>
                        <View style={styles.locationHeader}>
                            <Ionicons name="location" size={24} color={themeColors.primary} />
                            <Text style={styles.locationTitle}>
                                {content?.ui?.location?.title || 'Visit Us'}
                            </Text>
                        </View>
                        <Text style={styles.locationAddress}>
                            {CHURCH_INFO.address}
                        </Text>
                        <TouchableOpacity style={styles.mapButton} onPress={handleFindUs}>
                            <Ionicons name="map" size={20} color="#FFFFFF" />
                            <Text style={styles.mapButtonText}>
                                {content?.ui?.location?.getDirections || 'Get Directions'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Floating Action Button for Donations */}
            <TouchableOpacity style={styles.fab} onPress={handleDonate}>
                <Ionicons name="heart" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};