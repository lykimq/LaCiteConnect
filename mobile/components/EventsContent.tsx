import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Dimensions, RefreshControl, Image } from 'react-native';
import { eventsStyles } from '../styles/EventsContent.styles';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatTime, isPastEvent } from '../utils/dateUtils';
import { calendarService } from '../services/calendarService';
import WebView from 'react-native-webview';

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
    imageUrls?: string[];
    attachments?: Array<{ title: string, url: string }>;
    reminderSet?: boolean;
}

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
            return `${formatDate(new Date(event.start.date))} (All day)`;
        } else if (event.start.dateTime) {
            // This is a timed event
            return `${formatDate(new Date(event.start.dateTime))} • ${formatTime(new Date(event.start.dateTime))} - ${formatTime(new Date(event.end.dateTime || ''))}`;
        }
        return 'Date not specified';
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

    // Get current month and year as string
    const getCurrentMonthYearString = () => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[currentMonth]} ${currentYear}`;
    };

    // Get holiday month and year as string
    const getHolidayMonthYearString = () => {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${monthNames[holidayMonth]} ${holidayYear}`;
    };

    // Select a specific month for events
    const selectMonth = (month: number) => {
        setCurrentMonth(month);
        setShowMonthPicker(false);
    };

    // Select a specific month for holidays
    const selectHolidayMonth = (month: number) => {
        setHolidayMonth(month);
        setShowHolidayMonthPicker(false);
    };

    // Memoize filtered events to avoid re-filtering on every render
    const eventsForCurrentMonth = useMemo(() => {
        // Get current date at midnight to compare properly
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return events.filter(event => {
            const eventDate = event.start.dateTime
                ? new Date(event.start.dateTime)
                : event.start.date
                    ? new Date(event.start.date)
                    : null;

            if (!eventDate) return false;

            // Filter by month/year and also check if the event date is not in the past
            return eventDate.getFullYear() === currentYear &&
                eventDate.getMonth() === currentMonth &&
                eventDate >= today;
        }).sort((a, b) => {
            const dateA = a.start.dateTime ? new Date(a.start.dateTime) : new Date(a.start.date || "");
            const dateB = b.start.dateTime ? new Date(b.start.dateTime) : new Date(b.start.date || "");
            return dateA.getTime() - dateB.getTime();
        });
    }, [events, currentYear, currentMonth]);

    // Filter holidays for current month
    const holidaysForCurrentMonth = useMemo(() => {
        return holidays.filter(holiday => {
            const holidayDate = holiday.start.dateTime
                ? new Date(holiday.start.dateTime)
                : holiday.start.date
                    ? new Date(holiday.start.date)
                    : null;

            if (!holidayDate) return false;

            return holidayDate.getFullYear() === holidayYear &&
                holidayDate.getMonth() === holidayMonth;
        }).sort((a, b) => {
            const dateA = a.start.date ? new Date(a.start.date) : new Date();
            const dateB = b.start.date ? new Date(b.start.date) : new Date();
            return dateA.getTime() - dateB.getTime();
        });
    }, [holidays, holidayYear, holidayMonth]);

    // Add a reminder for an event
    const handleAddReminder = async (event: CalendarEvent) => {
        try {
            const success = await calendarService.addEventReminder(event);
            if (success) {
                // Update the event state to show reminder is set
                const updatedEvents = events.map(e =>
                    e.id === event.id ? { ...e, reminderSet: true } : e
                );
                setEvents(updatedEvents);
                alert('Reminder set for this event');
            } else {
                alert('Failed to set reminder. Please try again.');
            }
        } catch (error) {
            console.error('Error adding reminder:', error);
            alert('Error adding reminder');
        }
    };

    // Add event to device calendar
    const handleAddToDeviceCalendar = async (event: CalendarEvent) => {
        try {
            const success = await calendarService.addToDeviceCalendar(event);
            if (success) {
                alert('Event added to your device calendar');
            } else {
                alert('Failed to add to calendar. Please try again.');
            }
        } catch (error) {
            console.error('Error adding to device calendar:', error);
            alert('Error adding to calendar');
        }
    };

    const renderEventCard = (event: CalendarEvent) => (
        <View key={event.id} style={eventsStyles.eventCard}>
            <View style={eventsStyles.eventHeader}>
                <Text style={eventsStyles.eventTitle}>
                    {event.summary}
                    {event.recurrence && <Text style={eventsStyles.recurringTag}> (Recurring)</Text>}
                    {event.reminderSet && (
                        <Ionicons name="notifications" size={16} color="#FF9843" style={{ marginLeft: 5 }} />
                    )}
                </Text>
                <View style={eventsStyles.dateContainer}>
                    <Text style={eventsStyles.dateText}>
                        {event.start.dateTime
                            ? new Date(event.start.dateTime).getDate()
                            : event.start.date
                                ? new Date(event.start.date).getDate()
                                : ''}
                    </Text>
                </View>
            </View>

            <Text style={eventsStyles.eventDate}>
                {formatEventDate(event)}
            </Text>

            {/* Display location with improved formatting */}
            {event.formattedLocation && (
                <TouchableOpacity
                    style={eventsStyles.eventLocation}
                    onPress={() => event.formattedLocation?.mapUrl
                        ? Linking.openURL(event.formattedLocation.mapUrl)
                        : handleOpenMap(event.location || '')}
                >
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text style={eventsStyles.eventLocationText}>
                        {event.formattedLocation.address}
                    </Text>
                </TouchableOpacity>
            )}

            {/* Display images in an optimized gallery format */}
            {event.imageUrls && event.imageUrls.length > 0 && (
                <View style={eventsStyles.eventImageContainer}>
                    <Image
                        source={{ uri: event.imageUrls[0] }}
                        style={eventsStyles.eventImage}
                        resizeMode="cover"
                        onError={(e) => console.log(`Error loading image: ${event.imageUrls?.[0]}`, e.nativeEvent.error)}
                    />
                    {event.imageUrls.length > 1 && (
                        <View style={eventsStyles.imageCountBadge}>
                            <Text style={eventsStyles.moreImagesText}>
                                +{event.imageUrls.length - 1}
                            </Text>
                        </View>
                    )}
                </View>
            )}

            {/* Display formatted description with better styling */}
            {event.formattedDescription && (
                <View style={eventsStyles.descriptionContainer}>
                    <Text style={eventsStyles.eventDescription}>
                        {event.formattedDescription.length > 150
                            ? `${event.formattedDescription.substring(0, 150)}...`
                            : event.formattedDescription}
                    </Text>

                    {event.formattedDescription.length > 150 && (
                        <TouchableOpacity
                            style={eventsStyles.readMoreButton}
                            onPress={() => handleViewFullDescription(event)}
                        >
                            <Text style={eventsStyles.readMoreText}>Read More</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Display attachments if available */}
            {event.attachments && event.attachments.length > 0 && (
                <View style={eventsStyles.attachmentsContainer}>
                    <Text style={eventsStyles.attachmentsTitle}>Attachments:</Text>
                    {event.attachments.map((attachment, index) => (
                        <TouchableOpacity
                            key={index}
                            style={eventsStyles.attachmentItem}
                            onPress={() => Linking.openURL(attachment.url)}
                        >
                            <Ionicons name="document-outline" size={14} color="#666" />
                            <Text style={eventsStyles.attachmentText}>
                                {attachment.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View style={eventsStyles.buttonContainer}>
                {event.location && (
                    <TouchableOpacity
                        style={eventsStyles.detailsButton}
                        onPress={() => handleOpenMap(event.location || '')}
                    >
                        <Text style={eventsStyles.buttonText}>View Location</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={eventsStyles.registerButton}
                    onPress={() => handleAddToCalendar(event)}
                >
                    <Text style={eventsStyles.buttonText}>Add to Calendar</Text>
                </TouchableOpacity>
            </View>

            {/* Additional action buttons */}
            <View style={eventsStyles.additionalButtonsContainer}>
                <TouchableOpacity
                    style={eventsStyles.secondaryButton}
                    onPress={() => handleAddReminder(event)}
                >
                    <Ionicons name="notifications-outline" size={14} color="#FF9843" style={{ marginRight: 5 }} />
                    <Text style={eventsStyles.secondaryButtonText}>Set Reminder</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={eventsStyles.secondaryButton}
                    onPress={() => Linking.openURL('https://fr.egliselacite.com/events2')}
                >
                    <Ionicons name="open-outline" size={14} color="#FF9843" style={{ marginRight: 5 }} />
                    <Text style={eventsStyles.secondaryButtonText}>View Details</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderHolidayCard = (holiday: CalendarEvent) => (
        <View key={holiday.id} style={eventsStyles.holidayCard}>
            <View style={eventsStyles.eventHeader}>
                <Text style={eventsStyles.holidayTitle}>{holiday.summary}</Text>
                <View style={eventsStyles.dateContainer}>
                    <Text style={eventsStyles.dateText}>
                        {holiday.start.date
                            ? new Date(holiday.start.date).getDate()
                            : ''}
                    </Text>
                </View>
            </View>
            <View style={eventsStyles.holidayTag}>
                <Text style={eventsStyles.holidayTagText}>Public Holiday</Text>
            </View>
            <Text style={eventsStyles.holidayDate}>
                {holiday.start.date ? formatDate(new Date(holiday.start.date)) : ''}
            </Text>
            {holiday.description && (
                <Text style={eventsStyles.eventDescription}>{holiday.description}</Text>
            )}
            <TouchableOpacity
                style={eventsStyles.registerButton}
                onPress={() => handleAddToCalendar(holiday)}
            >
                <Text style={eventsStyles.buttonText}>Add to Calendar</Text>
            </TouchableOpacity>
        </View>
    );

    // Render month picker for events
    const renderMonthPicker = () => {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        return (
            <View style={eventsStyles.monthPicker}>
                {months.map((month, index) => (
                    <TouchableOpacity
                        key={month}
                        style={[
                            eventsStyles.monthPickerItem,
                            currentMonth === index && eventsStyles.monthPickerItemActive
                        ]}
                        onPress={() => selectMonth(index)}
                    >
                        <Text style={[
                            eventsStyles.monthPickerText,
                            currentMonth === index && eventsStyles.monthPickerTextActive
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
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        return (
            <View style={eventsStyles.monthPicker}>
                {months.map((month, index) => (
                    <TouchableOpacity
                        key={month}
                        style={[
                            eventsStyles.monthPickerItem,
                            holidayMonth === index && eventsStyles.monthPickerItemActive
                        ]}
                        onPress={() => selectHolidayMonth(index)}
                    >
                        <Text style={[
                            eventsStyles.monthPickerText,
                            holidayMonth === index && eventsStyles.monthPickerTextActive
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
                <View style={eventsStyles.noEventsContainer}>
                    <ActivityIndicator size="large" color="#FF9843" />
                    <Text style={eventsStyles.noEventsText}>Loading events...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={eventsStyles.noEventsContainer}>
                    <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
                    <Text style={eventsStyles.noEventsText}>{error}</Text>
                    <TouchableOpacity
                        style={eventsStyles.detailsButton}
                        onPress={() => fetchEvents(currentYear, currentMonth)}
                    >
                        <Text style={eventsStyles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (eventsForCurrentMonth.length === 0) {
            return (
                <View style={eventsStyles.noEventsContainer}>
                    <Ionicons name="calendar-outline" size={40} color="#ccc" />
                    <Text style={eventsStyles.noEventsText}>
                        No events found for {getCurrentMonthYearString()}
                    </Text>
                </View>
            );
        }

        return eventsForCurrentMonth.map(renderEventCard);
    };

    // Render French holidays for current month
    const renderCurrentMonthHolidays = () => {
        if (holidaysLoading) {
            return (
                <View style={eventsStyles.noEventsContainer}>
                    <ActivityIndicator size="large" color="#FF9843" />
                    <Text style={eventsStyles.noEventsText}>Loading holidays...</Text>
                </View>
            );
        }

        if (holidaysError) {
            return (
                <View style={eventsStyles.noEventsContainer}>
                    <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
                    <Text style={eventsStyles.noEventsText}>{holidaysError}</Text>
                    <TouchableOpacity
                        style={eventsStyles.detailsButton}
                        onPress={() => fetchHolidays(holidayYear, holidayMonth)}
                    >
                        <Text style={eventsStyles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (holidaysForCurrentMonth.length === 0) {
            return (
                <View style={eventsStyles.noEventsContainer}>
                    <Ionicons name="calendar-outline" size={40} color="#ccc" />
                    <Text style={eventsStyles.noEventsText}>
                        No holidays found for {getHolidayMonthYearString()}
                    </Text>
                </View>
            );
        }

        return holidaysForCurrentMonth.map(renderHolidayCard);
    };

    return (
        <View style={eventsStyles.container}>
            <ScrollView
                style={eventsStyles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FF9843']}
                    />
                }
            >
                <View style={eventsStyles.header}>
                    <Text style={eventsStyles.title}>
                        Events
                    </Text>
                    <Text style={eventsStyles.subtitle}>
                        Join us for upcoming church events
                    </Text>
                </View>

                {/* Calendar View - Always visible */}
                <View style={eventsStyles.calendarContainer}>
                    <WebView
                        source={{ uri: calendarService.getCalendarEmbedUrl() }}
                        style={eventsStyles.calendar}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        onError={(e) => {
                            setCalendarError('Failed to load calendar view. Please try again later.');
                            console.error('WebView error:', e.nativeEvent);
                        }}
                    />
                    {calendarError && (
                        <Text style={eventsStyles.errorText}>{calendarError}</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={eventsStyles.detailsButton}
                    onPress={handleOpenCalendar}
                >
                    <Ionicons name="open-outline" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={eventsStyles.buttonText}>Open Calendar in Browser</Text>
                </TouchableOpacity>

                <View style={eventsStyles.tabContainer}>
                    <TouchableOpacity
                        style={[eventsStyles.tab, activeTab === 'upcoming' && eventsStyles.activeTab]}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <Text style={[eventsStyles.tabText, activeTab === 'upcoming' && eventsStyles.activeTabText]}>
                            Church Events
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[eventsStyles.tab, activeTab === 'holidays' && eventsStyles.activeTab]}
                        onPress={() => {
                            setActiveTab('holidays');
                            if (holidays.length === 0) {
                                fetchHolidays(holidayYear, holidayMonth);
                            }
                        }}
                    >
                        <Text style={[eventsStyles.tabText, activeTab === 'holidays' && eventsStyles.activeTabText]}>
                            French Holidays
                        </Text>
                    </TouchableOpacity>
                </View>

                {activeTab === 'upcoming' && (
                    <>
                        {/* Month navigation */}
                        <View style={eventsStyles.monthNavigation}>
                            <TouchableOpacity
                                style={eventsStyles.monthNavigationButton}
                                onPress={prevMonth}
                            >
                                <Ionicons name="chevron-back" size={24} color="#666" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={eventsStyles.yearPickerButton}
                                onPress={() => setShowMonthPicker(!showMonthPicker)}
                            >
                                <Text style={eventsStyles.currentMonthDisplay}>
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
                                style={eventsStyles.monthNavigationButton}
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
                            style={eventsStyles.refreshButton}
                            onPress={() => fetchEvents(currentYear, currentMonth)}
                        >
                            <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={eventsStyles.buttonText}>Refresh Events</Text>
                        </TouchableOpacity>
                    </>
                )}

                {activeTab === 'holidays' && (
                    <>
                        {/* Month navigation for holidays */}
                        <View style={eventsStyles.monthNavigation}>
                            <TouchableOpacity
                                style={eventsStyles.monthNavigationButton}
                                onPress={prevHolidayMonth}
                            >
                                <Ionicons name="chevron-back" size={24} color="#666" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={eventsStyles.yearPickerButton}
                                onPress={() => setShowHolidayMonthPicker(!showHolidayMonthPicker)}
                            >
                                <Text style={eventsStyles.currentMonthDisplay}>
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
                                style={eventsStyles.monthNavigationButton}
                                onPress={nextHolidayMonth}
                            >
                                <Ionicons name="chevron-forward" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Month picker for holidays */}
                        {showHolidayMonthPicker && renderHolidayMonthPicker()}

                        <Text style={eventsStyles.sectionTitle}>French Public Holidays</Text>

                        {/* Holidays for current month */}
                        {renderCurrentMonthHolidays()}

                        <TouchableOpacity
                            style={eventsStyles.refreshButton}
                            onPress={() => fetchHolidays(holidayYear, holidayMonth)}
                        >
                            <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={eventsStyles.buttonText}>Refresh Holidays</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>

            {/* Full Description Modal */}
            {showFullDescription && selectedEvent && (
                <View style={eventsStyles.descriptionModal}>
                    <View style={eventsStyles.descriptionModalContent}>
                        <View style={eventsStyles.descriptionModalHeader}>
                            <Text style={eventsStyles.descriptionModalTitle}>{selectedEvent.summary}</Text>
                            <TouchableOpacity
                                style={eventsStyles.closeButton}
                                onPress={() => setShowFullDescription(false)}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={eventsStyles.modalScrollView}>
                            {/* Display event date */}
                            <Text style={eventsStyles.modalEventDate}>
                                {formatEventDate(selectedEvent)}
                            </Text>

                            {/* Display location if available */}
                            {selectedEvent.formattedLocation && (
                                <TouchableOpacity
                                    style={eventsStyles.eventLocation}
                                    onPress={() => {
                                        setShowFullDescription(false);
                                        selectedEvent.formattedLocation?.mapUrl
                                            ? Linking.openURL(selectedEvent.formattedLocation.mapUrl)
                                            : handleOpenMap(selectedEvent.location || '');
                                    }}
                                >
                                    <Ionicons name="location-outline" size={16} color="#666" />
                                    <Text style={eventsStyles.eventLocationText}>
                                        {selectedEvent.formattedLocation.address}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {/* Display all images in the modal */}
                            {selectedEvent.imageUrls && selectedEvent.imageUrls.length > 0 && (
                                <View style={eventsStyles.modalImagesContainer}>
                                    {selectedEvent.imageUrls.map((imageUrl, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: imageUrl }}
                                            style={eventsStyles.modalImage}
                                            resizeMode="cover"
                                            onError={(e) => console.log(`Error loading image: ${imageUrl}`, e.nativeEvent.error)}
                                        />
                                    ))}
                                </View>
                            )}

                            {/* Full description */}
                            {selectedEvent.formattedDescription && (
                                <Text style={eventsStyles.descriptionModalText}>
                                    {selectedEvent.formattedDescription}
                                </Text>
                            )}

                            {/* Attachments in modal */}
                            {selectedEvent.attachments && selectedEvent.attachments.length > 0 && (
                                <View style={eventsStyles.modalAttachmentsContainer}>
                                    <Text style={eventsStyles.modalAttachmentsTitle}>Attachments:</Text>
                                    {selectedEvent.attachments.map((attachment, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={eventsStyles.modalAttachmentItem}
                                            onPress={() => {
                                                Linking.openURL(attachment.url);
                                            }}
                                        >
                                            <Ionicons name="document-outline" size={16} color="#666" />
                                            <Text style={eventsStyles.modalAttachmentText}>
                                                {attachment.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </ScrollView>

                        <View style={eventsStyles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={eventsStyles.modalCloseButton}
                                onPress={() => setShowFullDescription(false)}
                            >
                                <Text style={eventsStyles.buttonText}>Close</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={eventsStyles.modalActionButton}
                                onPress={() => {
                                    setShowFullDescription(false);
                                    handleAddToCalendar(selectedEvent);
                                }}
                            >
                                <Text style={eventsStyles.buttonText}>Add to Calendar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};