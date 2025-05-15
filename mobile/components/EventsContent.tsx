import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, RefreshControl, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatTime } from '../utils/dateUtils';
import { calendarService } from '../services/calendarService';
import { contentService } from '../services/contentService';
import { convertHtmlToFormattedText, extractAttachmentLinks, parseLocationString } from '../utils/htmlUtils';
import WebView from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createEventsStyles } from '../styles/ThemedStyles';
import { useLanguage } from '../contexts/LanguageContext';
import { openUrlWithCorrectDomain } from '../utils/urlUtils';
import { StatusBar } from 'expo-status-bar';

// Helper function that uses our centralized URL handling utility
const openUrlWithLanguageCheck = (url: string, language: string) => {
    return openUrlWithCorrectDomain(url, language);
};

// View modes
type ViewMode = 'calendar' | 'list' | 'timeline';

// Add new types for sorting and filtering
type SortOrder = 'asc' | 'desc';
type EventCategory = 'all' | 'upcoming' | 'past' | 'thisWeek' | 'thisMonth';
type SortBy = 'date' | 'title' | 'location';

interface FilterOptions {
    category: EventCategory;
    sortBy: SortBy;
    sortOrder: SortOrder;
    searchQuery: string;
}

// Event interface
interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    formattedDescription?: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
    location?: string;
    formattedLocation?: {
        address: string;
        mapUrl?: string;
    };
    recurrence?: boolean;
    attachments?: Array<{ title: string, url: string }>;
    reminderSet?: boolean;
    detailsUrl?: string;
}

// Events content interface from JSON
interface EventsContent {
    header: {
        title: string;
        subtitle: string;
    };
    tabs: Array<{
        id: string;
        label: string;
    }>;
    ui: {
        loadingText: string;
        errorText: string;
        calendarErrorText: string;
        noEventsText: string;
        addToCalendarText: string;
        viewOnMapText: string;
        setReminderText: string;
        reminderSetText: string;
        viewFullDescriptionText: string;
        viewAttachmentText: string;
        openInBrowserText: string;
        dateNotSpecifiedText: string;
        allDayText: string;
        viewAllEventsText: string;
        locationText: string;
        directionsText: string;
        readMoreText: string;
        viewLocationText: string;
        viewFilesText: string;
        viewDetailsText: string;
        closeText: string;
        eventAddedText: string;
        refreshEventsText: string;
        tryAgainText: string;
        openCalendarText: string;
        calendarViewText: string;
        listViewText: string;
        timelineViewText: string;
        filterText: string;
        todayText: string;
        upcomingText: string;
        pastText: string;
        allText: string;
        filterModalTitle: string;
        searchPlaceholder: string;
        filterSectionTitle: string;
        filterOptions: {
            allEvents: string;
            upcoming: string;
            thisWeek: string;
            thisMonth: string;
            pastEvents: string;
        };
        sortSectionTitle: string;
        sortByLabel: string;
        sortOptions: {
            date: string;
            title: string;
            location: string;
        };
        sortOrderLabel: string;
        applyFiltersText: string;
        quickViewText: string;
        monthViewText: string;
        quickPeriodOptions: {
            allEvents: string;
            today: string;
            tomorrow: string;
            nextSevenDays: string;
            nextThirtyDays: string;
        };
        featuredView: {
            todayTitle: string;
            tomorrowTitle: string;
            nextSevenDaysTitle: string;
            nextThirtyDaysTitle: string;
            comingUpTitle: string;
            noUpcomingEventsText: string;
            addToCalendarButtonText: string;
            viewLocationButtonText: string;
        };
        viewModes: {
            calendar: string;
            simpleList: string;
            featured: string;
        };
    };
    months: string[];
}

// Add this function before the EventsContent component to identify Google Drive attachments
const isDriveAttachment = (url: string): boolean => {
    return url.includes('drive.google.com');
};

// Add helper function for getting day name
const getDayName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Add helper function for getting month name
const getMonthName = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short' });
};

export const EventsContent = () => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);
    const { currentLanguage } = useLanguage();
    const currentDate = new Date();

    // Track previous language to detect changes
    const prevLanguageRef = useRef(currentLanguage);

    // Content state
    const [content, setContent] = useState<EventsContent | null>(null);
    const [contentLoading, setContentLoading] = useState<boolean>(true);
    const [contentError, setContentError] = useState<string | null>(null);

    // View state
    const [activeTab, setActiveTab] = useState('upcoming');
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedListPeriod, setSelectedListPeriod] = useState<'quick' | 'month'>('quick');
    const [selectedQuickPeriod, setSelectedQuickPeriod] = useState<'all' | 'today' | 'tomorrow' | 'week' | 'month'>('all');

    // Events state
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [calendarError, setCalendarError] = useState<string | null>(null);

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
                case 'location':
                    aValue = (a.location || '').toLowerCase();
                    bValue = (b.location || '').toLowerCase();
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

            // First load content, then events
            loadContent()
                .then(() => calendarService.updateLanguage(currentLanguage))
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

        // Load content first, then events
        loadContent()
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
            const response = await contentService.getContent<EventsContent>('events');

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
        openUrlWithLanguageCheck(attachmentUrl, currentLanguage);
    };

    // Render view mode selector with improved labels
    const renderViewModeSelector = () => (
        <View style={styles.viewModeContainer}>
            <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'calendar' && styles.activeViewModeButton]}
                onPress={() => setViewMode('calendar')}
            >
                <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={viewMode === 'calendar' ? '#FFFFFF' : themeColors.text}
                />
                <Text style={[styles.viewModeText, viewMode === 'calendar' && styles.activeViewModeText]}>
                    {content?.ui.viewModes.calendar || 'Calendar'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'list' && styles.activeViewModeButton]}
                onPress={() => setViewMode('list')}
            >
                <Ionicons
                    name="list-outline"
                    size={20}
                    color={viewMode === 'list' ? '#FFFFFF' : themeColors.text}
                />
                <Text style={[styles.viewModeText, viewMode === 'list' && styles.activeViewModeText]}>
                    {content?.ui.viewModes.simpleList || 'Simple List'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'timeline' && styles.activeViewModeButton]}
                onPress={() => setViewMode('timeline')}
            >
                <Ionicons
                    name="star-outline"
                    size={20}
                    color={viewMode === 'timeline' ? '#FFFFFF' : themeColors.text}
                />
                <Text style={[styles.viewModeText, viewMode === 'timeline' && styles.activeViewModeText]}>
                    {content?.ui.viewModes.featured || 'Featured'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    // Add this new component for quick filters
    const renderQuickFilters = () => (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickFiltersContainer}
            contentContainerStyle={styles.quickFiltersContent}
        >
            <TouchableOpacity
                style={[
                    styles.quickFilterChip,
                    filterOptions.category === 'all' && styles.activeQuickFilterChip
                ]}
                onPress={() => setFilterOptions(prev => ({ ...prev, category: 'all' }))}
            >
                <Ionicons
                    name="calendar"
                    size={16}
                    color={filterOptions.category === 'all' ? '#FFFFFF' : themeColors.primary}
                />
                <Text style={[
                    styles.quickFilterText,
                    filterOptions.category === 'all' && styles.activeQuickFilterText
                ]}>
                    {content?.ui.filterOptions.allEvents || 'All'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.quickFilterChip,
                    filterOptions.category === 'upcoming' && styles.activeQuickFilterChip
                ]}
                onPress={() => setFilterOptions(prev => ({ ...prev, category: 'upcoming' }))}
            >
                <Ionicons
                    name="time-outline"
                    size={16}
                    color={filterOptions.category === 'upcoming' ? '#FFFFFF' : themeColors.primary}
                />
                <Text style={[
                    styles.quickFilterText,
                    filterOptions.category === 'upcoming' && styles.activeQuickFilterText
                ]}>
                    {content?.ui.filterOptions.upcoming || 'Upcoming'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.quickFilterChip,
                    filterOptions.category === 'thisWeek' && styles.activeQuickFilterChip
                ]}
                onPress={() => setFilterOptions(prev => ({ ...prev, category: 'thisWeek' }))}
            >
                <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={filterOptions.category === 'thisWeek' ? '#FFFFFF' : themeColors.primary}
                />
                <Text style={[
                    styles.quickFilterText,
                    filterOptions.category === 'thisWeek' && styles.activeQuickFilterText
                ]}>
                    {content?.ui.filterOptions.thisWeek || 'This Week'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.moreFiltersButton}
                onPress={() => setShowFilterModal(true)}
            >
                <Ionicons name="options-outline" size={16} color={themeColors.primary} />
                <Text style={styles.moreFiltersText}>
                    {content?.ui.filterText || 'More'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );

    // Update the filter modal to be simpler
    const renderFilterModal = () => (
        <Modal
            visible={showFilterModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowFilterModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.filterModalContent}>
                    <View style={styles.filterModalHeader}>
                        <Text style={styles.filterModalTitle}>
                            {content?.ui.filterModalTitle || 'Filter Events'}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowFilterModal(false)}
                        >
                            <Ionicons name="close" size={24} color={themeColors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={themeColors.text} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={content?.ui.searchPlaceholder || 'Search events...'}
                            value={filterOptions.searchQuery}
                            onChangeText={(text) => setFilterOptions(prev => ({ ...prev, searchQuery: text }))}
                            placeholderTextColor={themeColors.text + '80'}
                        />
                    </View>

                    {/* Time Period Selection */}
                    <Text style={styles.filterSectionTitle}>
                        {content?.ui.filterSectionTitle || 'Time Period'}
                    </Text>
                    <View style={styles.filterOptionsGrid}>
                        {[
                            { value: 'all', icon: 'calendar', label: content?.ui.filterOptions.allEvents || 'All Events' },
                            { value: 'upcoming', icon: 'time', label: content?.ui.filterOptions.upcoming || 'Upcoming' },
                            { value: 'thisWeek', icon: 'calendar-outline', label: content?.ui.filterOptions.thisWeek || 'This Week' },
                            { value: 'thisMonth', icon: 'calendar-number', label: content?.ui.filterOptions.thisMonth || 'This Month' },
                            { value: 'past', icon: 'hourglass', label: content?.ui.filterOptions.pastEvents || 'Past Events' }
                        ].map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.filterOptionCard,
                                    filterOptions.category === option.value && styles.activeFilterOptionCard
                                ]}
                                onPress={() => setFilterOptions(prev => ({ ...prev, category: option.value as EventCategory }))}
                            >
                                <Ionicons
                                    name={option.icon as any}
                                    size={24}
                                    color={filterOptions.category === option.value ? '#FFFFFF' : themeColors.primary}
                                />
                                <Text style={[
                                    styles.filterOptionCardText,
                                    filterOptions.category === option.value && styles.activeFilterOptionCardText
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Sort Options */}
                    <Text style={styles.filterSectionTitle}>
                        {content?.ui.sortSectionTitle || 'Sort By'}
                    </Text>
                    <View style={styles.sortOptionsContainer}>
                        <TouchableOpacity
                            style={styles.sortButton}
                            onPress={() => setFilterOptions(prev => ({
                                ...prev,
                                sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
                            }))}
                        >
                            <Ionicons
                                name={filterOptions.sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                size={20}
                                color={themeColors.primary}
                            />
                            <Text style={styles.sortButtonText}>
                                {filterOptions.sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Apply Button */}
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={() => setShowFilterModal(false)}
                    >
                        <Text style={styles.applyButtonText}>
                            {content?.ui.applyFiltersText || 'Apply Filters'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // Render calendar view
    const renderCalendarView = () => {
        // Get the calendar URL and ensure it matches current language
        const calendarUrl = calendarService.getCalendarEmbedUrl();

        return (
            <View style={styles.calendarContainer}>
                <WebView
                    source={{ uri: calendarUrl }}
                    style={styles.calendar}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    onError={(e) => {
                        setCalendarError(content?.ui.calendarErrorText || 'Failed to load calendar view. Please try again later.');
                        console.error('WebView error:', e.nativeEvent);
                    }}
                    injectedJavaScript={`
                        // Make calendar more mobile-friendly
                        const style = document.createElement('style');
                        style.textContent = \`
                            .fc-toolbar-title { font-size: 1.2em !important; }
                            .fc-button { padding: 0.2em 0.4em !important; }
                            .fc-event { padding: 2px !important; }
                            .fc-daygrid-day-number { font-size: 0.9em !important; }
                            .fc-col-header-cell-cushion { font-size: 0.9em !important; }
                            .fc-list-day-cushion { font-size: 0.9em !important; }
                            .fc-event-title { font-size: 0.9em !important; }
                            .fc-event-time { font-size: 0.8em !important; }
                            @media (max-width: 768px) {
                                .fc-toolbar { flex-direction: column !important; }
                                .fc-toolbar-chunk { margin: 4px 0 !important; }
                            }
                        \`;
                        document.head.appendChild(style);
                    `}
                />
                {calendarError && (
                    <Text style={styles.errorText}>{calendarError}</Text>
                )}
            </View>
        );
    };

    // Render list view with enhanced organization
    const renderListView = () => (
        <View style={styles.listContainer}>
            {/* Quick Period Selector */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.quickPeriodSelector}
            >
                {[
                    { value: 'all', label: content?.ui.quickPeriodOptions.allEvents || 'All Events' },
                    { value: 'today', label: content?.ui.quickPeriodOptions.today || 'Today' },
                    { value: 'tomorrow', label: content?.ui.quickPeriodOptions.tomorrow || 'Tomorrow' },
                    { value: 'week', label: content?.ui.quickPeriodOptions.nextSevenDays || 'Next 7 Days' },
                    { value: 'month', label: content?.ui.quickPeriodOptions.nextThirtyDays || 'Next 30 Days' }
                ].map(period => (
                    <TouchableOpacity
                        key={period.value}
                        style={[
                            styles.quickPeriodButton,
                            selectedQuickPeriod === period.value && styles.activeQuickPeriodButton
                        ]}
                        onPress={() => setSelectedQuickPeriod(period.value as any)}
                    >
                        <Text style={[
                            styles.quickPeriodText,
                            selectedQuickPeriod === period.value && styles.activeQuickPeriodText
                        ]}>{period.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Events List */}
            {listViewFilteredEvents.length > 0 ? (
                listViewFilteredEvents.map(event => renderEventCard(event))
            ) : (
                <View style={styles.noEventsContainer}>
                    <Text style={styles.noEventsText}>
                        {content?.ui.noEventsText || 'No events found'}
                    </Text>
                </View>
            )}
        </View>
    );

    // Render featured events view
    const renderFeaturedView = () => {
        const now = new Date();
        const upcomingEvents = filteredAndSortedEvents.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return eventDate >= now;
        });

        // Group events by time periods
        const today = new Date(now.setHours(0, 0, 0, 0));
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const todayEvents = upcomingEvents.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return eventDate.toDateString() === today.toDateString();
        });

        const tomorrowEvents = upcomingEvents.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return eventDate.toDateString() === tomorrow.toDateString();
        });

        const nextSevenDaysEvents = upcomingEvents.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return eventDate > tomorrow && eventDate <= nextWeek;
        });

        const nextMonthEvents = upcomingEvents.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return eventDate > nextWeek && eventDate <= nextMonth;
        });

        const futureEvents = upcomingEvents.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return eventDate > nextMonth;
        });

        return (
            <View style={styles.featuredContainer}>
                {todayEvents.length > 0 && (
                    <View style={styles.featuredSection}>
                        <View style={styles.featuredHeader}>
                            <Ionicons name="today-outline" size={24} color={themeColors.primary} />
                            <Text style={styles.featuredTitle}>
                                {content?.ui.featuredView.todayTitle || 'Today'}
                            </Text>
                        </View>
                        {todayEvents.map(event => renderFeaturedEventCard(event))}
                    </View>
                )}

                {tomorrowEvents.length > 0 && (
                    <View style={styles.featuredSection}>
                        <View style={styles.featuredHeader}>
                            <Ionicons name="sunny-outline" size={24} color={themeColors.primary} />
                            <Text style={styles.featuredTitle}>
                                {content?.ui.featuredView.tomorrowTitle || 'Tomorrow'}
                            </Text>
                        </View>
                        {tomorrowEvents.map(event => renderFeaturedEventCard(event))}
                    </View>
                )}

                {nextSevenDaysEvents.length > 0 && (
                    <View style={styles.featuredSection}>
                        <View style={styles.featuredHeader}>
                            <Ionicons name="calendar-outline" size={24} color={themeColors.primary} />
                            <Text style={styles.featuredTitle}>
                                {content?.ui.featuredView.nextSevenDaysTitle || 'Next 7 Days'}
                            </Text>
                        </View>
                        {nextSevenDaysEvents.map(event => renderFeaturedEventCard(event))}
                    </View>
                )}

                {nextMonthEvents.length > 0 && (
                    <View style={styles.featuredSection}>
                        <View style={styles.featuredHeader}>
                            <Ionicons name="calendar" size={24} color={themeColors.primary} />
                            <Text style={styles.featuredTitle}>
                                {content?.ui.featuredView.nextThirtyDaysTitle || 'Next 30 Days'}
                            </Text>
                        </View>
                        {nextMonthEvents.map(event => renderFeaturedEventCard(event))}
                    </View>
                )}

                {futureEvents.length > 0 && (
                    <View style={styles.featuredSection}>
                        <View style={styles.featuredHeader}>
                            <Ionicons name="star" size={24} color={themeColors.primary} />
                            <Text style={styles.featuredTitle}>
                                {content?.ui.featuredView.comingUpTitle || 'Coming Up'}
                            </Text>
                        </View>
                        {futureEvents.map(event => renderFeaturedEventCard(event))}
                    </View>
                )}

                {upcomingEvents.length === 0 && (
                    <View style={styles.noEventsContainer}>
                        <Text style={styles.noEventsText}>
                            {content?.ui.featuredView.noUpcomingEventsText || 'No upcoming events found'}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    // Render featured event card
    const renderFeaturedEventCard = (event: CalendarEvent) => {
        const eventDate = new Date(event.start.dateTime || event.start.date || '');
        const isToday = eventDate.toDateString() === new Date().toDateString();
        const isTomorrow = eventDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

        return (
            <View key={event.id} style={styles.featuredEventCard}>
                <View style={styles.featuredEventHeader}>
                    <View style={styles.featuredDateContainer}>
                        <Text style={styles.featuredDateDay}>
                            {eventDate.getDate()}
                        </Text>
                        <Text style={styles.featuredDateMonth}>
                            {eventDate.toLocaleString('default', { month: 'short' })}
                        </Text>
                    </View>
                    <View style={styles.featuredEventInfo}>
                        <Text style={styles.featuredEventTitle}>
                            {event.summary}
                        </Text>
                        <Text style={styles.featuredEventTime}>
                            {isToday ? content?.ui.featuredView.todayTitle || 'Today' :
                                isTomorrow ? content?.ui.featuredView.tomorrowTitle || 'Tomorrow' :
                                    formatDate(eventDate)}
                            {event.start.dateTime && ` • ${formatTime(eventDate)}`}
                        </Text>
                        {event.location && (
                            <View style={styles.featuredEventLocation}>
                                <Ionicons name="location-outline" size={14} color={themeColors.text} />
                                <Text style={styles.featuredEventLocationText}>
                                    {event.location}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.featuredEventActions}>
                    <TouchableOpacity
                        style={styles.featuredActionButton}
                        onPress={() => handleAddToCalendar(event)}
                    >
                        <Ionicons name="calendar-outline" size={16} color={themeColors.primary} />
                        <Text style={styles.featuredActionText}>
                            {content?.ui.featuredView.addToCalendarButtonText || 'Add to Calendar'}
                        </Text>
                    </TouchableOpacity>
                    {event.location && (
                        <TouchableOpacity
                            style={styles.featuredActionButton}
                            onPress={() => handleOpenMap(event.location || '')}
                        >
                            <Ionicons name="map-outline" size={16} color={themeColors.primary} />
                            <Text style={styles.featuredActionText}>
                                {content?.ui.featuredView.viewLocationButtonText || 'View Location'}
                            </Text>
                        </TouchableOpacity>
                    )}
                    {event.detailsUrl && (
                        <TouchableOpacity
                            style={styles.featuredActionButton}
                            onPress={() => handleViewDetailUrl(event)}
                        >
                            <Ionicons name="open-outline" size={16} color={themeColors.primary} />
                            <Text style={styles.featuredActionText}>
                                {content?.ui.viewDetailsText || 'View Details'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    // Update the renderView function to use the new featured view
    const renderView = () => {
        switch (viewMode) {
            case 'calendar':
                return renderCalendarView();
            case 'list':
                return renderListView();
            case 'timeline':
                return renderFeaturedView();
            default:
                return renderCalendarView();
        }
    };

    const formatEventDate = (event: CalendarEvent) => {
        if (event.start.date) {
            // This is an all-day event
            return `${formatDate(new Date(event.start.date))} • ${content?.ui.allDayText || 'All Day'}`;
        } else if (event.start.dateTime) {
            // This is a timed event
            return `${formatDate(new Date(event.start.dateTime))} • ${formatTime(new Date(event.start.dateTime))} - ${formatTime(new Date(event.end.dateTime || ''))}`;
        }
        return content?.ui.dateNotSpecifiedText || 'Date not specified';
    };

    const handleOpenMap = (location: string) => {
        const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(location)}`;
        // We don't need language check for map URLs, but using our helper for consistency
        openUrlWithLanguageCheck(mapUrl, currentLanguage);
    };

    const handleAddToCalendar = (event: CalendarEvent) => {
        const url = calendarService.generateAddToCalendarUrl(event);
        // Calendar URLs don't need language check, but using our helper for consistency
        openUrlWithLanguageCheck(url, currentLanguage);
    };

    // Update handleViewDetailUrl to use our simplified approach
    const handleViewDetailUrl = (event: CalendarEvent) => {
        try {
            // Get the event detail URL from the calendar service
            // This will already handle finding the correct language URL
            const detailUrl = calendarService.getEventDetailsUrl(event);

            if (detailUrl) {
                // Use our URL opener which will ensure correct domain
                openUrlWithCorrectDomain(detailUrl, currentLanguage)
                    .catch(err => {
                        console.error(`Error opening URL:`, err);
                        showFallbackUrl();
                    });
            } else {
                console.error('No URL could be generated for event');
                showFallbackUrl();
            }

            function showFallbackUrl() {
                // Simple fallback to events page in correct language
                const fallbackUrl = currentLanguage === 'fr'
                    ? 'https://fr.egliselacite.com/events'
                    : 'https://www.egliselacite.com/events';

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
            alert(content?.ui.viewDetailsText ? `${content.ui.viewDetailsText} - Error` : 'Could not open the event details. Please try again later.');
        }
    };

    // Handle showing the full description in a modal
    const handleViewFullDescription = (event: CalendarEvent) => {
        // Set the selected event and show the full description modal
        setSelectedEvent(event);
        setShowFullDescription(true);
    };

    // Update renderEventCard with improved layout
    const renderEventCard = (event: CalendarEvent) => {
        const eventDate = new Date(event.start.dateTime || event.start.date || '');

        // Format the description using HTML utils
        const formattedDescription = event.description ? convertHtmlToFormattedText(event.description) : '';
        const locationDetails = event.location ? parseLocationString(event.location) : null;

        return (
            <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventContent}>
                    {/* Simplified Date Icon */}
                    <View style={styles.dateIconContainer}>
                        <Text style={styles.dayNumber}>{eventDate.getDate()}</Text>
                        <Text style={styles.monthName}>{getMonthName(eventDate)}</Text>
                    </View>

                    <View style={styles.eventHeader}>
                        <Text style={styles.eventTitle} numberOfLines={2}>
                            {event.summary}
                        </Text>
                    </View>

                    {locationDetails && (
                        <View style={styles.eventLocation}>
                            <Ionicons name="location-outline" size={18} color={themeColors.primary} />
                            <Text style={styles.locationText} numberOfLines={1}>
                                {locationDetails.address}
                            </Text>
                        </View>
                    )}

                    {formattedDescription && (
                        <Text
                            style={styles.eventDescription}
                            numberOfLines={2}
                            onPress={() => handleViewFullDescription(event)}
                        >
                            {formattedDescription}
                        </Text>
                    )}

                    <View style={styles.eventActions}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryActionButton]}
                            onPress={() => handleAddToCalendar(event)}
                        >
                            <Ionicons name="calendar-outline" size={16} color={themeColors.primary} />
                        </TouchableOpacity>

                        {event.detailsUrl && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.secondaryActionButton]}
                                onPress={() => handleViewDetailUrl(event)}
                            >
                                <Ionicons name="open-outline" size={16} color={themeColors.primary} />
                            </TouchableOpacity>
                        )}

                        {locationDetails && (
                            <TouchableOpacity
                                style={[styles.actionButton, styles.secondaryActionButton]}
                                onPress={() => handleOpenMap(event.location || '')}
                            >
                                <Ionicons name="map-outline" size={16} color={themeColors.primary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        );
    };

    // Render full description modal
    const renderFullDescriptionModal = () => {
        if (!selectedEvent) return null;

        const formattedDescription = selectedEvent.description ?
            convertHtmlToFormattedText(selectedEvent.description) : '';
        const attachments = selectedEvent.description ?
            extractAttachmentLinks(selectedEvent.description) : [];
        const locationDetails = selectedEvent.location ?
            parseLocationString(selectedEvent.location) : null;

        return (
            <Modal
                visible={showFullDescription}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowFullDescription(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.descriptionModalContent}>
                        <View style={styles.descriptionModalHeader}>
                            <Text style={styles.descriptionModalTitle} numberOfLines={2}>
                                {selectedEvent.summary}
                            </Text>
                            <TouchableOpacity
                                style={styles.modalCloseIconButton}
                                onPress={() => setShowFullDescription(false)}
                            >
                                <Ionicons name="close" size={18} color={themeColors.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalEventDate}>
                            {formatEventDate(selectedEvent)}
                        </Text>

                        <ScrollView style={styles.descriptionModalScrollView}>
                            {formattedDescription && (
                                <Text style={styles.descriptionModalText}>
                                    {formattedDescription}
                                </Text>
                            )}

                            {attachments.length > 0 && (
                                <View style={styles.modalPhotoAttachmentsContainer}>
                                    <Text style={styles.modalAttachmentsTitle}>
                                        {content?.ui.viewFilesText || 'Attachments'}
                                    </Text>
                                    {attachments.map((attachment, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.modalPhotoItem}
                                            onPress={() => handleViewAttachment(attachment.url)}
                                        >
                                            <Ionicons
                                                name={isDriveAttachment(attachment.url) ? 'document-outline' : 'link-outline'}
                                                size={16}
                                                color={themeColors.text}
                                            />
                                            <Text style={styles.modalAttachmentText} numberOfLines={1}>
                                                {attachment.title}
                                            </Text>
                                            <Ionicons name="open-outline" size={16} color={themeColors.text} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.modalButtonsContainer}>
                            <View style={styles.modalButtonsRow}>
                                <TouchableOpacity
                                    style={[styles.modalActionButton, { flex: 1, backgroundColor: themeColors.primary + '15', marginRight: 8 }]}
                                    onPress={() => handleAddToCalendar(selectedEvent)}
                                >
                                    <Ionicons name="calendar-outline" size={18} color={themeColors.primary} />
                                    <Text style={[styles.actionButtonText, { marginLeft: 6 }]}>
                                        {content?.ui.addToCalendarText || 'Add to Calendar'}
                                    </Text>
                                </TouchableOpacity>

                                {locationDetails && (
                                    <TouchableOpacity
                                        style={[styles.modalActionButton, { flex: 1, backgroundColor: themeColors.primary + '15' }]}
                                        onPress={() => handleOpenMap(selectedEvent.location || '')}
                                    >
                                        <Ionicons name="map-outline" size={18} color={themeColors.primary} />
                                        <Text style={[styles.actionButtonText, { marginLeft: 6 }]}>
                                            {content?.ui.viewLocationText || 'View Location'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {selectedEvent.detailsUrl && (
                                <TouchableOpacity
                                    style={[styles.modalActionButton, { marginTop: 8, backgroundColor: themeColors.primary }]}
                                    onPress={() => {
                                        setShowFullDescription(false);
                                        handleViewDetailUrl(selectedEvent);
                                    }}
                                >
                                    <Ionicons name="open-outline" size={18} color="#FFFFFF" />
                                    <Text style={[styles.actionButtonText, { marginLeft: 6, color: '#FFFFFF' }]}>
                                        {content?.ui.viewDetailsText || 'View Details'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
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

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <View style={styles.quickActionsRow}>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => setViewMode('calendar')}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={28}
                                color={themeColors.primary}
                                style={styles.quickActionIcon}
                            />
                            <Text style={styles.quickActionText}>
                                {content?.ui?.calendarViewText || 'Calendar'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickActionButton}
                            onPress={() => setViewMode('list')}
                        >
                            <Ionicons
                                name="list-outline"
                                size={28}
                                color={themeColors.primary}
                                style={styles.quickActionIcon}
                            />
                            <Text style={styles.quickActionText}>
                                {content?.ui?.listViewText || 'List View'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Filters */}
                {renderQuickFilters()}

                {/* View Content */}
                <View style={styles.viewContent}>
                    {renderView()}
                </View>
            </ScrollView>

            {/* Filter Modal */}
            {renderFilterModal()}

            {/* Full Description Modal */}
            {renderFullDescriptionModal()}
        </View>
    );
};