import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Dimensions } from 'react-native';
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

export const EventsContent = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [calendarError, setCalendarError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await calendarService.getEvents();
            console.log(`Fetched ${data.length} events from calendar`);

            // Ensure each event has a unique ID by adding an index if needed
            const eventsWithUniqueIds = data.map((event, index) => {
                // If the ID already exists, append the index to make it unique
                return {
                    ...event,
                    id: `${event.id}_${index}`
                };
            });

            setEvents(eventsWithUniqueIds);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
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

    // Filter upcoming events (current date and forward)
    const upcomingEvents = events.filter(event => {
        const eventDate = event.start.dateTime ? new Date(event.start.dateTime) :
            event.start.date ? new Date(event.start.date) : null;
        if (!eventDate) return false;
        // Include today's events as upcoming
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate >= today;
    });

    // Filter past events (before current date)
    const pastEvents = events.filter(event => {
        const eventDate = event.start.dateTime ? new Date(event.start.dateTime) :
            event.start.date ? new Date(event.start.date) : null;
        if (!eventDate) return false;
        // Exclude today's events from past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return eventDate < today;
    });

    // Group events by month
    const groupEventsByMonth = (eventsList: CalendarEvent[]) => {
        const grouped: { [key: string]: CalendarEvent[] } = {};

        eventsList.forEach(event => {
            // Get month and year from event date
            let eventDate;
            if (event.start.dateTime) {
                eventDate = new Date(event.start.dateTime);
            } else if (event.start.date) {
                eventDate = new Date(event.start.date);
            } else {
                return; // Skip if no date
            }

            const monthYear = `${eventDate.toLocaleString('default', { month: 'long' })} ${eventDate.getFullYear()}`;

            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }

            grouped[monthYear].push(event);
        });

        return grouped;
    };

    const renderEventCard = (event: CalendarEvent) => (
        <View key={event.id} style={eventsStyles.eventCard}>
            <View style={eventsStyles.eventHeader}>
                <Text style={eventsStyles.eventTitle}>{event.summary}</Text>
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
            {event.location && (
                <Text style={eventsStyles.eventLocation}>
                    <Ionicons name="location-outline" size={14} color="#666" /> {event.location}
                </Text>
            )}
            {event.description && (
                <Text style={eventsStyles.eventDescription}>{event.description}</Text>
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
        </View>
    );

    // Render grouped events by month
    const renderGroupedEvents = (eventsList: CalendarEvent[]) => {
        const groupedEvents = groupEventsByMonth(eventsList);
        const monthKeys = Object.keys(groupedEvents);

        // Sort months chronologically
        monthKeys.sort((a, b) => {
            const monthA = a.split(' ')[0];
            const yearA = parseInt(a.split(' ')[1]);
            const monthB = b.split(' ')[0];
            const yearB = parseInt(b.split(' ')[1]);

            // Compare years first
            if (yearA !== yearB) {
                return yearA - yearB;
            }

            // If years are the same, compare months
            const months = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            return months.indexOf(monthA) - months.indexOf(monthB);
        });

        return monthKeys.map(month => (
            <View key={month} style={eventsStyles.monthGroup}>
                <Text style={eventsStyles.sectionTitle}>{month}</Text>
                {groupedEvents[month].map(renderEventCard)}
            </View>
        ));
    };

    return (
        <View style={eventsStyles.container}>
            <ScrollView
                style={eventsStyles.scrollView}
                showsVerticalScrollIndicator={false}
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
                            Upcoming ({upcomingEvents.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[eventsStyles.tab, activeTab === 'past' && eventsStyles.activeTab]}
                        onPress={() => setActiveTab('past')}
                    >
                        <Text style={[eventsStyles.tabText, activeTab === 'past' && eventsStyles.activeTabText]}>
                            Past ({pastEvents.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={eventsStyles.noEventsContainer}>
                        <ActivityIndicator size="large" color="#FF9843" />
                        <Text style={eventsStyles.noEventsText}>Loading events...</Text>
                    </View>
                ) : error ? (
                    <View style={eventsStyles.noEventsContainer}>
                        <Ionicons name="alert-circle-outline" size={40} color="#ccc" />
                        <Text style={eventsStyles.noEventsText}>{error}</Text>
                        <TouchableOpacity
                            style={eventsStyles.detailsButton}
                            onPress={fetchEvents}
                        >
                            <Text style={eventsStyles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {activeTab === 'upcoming' && (
                            <>
                                {upcomingEvents.length > 0 ? (
                                    renderGroupedEvents(upcomingEvents)
                                ) : (
                                    <View style={eventsStyles.noEventsContainer}>
                                        <Ionicons name="calendar-outline" size={40} color="#ccc" />
                                        <Text style={eventsStyles.noEventsText}>
                                            No upcoming events
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}

                        {activeTab === 'past' && (
                            <>
                                {pastEvents.length > 0 ? (
                                    renderGroupedEvents(pastEvents)
                                ) : (
                                    <View style={eventsStyles.noEventsContainer}>
                                        <Ionicons name="calendar-outline" size={40} color="#ccc" />
                                        <Text style={eventsStyles.noEventsText}>
                                            No past events
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </>
                )}

                <TouchableOpacity
                    style={eventsStyles.refreshButton}
                    onPress={fetchEvents}
                >
                    <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={eventsStyles.buttonText}>Refresh Events</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};