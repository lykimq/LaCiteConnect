import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { calendarService } from '../services/calendarService';
import { contentService } from '../services/contentService';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createEventsStyles } from '../styles/events/EventsContent.styles';
import { useLanguage } from '../contexts/LanguageContext';
import { openUrlWithCorrectDomain } from '../utils/urlUtils';

// Import types from our modular structure
import { CalendarEvent, EventsContent as EventsContentType, FilterOptions } from './events/types';

// Import components from our modular structure
import { ListView } from './events/ListView';
import { QuickFilters, FilterModal } from './events/FilterComponents';
import { EventDetailsModal } from './events/EventDetailsModal';

// Import utilities from our modular structure
import { formatEventDate } from './events/eventUtils';

export const EventsContent: React.FC = () => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);
    const { currentLanguage } = useLanguage();

    // Track previous language to detect changes
    const prevLanguageRef = useRef(currentLanguage);

    // Content state
    const [content, setContent] = useState<EventsContentType | null>(null);
    const [contentLoading, setContentLoading] = useState<boolean>(true);
    const [contentError, setContentError] = useState<string | null>(null);

    // View state
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedQuickPeriod, setSelectedQuickPeriod] = useState<'all' | 'today' | 'tomorrow' | 'week' | 'month'>('all');

    // Events state
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Filter options state
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        category: 'upcoming',
        sortBy: 'date',
        sortOrder: 'asc',
        searchQuery: ''
    });

    // Enhanced filtering and sorting logic
    const filteredAndSortedEvents = useMemo(() => {
        const now = new Date();
        const thisWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        let filtered = events.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');

            // Category filtering
            switch (filterOptions.category) {
                case 'upcoming':
                    return eventDate >= now;
                case 'past':
                    return eventDate < now;
                case 'thisWeek':
                    return eventDate >= now && eventDate <= thisWeek;
                case 'thisMonth':
                    return eventDate >= now && eventDate <= thisMonth;
                default:
                    return true;
            }
        });

        // Search filtering
        if (filterOptions.searchQuery) {
            const query = filterOptions.searchQuery.toLowerCase();
            filtered = filtered.filter(event =>
                event.summary.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query) ||
                event.location?.toLowerCase().includes(query)
            );
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (filterOptions.sortBy) {
                case 'date':
                    aValue = new Date(a.start.dateTime || a.start.date || '').getTime();
                    bValue = new Date(b.start.dateTime || b.start.date || '').getTime();
                    break;
                case 'title':
                    aValue = a.summary.toLowerCase();
                    bValue = b.summary.toLowerCase();
                    break;
                default:
                    aValue = '';
                    bValue = '';
            }

            if (filterOptions.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [events, filterOptions]);

    // List view filtered events
    const listViewFilteredEvents = useMemo(() => {
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        switch (selectedQuickPeriod) {
            case 'today':
                return filteredAndSortedEvents.filter(event => {
                    const eventDate = new Date(event.start.dateTime || event.start.date || '');
                    return eventDate.toDateString() === today.toDateString();
                });
            case 'tomorrow':
                return filteredAndSortedEvents.filter(event => {
                    const eventDate = new Date(event.start.dateTime || event.start.date || '');
                    return eventDate.toDateString() === tomorrow.toDateString();
                });
            case 'week':
                return filteredAndSortedEvents.filter(event => {
                    const eventDate = new Date(event.start.dateTime || event.start.date || '');
                    return eventDate > today && eventDate <= nextWeek;
                });
            case 'month':
                return filteredAndSortedEvents.filter(event => {
                    const eventDate = new Date(event.start.dateTime || event.start.date || '');
                    return eventDate > today && eventDate <= nextMonth;
                });
            default:
                return filteredAndSortedEvents;
        }
    }, [filteredAndSortedEvents, selectedQuickPeriod]);

    // Effect to handle language changes
    useEffect(() => {
        // Check if language has changed
        if (prevLanguageRef.current !== currentLanguage) {
            // Update the reference immediately to prevent multiple triggers
            prevLanguageRef.current = currentLanguage;

            // Set loading states
            setContentLoading(true);
            setLoading(true);

            // First update calendar service language
            calendarService.updateLanguage(currentLanguage)
                // Then load content
                .then(() => loadContent())
                // Then fetch events with updated language
                .then(() => fetchEvents())
                .catch(error => {
                    console.error('[EventsContent] Error during language change sequence:', error);
                    setError('Failed to update content after language change');
                })
                .finally(() => {
                    setContentLoading(false);
                    setLoading(false);
                });
        }
    }, [currentLanguage]);

    // Load initial data
    useEffect(() => {
        // Set initial loading states
        setContentLoading(true);
        setLoading(true);

        // Initialize calendar service with current language
        calendarService.updateLanguage(currentLanguage)
            // Then load content
            .then(() => loadContent())
            // Then fetch events
            .then(() => fetchEvents())
            .catch(error => {
                console.error('[EventsContent] Error during initial load:', error);
                setError('Failed to load initial content');
            })
            .finally(() => {
                setContentLoading(false);
                setLoading(false);
            });
    }, []); // Empty dependency array for initial load only

    const loadContent = async () => {
        try {
            console.log('[EventsContent] Loading content...');
            const response = await contentService.getContent<EventsContentType>('events');

            if (response.success && response.data) {
                setContent(response.data);
                setContentError(null); // Clear any previous errors
                console.log('[EventsContent] Content loaded successfully');
                return true;
            } else {
                const error = response.error || 'Failed to load content';
                console.error('[EventsContent] Content load error:', error);
                setContentError(error);
                return Promise.reject(error);
            }
        } catch (err) {
            console.error('[EventsContent] Error loading content:', err);
            const error = 'An error occurred while loading content';
            setContentError(error);
            return Promise.reject(error);
        }
    };

    const fetchEvents = async () => {
        try {
            console.log('[EventsContent] Fetching events...');
            setError(null); // Clear any previous errors

            const data = await calendarService.getEvents();
            console.log('[EventsContent] Received events:', data?.length || 0);

            if (!data || !Array.isArray(data)) {
                throw new Error('Invalid events data received');
            }

            const eventsWithUniqueIds = data.map((event, index) => ({
                ...event,
                id: `${event.id}_${index}`
            }));

            setEvents(eventsWithUniqueIds);
            console.log('[EventsContent] Events set successfully');
        } catch (err) {
            console.error('[EventsContent] Error fetching events:', err);
            setError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Add debug logging for state changes
    useEffect(() => {
        console.log('[EventsContent] Content loading:', contentLoading);
        console.log('[EventsContent] Events loading:', loading);
        console.log('[EventsContent] Events count:', events.length);
        console.log('[EventsContent] Content error:', contentError);
        console.log('[EventsContent] Events error:', error);
    }, [contentLoading, loading, events.length, contentError, error]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchEvents();
    };

    const handleViewAttachment = (attachmentUrl: string) => {
        openUrlWithCorrectDomain(attachmentUrl, currentLanguage);
    };

    const handleOpenMap = (location: string) => {
        const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(location)}`;
        openUrlWithCorrectDomain(mapUrl, currentLanguage);
    };

    const handleAddToCalendar = (event: CalendarEvent) => {
        const url = calendarService.generateAddToCalendarUrl(event);
        openUrlWithCorrectDomain(url, currentLanguage);
    };

    const handleViewDetailUrl = (event: CalendarEvent) => {
        try {
            const detailUrl = calendarService.getEventDetailsUrl(event);

            if (detailUrl) {
                openUrlWithCorrectDomain(detailUrl, currentLanguage)
                    .catch(err => {
                        console.error(`Error opening URL:`, err);
                        // Fallback to default events page
                        const fallbackUrl = calendarService.getBaseUrl();
                        openUrlWithCorrectDomain(fallbackUrl, currentLanguage)
                            .catch(fallbackErr => {
                                console.error('Error opening fallback URL:', fallbackErr);
                                showErrorAlert();
                            });
                    });
            } else {
                // If no URL is returned, use the default events page
                const fallbackUrl = calendarService.getBaseUrl();
                openUrlWithCorrectDomain(fallbackUrl, currentLanguage)
                    .catch(fallbackErr => {
                        console.error('Error opening fallback URL:', fallbackErr);
                        showErrorAlert();
                    });
            }

            function showErrorAlert() {
                alert(content?.ui.viewDetailsText ? `${content.ui.viewDetailsText} - Error` : 'Could not open the event details. Please try again later.');
            }
        } catch (error) {
            console.error('Unexpected error in handleViewDetailUrl:', error);
            // Fallback to default events page
            const fallbackUrl = calendarService.getBaseUrl();
            openUrlWithCorrectDomain(fallbackUrl, currentLanguage)
                .catch(fallbackErr => {
                    console.error('Error opening fallback URL:', fallbackErr);
                    alert(content?.ui.viewDetailsText ? `${content.ui.viewDetailsText} - Error` : 'Could not open the event details. Please try again later.');
                });
        }
    };

    // Handle showing the full description in a modal
    const handleViewFullDescription = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowFullDescription(true);
    };

    // Helper function to format event dates
    const formatEventDateWithContent = (event: CalendarEvent): string => {
        return formatEventDate(
            event,
            content?.ui.allDayText || 'All Day',
            content?.ui.dateNotSpecifiedText || 'Date not specified'
        );
    };

    // Render loading state
    if (contentLoading || loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
                <Text style={styles.errorText}>
                    {content?.ui.loadingText || 'Loading events...'}
                </Text>
            </View>
        );
    }

    // Render error state
    if (contentError || error) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.errorText}>
                    {contentError || error || 'An error occurred'}
                </Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        if (contentError) {
                            loadContent();
                        } else {
                            fetchEvents();
                        }
                    }}
                >
                    <Text style={styles.buttonText}>
                        {content?.ui.tryAgainText || 'Try Again'}
                    </Text>
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
                            {content?.header?.title || 'Events'}
                        </Text>
                        <Text style={styles.heroSubtitle}>
                            {content?.header?.subtitle || 'Stay updated with our upcoming events'}
                        </Text>
                    </View>
                </View>

                {/* Quick Filters */}
                <QuickFilters
                    onShowFilterModal={() => setShowFilterModal(true)}
                    content={content}
                />

                {/* List View Content */}
                <View style={styles.viewContent}>
                    <ListView
                        events={listViewFilteredEvents}
                        content={content}
                        selectedQuickPeriod={selectedQuickPeriod}
                        setSelectedQuickPeriod={setSelectedQuickPeriod}
                        onViewFullDescription={handleViewFullDescription}
                        onAddToCalendar={handleAddToCalendar}
                        onViewDetailUrl={handleViewDetailUrl}
                        onOpenMap={handleOpenMap}
                    />
                </View>
            </ScrollView>

            {/* Filter Modal */}
            <FilterModal
                showFilterModal={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                filterOptions={filterOptions}
                onFilterChange={setFilterOptions}
                content={content}
            />

            {/* Full Description Modal */}
            <EventDetailsModal
                showFullDescription={showFullDescription}
                onClose={() => setShowFullDescription(false)}
                selectedEvent={selectedEvent}
                content={content}
                formatEventDate={formatEventDateWithContent}
                onAddToCalendar={handleAddToCalendar}
                onViewDetailUrl={handleViewDetailUrl}
                onOpenMap={handleOpenMap}
                onViewAttachment={handleViewAttachment}
            />
        </View>
    );
};