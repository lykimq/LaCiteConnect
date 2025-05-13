import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Dimensions, RefreshControl, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatTime, isPastEvent } from '../utils/dateUtils';
import { calendarService } from '../services/calendarService';
import { contentService } from '../services/contentService';
import WebView from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createEventsStyles } from '../styles/ThemedStyles';

// Get screen dimensions for WebView sizing
const { width, height } = Dimensions.get('window');

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
    isHoliday?: boolean;
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
        holidaysErrorText: string;
        calendarErrorText: string;
        noEventsText: string;
        noHolidaysText: string;
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
        publicHolidayText: string;
        readMoreText: string;
        viewLocationText: string;
        viewFilesText: string;
        viewDetailsText: string;
        closeText: string;
        eventAddedText: string;
        refreshEventsText: string;
        refreshHolidaysText: string;
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

export const EventsContent = () => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);
    const currentDate = new Date();
    const buttonRef = useRef(null);
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

    // Content state
    const [content, setContent] = useState<EventsContent | null>(null);
    const [contentLoading, setContentLoading] = useState<boolean>(true);
    const [contentError, setContentError] = useState<string | null>(null);

    // View state
    const [activeTab, setActiveTab] = useState('upcoming');
    const [viewMode, setViewMode] = useState<ViewMode>('calendar');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [timeFilter, setTimeFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
    const [selectedListPeriod, setSelectedListPeriod] = useState<'quick' | 'month'>('quick');
    const [selectedQuickPeriod, setSelectedQuickPeriod] = useState<'all' | 'today' | 'tomorrow' | 'week' | 'month'>('all');

    // Events state
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [holidays, setHolidays] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [holidaysLoading, setHolidaysLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [holidaysError, setHolidaysError] = useState<string | null>(null);
    const [calendarError, setCalendarError] = useState<string | null>(null);

    // Modal state
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Month pagination state
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [holidayYear, setHolidayYear] = useState(currentDate.getFullYear());
    const [holidayMonth, setHolidayMonth] = useState(currentDate.getMonth());
    const [showHolidayMonthPicker, setShowHolidayMonthPicker] = useState(false);

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

        if (selectedListPeriod === 'quick') {
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
        } else {
            // Month view
            return filteredAndSortedEvents.filter(event => {
                const eventDate = new Date(event.start.dateTime || event.start.date || '');
                return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
            });
        }
    }, [filteredAndSortedEvents, selectedListPeriod, selectedQuickPeriod, currentMonth, currentYear]);

    // Load content from JSON
    useEffect(() => {
        loadContent();
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchEvents(currentYear, currentMonth);
        fetchHolidays(holidayYear, holidayMonth);
    }, []);

    // Fetch events when month/year changes
    useEffect(() => {
        if (activeTab === 'upcoming') {
            fetchEvents(currentYear, currentMonth);
        }
    }, [currentYear, currentMonth, activeTab]);

    // Fetch holidays when month/year changes
    useEffect(() => {
        if (activeTab === 'holidays') {
            fetchHolidays(holidayYear, holidayMonth);
        }
    }, [holidayYear, holidayMonth, activeTab]);

    const loadContent = async () => {
        try {
            setContentLoading(true);
            const response = await contentService.getContent<EventsContent>('events');

            if (response.success && response.data) {
                setContent(response.data);
            } else {
                setContentError(response.error || 'Failed to load content');
            }
        } catch (err) {
            console.error('Error loading events content:', err);
            setContentError('An error occurred while loading content');
        } finally {
            setContentLoading(false);
        }
    };

    const fetchEvents = async (year?: number, month?: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await calendarService.getEvents(year, month);
            console.log(`Fetched ${data.length} events from calendar service`);

            const eventsWithUniqueIds = data.map((event, index) => ({
                ...event,
                id: `${event.id}_${index}`
            }));

            setEvents(eventsWithUniqueIds);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchHolidays = async (year?: number, month?: number) => {
        try {
            setHolidaysLoading(true);
            setHolidaysError(null);
            const data = await calendarService.getFrenchHolidays(year, month);
            console.log(`Fetched ${data.length} French holidays`);
            setHolidays(data);
        } catch (err) {
            console.error('Error fetching holidays:', err);
            setHolidaysError('Failed to load holidays. Please try again later.');
        } finally {
            setHolidaysLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (activeTab === 'upcoming') {
            fetchEvents(currentYear, currentMonth);
        } else {
            fetchHolidays(holidayYear, holidayMonth);
        }
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

    // Render filter button
    const renderFilterButton = () => (
        <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
        >
            <Ionicons name="filter-outline" size={20} color={themeColors.text} />
            <Text style={styles.filterButtonText}>{content?.ui.filterText || 'Filter'}</Text>
        </TouchableOpacity>
    );

    // Render enhanced filter modal
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
                        <Text style={styles.filterModalTitle}>{content?.ui.filterModalTitle || 'Filter & Sort Events'}</Text>
                    </View>

                    {/* Search Input */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={themeColors.text} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={content?.ui.searchPlaceholder || 'Search events...'}
                            value={filterOptions.searchQuery}
                            onChangeText={(text) => setFilterOptions(prev => ({ ...prev, searchQuery: text }))}
                            placeholderTextColor={themeColors.text + '80'}
                        />
                    </View>

                    {/* Category Filter */}
                    <Text style={styles.filterSectionTitle}>{content?.ui.filterSectionTitle || 'Show Events'}</Text>
                    <View style={styles.filterOptions}>
                        {[
                            { value: 'all', label: content?.ui.filterOptions.allEvents || 'All Events' },
                            { value: 'upcoming', label: content?.ui.filterOptions.upcoming || 'Upcoming' },
                            { value: 'thisWeek', label: content?.ui.filterOptions.thisWeek || 'This Week' },
                            { value: 'thisMonth', label: content?.ui.filterOptions.thisMonth || 'This Month' },
                            { value: 'past', label: content?.ui.filterOptions.pastEvents || 'Past Events' }
                        ].map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.filterOption,
                                    filterOptions.category === option.value && styles.activeFilterOption
                                ]}
                                onPress={() => setFilterOptions(prev => ({ ...prev, category: option.value as EventCategory }))}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    filterOptions.category === option.value && styles.activeFilterOptionText
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Sort Options */}
                    <Text style={styles.filterSectionTitle}>{content?.ui.sortSectionTitle || 'Sort By'}</Text>
                    <View style={styles.sortOptions}>
                        <View style={styles.sortRow}>
                            <Text style={styles.sortLabel}>{content?.ui.sortByLabel || 'Sort by:'}</Text>
                            <View style={styles.sortButtons}>
                                {[
                                    { value: 'date', label: content?.ui.sortOptions.date || 'Date' },
                                    { value: 'title', label: content?.ui.sortOptions.title || 'Title' },
                                    { value: 'location', label: content?.ui.sortOptions.location || 'Location' }
                                ].map(option => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.sortButton,
                                            filterOptions.sortBy === option.value && styles.activeSortButton
                                        ]}
                                        onPress={() => setFilterOptions(prev => ({ ...prev, sortBy: option.value as SortBy }))}
                                    >
                                        <Text style={[
                                            styles.sortButtonText,
                                            filterOptions.sortBy === option.value && styles.activeSortButtonText
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={styles.sortRow}>
                            <Text style={styles.sortLabel}>{content?.ui.sortOrderLabel || 'Order:'}</Text>
                            <View style={styles.sortButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.sortButton,
                                        filterOptions.sortOrder === 'asc' && styles.activeSortButton
                                    ]}
                                    onPress={() => setFilterOptions(prev => ({ ...prev, sortOrder: 'asc' }))}
                                >
                                    <Ionicons
                                        name="arrow-up"
                                        size={16}
                                        color={filterOptions.sortOrder === 'asc' ? '#FFFFFF' : themeColors.text}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.sortButton,
                                        filterOptions.sortOrder === 'desc' && styles.activeSortButton
                                    ]}
                                    onPress={() => setFilterOptions(prev => ({ ...prev, sortOrder: 'desc' }))}
                                >
                                    <Ionicons
                                        name="arrow-down"
                                        size={16}
                                        color={filterOptions.sortOrder === 'desc' ? '#FFFFFF' : themeColors.text}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Apply Button */}
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={() => setShowFilterModal(false)}
                    >
                        <Text style={styles.applyButtonText}>{content?.ui.applyFiltersText || 'Apply Filters'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // Render calendar view
    const renderCalendarView = () => (
        <View style={styles.calendarContainer}>
            <WebView
                source={{ uri: calendarService.getCalendarEmbedUrl() }}
                style={styles.calendar}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                onError={(e) => {
                    setCalendarError(content?.ui.calendarErrorText || 'Failed to load calendar view. Please try again later.');
                    console.error('WebView error:', e.nativeEvent);
                }}
            />
            {calendarError && (
                <Text style={styles.errorText}>{calendarError}</Text>
            )}
        </View>
    );

    // Render list view with enhanced organization
    const renderListView = () => (
        <View style={styles.listContainer}>
            {/* Period Selector */}
            <View style={styles.periodSelectorContainer}>
                <View style={styles.periodTypeSelector}>
                    <TouchableOpacity
                        style={[
                            styles.periodTypeButton,
                            selectedListPeriod === 'quick' && styles.activePeriodTypeButton
                        ]}
                        onPress={() => setSelectedListPeriod('quick')}
                    >
                        <Text style={[
                            styles.periodTypeText,
                            selectedListPeriod === 'quick' && styles.activePeriodTypeText
                        ]}>{content?.ui.quickViewText || 'Quick View'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.periodTypeButton,
                            selectedListPeriod === 'month' && styles.activePeriodTypeButton
                        ]}
                        onPress={() => setSelectedListPeriod('month')}
                    >
                        <Text style={[
                            styles.periodTypeText,
                            selectedListPeriod === 'month' && styles.activePeriodTypeText
                        ]}>{content?.ui.monthViewText || 'Month View'}</Text>
                    </TouchableOpacity>
                </View>

                {selectedListPeriod === 'quick' ? (
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
                ) : (
                    <View style={styles.monthSelector}>
                        <TouchableOpacity
                            style={styles.monthNavigationButton}
                            onPress={prevMonth}
                        >
                            <Ionicons name="chevron-back" size={24} color={themeColors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.currentMonthButton}
                            onPress={() => setShowMonthPicker(true)}
                        >
                            <Text style={styles.currentMonthText}>
                                {getCurrentMonthYearString()}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.monthNavigationButton}
                            onPress={nextMonth}
                        >
                            <Ionicons name="chevron-forward" size={24} color={themeColors.text} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Events List */}
            {listViewFilteredEvents.map(event => renderEventCard(event))}
            {listViewFilteredEvents.length === 0 && (
                <View style={styles.noEventsContainer}>
                    <Text style={styles.noEventsText}>
                        {content?.ui.noEventsText || 'No events found'}
                    </Text>
                </View>
            )}

            {/* Month Picker Modal */}
            {showMonthPicker && renderMonthPicker()}
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
                            onPress={() => Linking.openURL(event.detailsUrl || '')}
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
            return `${formatDate(new Date(event.start.date))} (${content?.ui.allDayText || 'All day'})`;
        } else if (event.start.dateTime) {
            // This is a timed event
            return `${formatDate(new Date(event.start.dateTime))} • ${formatTime(new Date(event.start.dateTime))} - ${formatTime(new Date(event.end.dateTime || ''))}`;
        }
        return content?.ui.dateNotSpecifiedText || 'Date not specified';
    };

    const handleOpenMap = (location: string) => {
        Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(location)}`);
    };

    const handleAddToCalendar = (event: CalendarEvent) => {
        const url = calendarService.generateAddToCalendarUrl(event);
        Linking.openURL(url);
    };

    const handleOpenCalendar = () => {
        calendarService.openCalendarInBrowser();
    };

    // Handle showing the full description in a modal
    const handleViewFullDescription = (event: CalendarEvent, buttonRef: any) => {
        // Set the selected event and show the full description modal
        setSelectedEvent(event);
        setShowFullDescription(true);
    };

    // Navigate to next month for events
    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Navigate to previous month for events
    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    // Navigate to next month for holidays
    const nextHolidayMonth = () => {
        if (holidayMonth === 11) {
            setHolidayMonth(0);
            setHolidayYear(holidayYear + 1);
        } else {
            setHolidayMonth(holidayMonth + 1);
        }
    };

    // Navigate to previous month for holidays
    const prevHolidayMonth = () => {
        if (holidayMonth === 0) {
            setHolidayMonth(11);
            setHolidayYear(holidayYear - 1);
        } else {
            setHolidayMonth(holidayMonth - 1);
        }
    };

    const getCurrentMonthYearString = () => {
        const monthNames = content?.months || [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[currentMonth]} ${currentYear}`;
    };

    const getHolidayMonthYearString = () => {
        const monthNames = content?.months || [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[holidayMonth]} ${holidayYear}`;
    };

    const selectMonth = (month: number) => {
        setCurrentMonth(month);
        setShowMonthPicker(false);
    };

    const selectHolidayMonth = (month: number) => {
        setHolidayMonth(month);
        setShowHolidayMonthPicker(false);
    };

    const handleViewAttachment = (attachmentUrl: string) => {
        Linking.openURL(attachmentUrl);
    };

    // Render month picker for events
    const renderMonthPicker = () => {
        const months = content?.months?.map(month => month.substring(0, 3)) || [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        return (
            <Modal
                visible={showMonthPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowMonthPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.monthPickerModal}>
                        <View style={styles.monthPickerHeader}>
                            <Text style={styles.monthPickerTitle}>{content?.ui.monthViewText || 'Select Month'}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowMonthPicker(false)}
                            >
                                <Ionicons name="close" size={24} color={themeColors.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.monthPicker}>
                            {months.map((month, index) => (
                                <TouchableOpacity
                                    key={`month-${index}`}
                                    style={[
                                        styles.monthPickerItem,
                                        currentMonth === index && styles.monthPickerItemActive
                                    ]}
                                    onPress={() => selectMonth(index)}
                                >
                                    <Text style={[
                                        styles.monthPickerText,
                                        currentMonth === index && styles.monthPickerTextActive
                                    ]}>
                                        {month}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    // Render month picker for holidays
    const renderHolidayMonthPicker = () => {
        const months = content?.months?.map(month => month.substring(0, 3)) || [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        return (
            <View style={styles.monthPicker}>
                {months.map((month, index) => (
                    <TouchableOpacity
                        key={`holiday-month-${index}`}
                        style={[
                            styles.monthPickerItem,
                            holidayMonth === index && styles.monthPickerItemActive
                        ]}
                        onPress={() => selectHolidayMonth(index)}
                    >
                        <Text style={[
                            styles.monthPickerText,
                            holidayMonth === index && styles.monthPickerTextActive
                        ]}>
                            {month}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    // Render event card
    const renderEventCard = (event: CalendarEvent) => {
        // Check if this event has any Google Drive attachments
        const hasDriveAttachments = event.attachments?.some(
            attachment => isDriveAttachment(attachment.url)
        );

        // First Drive attachment link (for the View Files button)
        const driveAttachment = event.attachments?.find(
            attachment => isDriveAttachment(attachment.url)
        );

        return (
            <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>
                        {event.summary}
                        {event.recurrence && <Text style={styles.recurringTag}> (Recurring)</Text>}
                        {event.reminderSet && (
                            <Ionicons name="notifications" size={16} color={themeColors.primary} style={{ marginLeft: 5 }} />
                        )}
                    </Text>
                    <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>
                            {event.start.dateTime
                                ? new Date(event.start.dateTime).getDate()
                                : event.start.date
                                    ? new Date(event.start.date).getDate()
                                    : ''}
                        </Text>
                    </View>
                </View>

                <Text style={styles.eventDate}>
                    {formatEventDate(event)}
                </Text>

                {/* Display location with improved formatting */}
                {event.formattedLocation && (
                    <TouchableOpacity
                        style={styles.eventLocation}
                        onPress={() => event.formattedLocation?.mapUrl
                            ? Linking.openURL(event.formattedLocation.mapUrl)
                            : handleOpenMap(event.location || '')}
                    >
                        <Ionicons name="location-outline" size={14} color="#666" />
                        <Text style={styles.eventLocationText}>
                            {event.formattedLocation.address}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Display formatted description with better styling */}
                {event.formattedDescription && (
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.eventDescription} numberOfLines={3} ellipsizeMode="tail">
                            {event.formattedDescription}
                        </Text>

                        {event.formattedDescription.length > 80 && (
                            <TouchableOpacity
                                style={styles.readMoreButton}
                                onPress={() => handleViewFullDescription(event, null)}
                            >
                                <Text style={styles.readMoreText}>{content?.ui.readMoreText || 'Read More'}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Display attachments if available */}
                {event.attachments && event.attachments.length > 0 && (
                    <View style={styles.attachmentsContainer}>
                        <Text style={styles.attachmentsTitle}>{content?.ui.viewAttachmentText || 'Attachments:'}:</Text>
                        {event.attachments.map((attachment, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.attachmentItem}
                                onPress={() => Linking.openURL(attachment.url)}
                            >
                                <Ionicons
                                    name={
                                        isDriveAttachment(attachment.url)
                                            ? "document-outline"
                                            : "link-outline"
                                    }
                                    size={14}
                                    color="#666"
                                />
                                <Text style={styles.attachmentText}>
                                    {attachment.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    {event.location && (
                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={() => handleOpenMap(event.location || '')}
                        >
                            <Text style={styles.buttonText}>{content?.ui.viewLocationText || 'View Location'}</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => handleAddToCalendar(event)}
                    >
                        <Text style={styles.buttonText}>{content?.ui.addToCalendarText || 'Add to Calendar'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Additional action buttons */}
                <View style={styles.additionalButtonsContainer}>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => handleSetReminder(event)}
                    >
                        <Ionicons name="notifications-outline" size={14} color={themeColors.primary} style={{ marginRight: 5 }} />
                        <Text style={styles.secondaryButtonText}>{content?.ui.setReminderText || 'Set Reminder'}</Text>
                    </TouchableOpacity>

                    {driveAttachment ? (
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => handleViewAttachment(driveAttachment.url)}
                        >
                            <Ionicons name="document-outline" size={14} color={themeColors.primary} style={{ marginRight: 5 }} />
                            <Text style={styles.secondaryButtonText}>{content?.ui.viewFilesText || 'View Files'}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => Linking.openURL(event.detailsUrl || 'https://fr.egliselacite.com/events2')}
                        >
                            <Ionicons name="open-outline" size={14} color={themeColors.primary} style={{ marginRight: 5 }} />
                            <Text style={styles.secondaryButtonText}>{content?.ui.viewDetailsText || 'View Details'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    // Add handleSetReminder function
    const handleSetReminder = (event: CalendarEvent) => {
        const updatedEvents = events.map(e => {
            if (e.id === event.id) {
                return { ...e, reminderSet: true };
            }
            return e;
        });

        setEvents(updatedEvents);
        alert(content?.ui.reminderSetText || 'Reminder set for this event');
    };

    // Render full description modal
    const renderFullDescriptionModal = () => {
        if (!selectedEvent) return null;

        // Process description to properly display all content
        const formatDescription = (description?: string) => {
            if (!description) return '';

            // Replace multiple consecutive line breaks with two line breaks
            return description.replace(/\n{3,}/g, '\n\n');
        };

        return (
            <Modal
                visible={showFullDescription}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowFullDescription(false)}
            >
                <View style={styles.descriptionModal}>
                    <View style={styles.descriptionModalContent}>
                        <View style={styles.descriptionModalHeader}>
                            <Text style={styles.descriptionModalTitle} numberOfLines={2} ellipsizeMode="tail">
                                {selectedEvent.summary}
                            </Text >
                            <TouchableOpacity
                                style={styles.modalCloseIconButton}
                                onPress={() => setShowFullDescription(false)}
                                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                            >
                                <Ionicons name="close" size={20} color={themeColors.text} />
                            </TouchableOpacity>
                        </View >

                        <ScrollView
                            style={styles.descriptionModalScrollView}
                            showsVerticalScrollIndicator={true}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            <Text style={styles.modalEventDate}>
                                {formatEventDate(selectedEvent)}
                            </Text>

                            {selectedEvent.formattedLocation && (
                                <TouchableOpacity
                                    style={styles.eventLocation}
                                    onPress={() => {
                                        setShowFullDescription(false);
                                        selectedEvent.formattedLocation?.mapUrl
                                            ? Linking.openURL(selectedEvent.formattedLocation.mapUrl)
                                            : handleOpenMap(selectedEvent.location || '');
                                    }}
                                >
                                    <Ionicons name="location-outline" size={14} color={themeColors.text} />
                                    <Text style={[styles.eventLocationText, { color: themeColors.primary }]} numberOfLines={1}>
                                        {selectedEvent.formattedLocation.address}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {selectedEvent.formattedDescription && (
                                <Text style={styles.descriptionModalText}>
                                    {formatDescription(selectedEvent.formattedDescription)}
                                </Text>
                            )}

                            {selectedEvent.attachments && selectedEvent.attachments.length > 0 && (
                                <View style={styles.modalPhotoAttachmentsContainer}>
                                    <Text style={styles.modalAttachmentsTitle}>
                                        {selectedEvent.attachments.length > 1 ?
                                            `${content?.ui.viewAttachmentText || 'Files'} (${selectedEvent.attachments.length})` :
                                            content?.ui.viewAttachmentText || 'File'}
                                    </Text>
                                    {selectedEvent.attachments.map((attachment, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.modalPhotoItem}
                                            onPress={() => {
                                                setShowFullDescription(false);
                                                handleViewAttachment(attachment.url);
                                            }}
                                        >
                                            <Ionicons
                                                name={isDriveAttachment(attachment.url) ? "document-outline" : "link-outline"}
                                                size={14}
                                                color={themeColors.primary}
                                                style={{ marginRight: 6 }}
                                            />
                                            <Text style={[styles.modalAttachmentText, { color: themeColors.primary }]} numberOfLines={1}>
                                                {attachment.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.modalActionButton, { backgroundColor: themeColors.primary }]}
                                onPress={() => {
                                    setShowFullDescription(false);
                                    handleAddToCalendar(selectedEvent);
                                }}
                            >
                                <Ionicons name="calendar-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                                <Text style={styles.buttonText}>{content?.ui.addToCalendarText || 'Add to Calendar'}</Text>
                            </TouchableOpacity>

                            {selectedEvent.detailsUrl && (
                                <TouchableOpacity
                                    style={[styles.modalActionButton, { backgroundColor: themeColors.secondary, marginLeft: 10 }]}
                                    onPress={() => {
                                        setShowFullDescription(false);
                                        Linking.openURL(selectedEvent.detailsUrl || '');
                                    }}
                                >
                                    <Ionicons name="open-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                                    <Text style={styles.buttonText}>{content?.ui.viewDetailsText || 'View Details'}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View >
                </View >
            </Modal >
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
                            fetchEvents(currentYear, currentMonth);
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
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[themeColors.primary]}
                    />
                }
            >
                <View style={styles.header}>
                    <Ionicons name="calendar" size={60} color={themeColors.primary} />
                    <View style={styles.headerDivider} />
                    <Text style={styles.title}>
                        {content?.header.title || 'Events'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {content?.header.subtitle || 'Join us for upcoming church events'}
                    </Text>
                </View>

                {/* View Mode Selector */}
                {renderViewModeSelector()}

                {/* Filter Button */}
                {renderFilterButton()}

                {/* Main Content View */}
                {renderView()}

                {/* Filter Modal */}
                {renderFilterModal()}

                {/* Full Description Modal */}
                {showFullDescription && selectedEvent && renderFullDescriptionModal()}
            </ScrollView>
        </View>
    );
};