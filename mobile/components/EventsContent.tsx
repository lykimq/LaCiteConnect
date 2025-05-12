import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Dimensions, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatTime, isPastEvent } from '../utils/dateUtils';
import { calendarService } from '../services/calendarService';
import { contentService } from '../services/contentService';
import WebView from 'react-native-webview';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createEventsStyles } from '../styles/ThemedStyles';

// Get screen dimensions for WebView sizing
const { width } = Dimensions.get('window');

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
    };
    months: string[];
}

// Add this function before the EventsContent component to identify Google Drive attachments
const isDriveAttachment = (url: string): boolean => {
    return url.includes('drive.google.com');
};

export const EventsContent = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [holidays, setHolidays] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [holidaysLoading, setHolidaysLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [holidaysError, setHolidaysError] = useState<string | null>(null);
    const [calendarError, setCalendarError] = useState<string | null>(null);
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);

    // Content state for UI strings
    const [content, setContent] = useState<EventsContent | null>(null);
    const [contentLoading, setContentLoading] = useState<boolean>(true);
    const [contentError, setContentError] = useState<string | null>(null);

    // State for expanded description modal
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);

    // Month pagination state
    const currentDate = new Date();
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    // Holiday month pagination
    const [holidayYear, setHolidayYear] = useState(currentDate.getFullYear());
    const [holidayMonth, setHolidayMonth] = useState(currentDate.getMonth());
    const [showHolidayMonthPicker, setShowHolidayMonthPicker] = useState(false);

    // Load content from JSON
    useEffect(() => {
        loadContent();
    }, []);

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

    useEffect(() => {
        fetchEvents();
        fetchHolidays();
    }, []);

    // Fetch events for the current month when month/year changes
    useEffect(() => {
        if (activeTab === 'upcoming') {
            fetchEvents(currentYear, currentMonth);
        }
    }, [currentYear, currentMonth]);

    // Fetch holidays for the selected month when it changes
    useEffect(() => {
        if (activeTab === 'holidays') {
            fetchHolidays(holidayYear, holidayMonth);
        }
    }, [holidayYear, holidayMonth]);

    const fetchEvents = async (year?: number, month?: number) => {
        try {
            setLoading(true);
            setError(null);
            const data = await calendarService.getEvents(year, month);
            console.log(`Fetched ${data.length} events from calendar service`);

            // Ensure each event has a unique ID by adding an index if needed
            const eventsWithUniqueIds = data.map((event, index) => {
                // If the ID already exists, append the index to make it unique
                return {
                    ...event,
                    id: `${event.id}_${index}`
                };
            });

            // Debug log to check events by month
            const monthsInEvents = new Map();
            eventsWithUniqueIds.forEach(event => {
                let eventDate;
                if (event.start.dateTime) {
                    eventDate = new Date(event.start.dateTime);
                } else if (event.start.date) {
                    eventDate = new Date(event.start.date);
                } else {
                    return;
                }

                const month = eventDate.getMonth();
                const year = eventDate.getFullYear();
                const monthYear = `${year}-${month + 1}`;

                if (!monthsInEvents.has(monthYear)) {
                    monthsInEvents.set(monthYear, 1);
                } else {
                    monthsInEvents.set(monthYear, monthsInEvents.get(monthYear) + 1);
                }
            });

            console.log('Months in events:', Object.fromEntries([...monthsInEvents.entries()].sort()));

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
    const handleViewFullDescription = (event: CalendarEvent) => {
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
            <View style={styles.monthPicker}>
                {months.map((month, index) => (
                    <TouchableOpacity
                        key={month}
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
                        key={month}
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

    // Render current month events
    const renderCurrentMonthEvents = () => {
        if (loading) {
            return (
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    backgroundColor: themeColors.card,
                    borderRadius: 8,
                    marginVertical: 10
                }}>
                    <ActivityIndicator size="large" color={themeColors.primary} />
                    <Text style={{
                        fontSize: 16,
                        color: themeColors.text,
                        opacity: 0.7,
                        textAlign: 'center',
                        marginVertical: 15
                    }}>
                        {content?.ui.loadingText || 'Loading events...'}
                    </Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    backgroundColor: themeColors.card,
                    borderRadius: 8,
                    marginVertical: 10
                }}>
                    <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
                    <Text style={{
                        fontSize: 16,
                        color: themeColors.text,
                        opacity: 0.7,
                        textAlign: 'center',
                        marginVertical: 15
                    }}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: themeColors.primary,
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => fetchEvents(currentYear, currentMonth)}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                            {content?.ui.tryAgainText || 'Try Again'}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (events.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return (
                eventDate.getMonth() === currentMonth &&
                eventDate.getFullYear() === currentYear
            );
        }).length === 0) {
            return (
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    backgroundColor: themeColors.card,
                    borderRadius: 8,
                    marginVertical: 10
                }}>
                    <Ionicons name="calendar-outline" size={40} color="#ccc" />
                    <Text style={{
                        fontSize: 16,
                        color: themeColors.text,
                        opacity: 0.7,
                        textAlign: 'center',
                        marginVertical: 15
                    }}>
                        {content?.ui.noEventsText || 'No events found for'} {getCurrentMonthYearString()}
                    </Text>
                </View>
            );
        }

        return events.filter(event => {
            const eventDate = new Date(event.start.dateTime || event.start.date || '');
            return (
                eventDate.getMonth() === currentMonth &&
                eventDate.getFullYear() === currentYear
            );
        }).map(renderEventCard);
    };

    // Render French holidays for current month
    const renderCurrentMonthHolidays = () => {
        if (holidaysLoading) {
            return (
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    backgroundColor: themeColors.card,
                    borderRadius: 8,
                    marginVertical: 10
                }}>
                    <ActivityIndicator size="large" color={themeColors.primary} />
                    <Text style={{
                        fontSize: 16,
                        color: themeColors.text,
                        opacity: 0.7,
                        textAlign: 'center',
                        marginVertical: 15
                    }}>
                        {content?.ui.loadingText || 'Loading holidays...'}
                    </Text>
                </View>
            );
        }

        if (holidaysError) {
            return (
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    backgroundColor: themeColors.card,
                    borderRadius: 8,
                    marginVertical: 10
                }}>
                    <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
                    <Text style={{
                        fontSize: 16,
                        color: themeColors.text,
                        opacity: 0.7,
                        textAlign: 'center',
                        marginVertical: 15
                    }}>
                        {holidaysError}
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: themeColors.primary,
                            paddingVertical: 10,
                            paddingHorizontal: 15,
                            borderRadius: 8,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => fetchHolidays(holidayYear, holidayMonth)}
                    >
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>
                            {content?.ui.tryAgainText || 'Try Again'}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (holidays.filter(holiday => {
            const holidayDate = new Date(holiday.start.dateTime || holiday.start.date || '');
            return (
                holidayDate.getMonth() === holidayMonth &&
                holidayDate.getFullYear() === holidayYear
            );
        }).length === 0) {
            return (
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    backgroundColor: themeColors.card,
                    borderRadius: 8,
                    marginVertical: 10
                }}>
                    <Ionicons name="calendar-outline" size={40} color="#ccc" />
                    <Text style={{
                        fontSize: 16,
                        color: themeColors.text,
                        opacity: 0.7,
                        textAlign: 'center',
                        marginVertical: 15
                    }}>
                        {content?.ui.noHolidaysText || 'No holidays found for'} {getHolidayMonthYearString()}
                    </Text>
                </View>
            );
        }

        return holidays.filter(holiday => {
            const holidayDate = new Date(holiday.start.dateTime || holiday.start.date || '');
            return (
                holidayDate.getMonth() === holidayMonth &&
                holidayDate.getFullYear() === holidayYear
            );
        }).map(renderHolidayCard);
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
                        <Text style={styles.eventDescription}>
                            {event.formattedDescription.length > 150
                                ? `${event.formattedDescription.substring(0, 150)}...`
                                : event.formattedDescription}
                        </Text>

                        {event.formattedDescription.length > 150 && (
                            <TouchableOpacity
                                style={styles.readMoreButton}
                                onPress={() => handleViewFullDescription(event)}
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
                            onPress={() => Linking.openURL('https://fr.egliselacite.com/events2')}
                        >
                            <Ionicons name="open-outline" size={14} color={themeColors.primary} style={{ marginRight: 5 }} />
                            <Text style={styles.secondaryButtonText}>{content?.ui.viewDetailsText || 'View Details'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    // Render holiday card
    const renderHolidayCard = (holiday: CalendarEvent) => (
        <View key={holiday.id} style={styles.holidayCard}>
            <View style={styles.eventHeader}>
                <Text style={styles.holidayTitle}>{holiday.summary}</Text>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                        {holiday.start.date
                            ? new Date(holiday.start.date).getDate()
                            : ''}
                    </Text>
                </View>
            </View>
            <View style={styles.holidayTag}>
                <Text style={styles.holidayTagText}>{content?.ui.publicHolidayText || 'Public Holiday'}</Text>
            </View>
            <Text style={styles.holidayDate}>
                {holiday.start.date ? formatDate(new Date(holiday.start.date)) : ''}
            </Text>
            {holiday.description && (
                <Text style={styles.eventDescription}>{holiday.description}</Text>
            )}
            <TouchableOpacity
                style={styles.registerButton}
                onPress={() => handleAddToCalendar(holiday)}
            >
                <Text style={styles.buttonText}>{content?.ui.addToCalendarText || 'Add to Calendar'}</Text>
            </TouchableOpacity>
        </View>
    );

    // Handle loading and error states for content
    if (contentLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    // If there's an error loading content, show an error message
    if (contentError || !content) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#FF3B30' }}>{contentError || 'Content not available'}</Text>
                <TouchableOpacity
                    style={{ marginTop: 20, padding: 10, backgroundColor: themeColors.primary, borderRadius: 8 }}
                    onPress={loadContent}
                >
                    <Text style={{ color: '#FFFFFF' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Add this function before the return statement
    const handleSetReminder = (event: CalendarEvent) => {
        // Here you would implement actual reminder functionality
        // This is just a placeholder implementation

        // Update the event in state to show it has a reminder set
        const updatedEvents = events.map(e => {
            if (e.id === event.id) {
                return { ...e, reminderSet: true };
            }
            return e;
        });

        setEvents(updatedEvents);

        // Show feedback to user (in a real app, you'd use a proper notification system)
        alert(content?.ui.reminderSetText || 'Reminder set for this event');
    };

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
                    <Text style={styles.title}>
                        {content?.header.title || 'Events'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {content?.header.subtitle || 'Join us for upcoming church events'}
                    </Text>
                </View>

                {/* Calendar View - Always visible */}
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

                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={handleOpenCalendar}
                >
                    <Ionicons name="open-outline" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>{content?.ui.openCalendarText || 'Open Calendar in Browser'}</Text>
                </TouchableOpacity>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
                            {content?.tabs[0]?.label || 'Church Events'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'holidays' && styles.activeTab]}
                        onPress={() => {
                            setActiveTab('holidays');
                            if (holidays.length === 0) {
                                fetchHolidays(holidayYear, holidayMonth);
                            }
                        }}
                    >
                        <Text style={[styles.tabText, activeTab === 'holidays' && styles.activeTabText]}>
                            {content?.tabs[1]?.label || 'French Holidays'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'upcoming' && (
                    <>
                        {/* Month navigation */}
                        <View style={styles.monthNavigation}>
                            <TouchableOpacity
                                style={styles.monthNavigationButton}
                                onPress={prevMonth}
                            >
                                <Ionicons name="chevron-back" size={24} color="#666" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.yearPickerButton}
                                onPress={() => setShowMonthPicker(!showMonthPicker)}
                            >
                                <Text style={styles.currentMonthDisplay}>
                                    {getCurrentMonthYearString()}
                                </Text>
                                <Ionicons
                                    name={showMonthPicker ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color="#666"
                                    style={{ marginLeft: 5 }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.monthNavigationButton}
                                onPress={nextMonth}
                            >
                                <Ionicons name="chevron-forward" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Month picker */}
                        {showMonthPicker && renderMonthPicker()}

                        {/* Events for current month */}
                        {renderCurrentMonthEvents()}

                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={() => fetchEvents(currentYear, currentMonth)}
                        >
                            <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>{content?.ui.refreshEventsText || 'Refresh Events'}</Text>
                        </TouchableOpacity>
                    </>
                )}

                {activeTab === 'holidays' && (
                    <>
                        {/* Month navigation for holidays */}
                        <View style={styles.monthNavigation}>
                            <TouchableOpacity
                                style={styles.monthNavigationButton}
                                onPress={prevHolidayMonth}
                            >
                                <Ionicons name="chevron-back" size={24} color="#666" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.yearPickerButton}
                                onPress={() => setShowHolidayMonthPicker(!showHolidayMonthPicker)}
                            >
                                <Text style={styles.currentMonthDisplay}>
                                    {getHolidayMonthYearString()}
                                </Text>
                                <Ionicons
                                    name={showHolidayMonthPicker ? "chevron-up" : "chevron-down"}
                                    size={16}
                                    color="#666"
                                    style={{ marginLeft: 5 }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.monthNavigationButton}
                                onPress={nextHolidayMonth}
                            >
                                <Ionicons name="chevron-forward" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Month picker for holidays */}
                        {showHolidayMonthPicker && renderHolidayMonthPicker()}

                        <Text style={styles.sectionTitle}>{content?.tabs[1]?.label || 'French Public Holidays'}</Text>

                        {/* Holidays for current month */}
                        {renderCurrentMonthHolidays()}

                        <TouchableOpacity
                            style={styles.refreshButton}
                            onPress={() => fetchHolidays(holidayYear, holidayMonth)}
                        >
                            <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>{content?.ui.refreshHolidaysText || 'Refresh Holidays'}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            {/* Full Description Modal */}
            {showFullDescription && selectedEvent && (
                <View style={styles.descriptionModal}>
                    <View style={styles.descriptionModalContent}>
                        <View style={styles.descriptionModalHeader}>
                            <Text style={styles.descriptionModalTitle}>{selectedEvent.summary}</Text>
                            <TouchableOpacity
                                style={styles.modalCloseIconButton}
                                onPress={() => setShowFullDescription(false)}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.descriptionModalScrollView}>
                            {/* Display event date */}
                            <Text style={styles.modalEventDate}>
                                {formatEventDate(selectedEvent)}
                            </Text>

                            {/* Display location if available */}
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
                                    <Ionicons name="location-outline" size={16} color="#666" />
                                    <Text style={styles.eventLocationText}>
                                        {selectedEvent.formattedLocation.address}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Full description */}
                            {selectedEvent.formattedDescription && (
                                <Text style={styles.descriptionModalText}>
                                    {selectedEvent.formattedDescription}
                                </Text>
                            )}

                            {/* File attachments section */}
                            {selectedEvent.attachments && selectedEvent.attachments.some(
                                attachment => isDriveAttachment(attachment.url)
                            ) && (
                                    <View style={styles.modalPhotoAttachmentsContainer}>
                                        <Text style={styles.modalAttachmentsTitle}>{content?.ui.viewAttachmentText || 'Files:'}:</Text>
                                        {selectedEvent.attachments
                                            .filter(attachment => isDriveAttachment(attachment.url))
                                            .map((attachment, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.modalPhotoItem}
                                                    onPress={() => Linking.openURL(attachment.url)}
                                                >
                                                    <Ionicons name="document-outline" size={16} color={themeColors.primary} />
                                                    <Text style={[styles.modalAttachmentText, { color: themeColors.primary }]}>
                                                        {attachment.title}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                    </View>
                                )}
                        </ScrollView>

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowFullDescription(false)}
                            >
                                <Text style={styles.buttonText}>{content?.ui.closeText || 'Close'}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalActionButton}
                                onPress={() => {
                                    setShowFullDescription(false);
                                    handleAddToCalendar(selectedEvent);
                                }}
                            >
                                <Text style={styles.buttonText}>{content?.ui.addToCalendarText || 'Add to Calendar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};