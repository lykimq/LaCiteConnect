import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Dimensions, ActivityIndicator } from 'react-native';
import { welcomeStyles } from '../../styles/welcome.styles';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { calendarService } from '../../services/calendarService';

const { width } = Dimensions.get('window');

type EventsContentProps = {
    showProfileSection?: boolean;
    userData?: {
        firstName: string;
        lastName: string;
    };
};

interface GoogleCalendarEvent {
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

export const EventsContent = ({ showProfileSection, userData }: EventsContentProps) => {
    const { colors } = useTheme();
    const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarError, setCalendarError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setCalendarError(null);

            // Fetch events from personal calendar
            const data = await calendarService.getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            setCalendarError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCalendar = (event: GoogleCalendarEvent) => {
        const url = calendarService.generateAddToCalendarUrl(event);
        Linking.openURL(url);
    };

    const handleOpenCalendar = () => {
        Linking.openURL(calendarService.getCalendarEmbedUrl());
    };

    const formatEventDate = (event: GoogleCalendarEvent) => {
        if (event.start.date) {
            // This is an all-day event
            return `${formatDate(new Date(event.start.date))} (All day)`;
        } else if (event.start.dateTime) {
            // This is a timed event
            return `${formatDate(new Date(event.start.dateTime))} • ${formatTime(new Date(event.start.dateTime))} - ${formatTime(new Date(event.end.dateTime || ''))}`;
        }
        return 'Date not specified';
    };

    const renderEventCard = (event: GoogleCalendarEvent) => (
        <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventHeader}>
                <Ionicons name="calendar" size={24} color="#FF9843" style={styles.eventIcon} />
                <View style={styles.eventTitleContainer}>
                    <Text style={styles.eventTitle}>{event.summary}</Text>
                    <Text style={styles.eventDate}>
                        {formatEventDate(event)}
                    </Text>
                </View>
            </View>
            {event.description && (
                <Text style={styles.eventDescription}>{event.description}</Text>
            )}
            <View style={styles.eventFooter}>
                {event.location && (
                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(event.location || '')}`)}
                    >
                        <Ionicons name="location" size={16} color="#FF9843" />
                        <Text style={styles.locationText}>{event.location}</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.calendarButton}
                    onPress={() => handleAddToCalendar(event)}
                >
                    <Ionicons name="add-circle" size={16} color="#FF9843" />
                    <Text style={styles.calendarButtonText}>Add to Calendar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    // Group events by month
    const groupEventsByMonth = (eventsList: GoogleCalendarEvent[]) => {
        const grouped: { [key: string]: GoogleCalendarEvent[] } = {};

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

    // Render grouped events by month
    const renderGroupedEvents = () => {
        const groupedEvents = groupEventsByMonth(events);
        const monthKeys = Object.keys(groupedEvents);

        // Sort months chronologically
        monthKeys.sort((a, b) => {
            const dateA = new Date(groupedEvents[a][0].start.dateTime || groupedEvents[a][0].start.date || "");
            const dateB = new Date(groupedEvents[b][0].start.dateTime || groupedEvents[b][0].start.date || "");
            return dateA.getTime() - dateB.getTime();
        });

        return monthKeys.map(month => (
            <View key={month} style={styles.monthGroup}>
                <Text style={styles.monthTitle}>{month}</Text>
                {groupedEvents[month].map(renderEventCard)}
            </View>
        ));
    };

    return (
        <ScrollView
            contentContainerStyle={welcomeStyles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                <Text style={[welcomeStyles.title, { color: colors.text }]}>
                    My Calendar
                </Text>
                <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                    View and manage your upcoming events
                </Text>
            </View>

            <View style={welcomeStyles.featuresContainer}>
                {/* Google Calendar Integration */}
                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="calendar" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Personal Calendar</Text>

                        <TouchableOpacity
                            style={styles.openCalendarButton}
                            onPress={handleOpenCalendar}
                        >
                            <Ionicons name="open-outline" size={20} color="#FF9843" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.calendarContainer}>
                        <WebView
                            source={{ uri: calendarService.getCalendarEmbedUrl() }}
                            style={styles.calendar}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            androidLayerType="hardware"
                            androidHardwareAccelerationDisabled={false}
                            onError={(syntheticEvent) => {
                                const { nativeEvent } = syntheticEvent;
                                console.warn('WebView error: ', nativeEvent);
                                setCalendarError('Failed to load calendar view. Please try again later.');
                            }}
                        />
                    </View>

                    {calendarError && (
                        <Text style={styles.errorText}>{calendarError}</Text>
                    )}
                </View>

                {/* Upcoming Events List */}
                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="list" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Upcoming Events</Text>
                    </View>
                    {loading ? (
                        <ActivityIndicator size="large" color="#FF9843" style={styles.loader} />
                    ) : calendarError ? (
                        <Text style={styles.errorText}>{calendarError}</Text>
                    ) : events.length > 0 ? (
                        renderGroupedEvents()
                    ) : (
                        <Text style={styles.noEventsText}>No upcoming events at the moment.</Text>
                    )}
                </View>

                {/* Refresh Button */}
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={fetchEvents}
                >
                    <Ionicons name="refresh" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.refreshButtonText}>Refresh Events</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardIcon: {
        marginRight: 10,
    },
    calendarContainer: {
        marginTop: 15,
        width: '100%',
        height: 400,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    calendar: {
        flex: 1,
        backgroundColor: '#fff',
    },
    videoContainer: {
        marginTop: 15,
        width: '100%',
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    video: {
        flex: 1,
        backgroundColor: '#000',
    },
    actionButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eventHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    eventIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    eventTitleContainer: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 4,
    },
    eventDate: {
        fontSize: 14,
        color: '#666',
    },
    eventDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        lineHeight: 20,
    },
    eventFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    locationText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
        flex: 1,
    },
    calendarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FF9843',
    },
    calendarButtonText: {
        fontSize: 14,
        color: '#FF9843',
        marginLeft: 4,
    },
    loader: {
        marginVertical: 20,
    },
    noEventsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
    },
    errorText: {
        fontSize: 14,
        color: '#FF3B30',
        textAlign: 'center',
        marginVertical: 20,
    },
    refreshButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    refreshButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    monthGroup: {
        marginBottom: 20,
    },
    monthTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 10,
        paddingHorizontal: 5,
        paddingVertical: 8,
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
        borderLeftWidth: 3,
        borderLeftColor: '#FF9843',
    },
    openCalendarButton: {
        marginLeft: 'auto',
        padding: 5,
    },
});