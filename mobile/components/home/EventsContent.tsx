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

type CalendarMode = 'lacite' | 'public' | 'my';

export const EventsContent = ({ showProfileSection, userData }: EventsContentProps) => {
    const { colors } = useTheme();
    const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarError, setCalendarError] = useState<string | null>(null);
    const [calendarMode, setCalendarMode] = useState<CalendarMode>('public');

    useEffect(() => {
        fetchEvents();
    }, [calendarMode]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setCalendarError(null);

            let data: GoogleCalendarEvent[];
            if (calendarMode === 'lacite') {
                try {
                    data = await calendarService.getLaCiteEvents();
                } catch (error) {
                    console.error('Error fetching La Cité events, falling back to public calendar:', error);
                    setCalendarMode('public');
                    data = await calendarService.getPublicEvents();
                }
            } else {
                data = await calendarService.getPublicEvents();
            }

            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            setCalendarError('Failed to load events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleFindUs = () => {
        Linking.openURL('https://maps.google.com/?q=24+Rue+Antoine-Julien-Hénard+75012+Paris');
    };

    const handleWatchOnline = () => {
        Linking.openURL('https://www.youtube.com/watch?v=SmPZrx7W1Eo');
    };

    const handleAddToCalendar = (event: GoogleCalendarEvent) => {
        const url = calendarService.generateAddToCalendarUrl(event);
        Linking.openURL(url);
    };

    const handleOpenCalendar = () => {
        if (calendarMode === 'my') {
            // Open the user's personal Google Calendar
            Linking.openURL('https://calendar.google.com/calendar/u/0/r?hl=en-GB');
        } else {
            const url = calendarMode === 'lacite'
                ? 'https://calendar.google.com/calendar/u/0?cid=ZWdsaXNlbGFjaXRlLmNvbV9ldmVudHNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ'
                : 'https://calendar.google.com/calendar/u/0?cid=ZW4uZnJlbmNoI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t';
            Linking.openURL(url);
        }
    };

    const toggleCalendarMode = () => {
        setCalendarMode(prev => prev === 'lacite' ? 'public' : 'lacite');
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

    const getCalendarTitle = () => {
        switch (calendarMode) {
            case 'lacite': return 'La Cité Events';
            case 'public': return 'French Holidays';
            case 'my': return 'My Personal Calendar';
            default: return 'Calendar';
        }
    };

    const getCalendarEmbedUrl = () => {
        switch (calendarMode) {
            case 'lacite':
                return calendarService.getCalendarEmbedUrl('egliselacite.com_events@group.calendar.google.com');
            case 'my':
                // For personal calendar, we'll open in a browser instead
                return 'https://calendar.google.com/calendar/embed?src=primary';
            case 'public':
            default:
                return calendarService.getCalendarEmbedUrl('en.french#holiday@group.v.calendar.google.com');
        }
    };

    return (
        <ScrollView
            contentContainerStyle={welcomeStyles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                <Text style={[welcomeStyles.title, { color: colors.text }]}>
                    {showProfileSection && userData ? 'Welcome to La Cité Connect' : 'Our Events'}
                </Text>
                <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                    {showProfileSection && userData
                        ? 'To know Jesus and make Him known in Paris'
                        : 'Join us for our upcoming events'}
                </Text>
            </View>

            <View style={welcomeStyles.featuresContainer}>
                {/* Calendar Selection */}
                <View style={styles.calendarSelector}>
                    <TouchableOpacity
                        style={[
                            styles.calendarOption,
                            calendarMode === 'public' && styles.calendarOptionActive
                        ]}
                        onPress={() => setCalendarMode('public')}
                    >
                        <Text style={[
                            styles.calendarOptionText,
                            calendarMode === 'public' && styles.calendarOptionTextActive
                        ]}>
                            French Holidays
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.calendarOption,
                            calendarMode === 'my' && styles.calendarOptionActive
                        ]}
                        onPress={() => {
                            setCalendarMode('my');
                            // When selecting My Calendar, open it directly
                            Linking.openURL('https://calendar.google.com/calendar/u/0/r?hl=en-GB');
                        }}
                    >
                        <Text style={[
                            styles.calendarOptionText,
                            calendarMode === 'my' && styles.calendarOptionTextActive
                        ]}>
                            My Calendar
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Google Calendar Integration */}
                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="calendar" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>{getCalendarTitle()}</Text>

                        <TouchableOpacity
                            style={styles.openCalendarButton}
                            onPress={handleOpenCalendar}
                        >
                            <Ionicons name="open-outline" size={20} color="#FF9843" />
                        </TouchableOpacity>
                    </View>

                    {calendarMode === 'my' ? (
                        <View style={styles.directCalendarAccess}>
                            <Text style={styles.directCalendarText}>
                                Access your personal calendar directly through Google Calendar
                            </Text>
                            <TouchableOpacity
                                style={styles.openGoogleCalendarButton}
                                onPress={() => Linking.openURL('https://calendar.google.com/calendar/u/0/r?hl=en-GB')}
                            >
                                <Ionicons name="open" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                                <Text style={styles.openGoogleCalendarText}>Open Google Calendar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.calendarContainer}>
                            <WebView
                                source={{ uri: getCalendarEmbedUrl() }}
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
                    )}

                    {calendarError && calendarMode !== 'my' && (
                        <Text style={styles.errorText}>{calendarError}</Text>
                    )}
                </View>

                {/* Upcoming Events List */}
                {calendarMode !== 'my' && (
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
                            events.map(renderEventCard)
                        ) : (
                            <Text style={styles.noEventsText}>No upcoming events at the moment.</Text>
                        )}
                    </View>
                )}

                {/* Refresh Button - only show for public calendars */}
                {calendarMode !== 'my' && (
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={fetchEvents}
                    >
                        <Ionicons name="refresh" size={16} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.refreshButtonText}>Refresh Events</Text>
                    </TouchableOpacity>
                )}
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
    signInButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 15,
        alignSelf: 'center',
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    authContainer: {
        padding: 20,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 15,
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
    calendarSelector: {
        flexDirection: 'row',
        marginBottom: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        overflow: 'hidden',
    },
    calendarOption: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    calendarOptionActive: {
        backgroundColor: '#FF9843',
    },
    calendarOptionText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    calendarOptionTextActive: {
        color: '#FFFFFF',
    },
    openCalendarButton: {
        marginLeft: 'auto',
        padding: 5,
    },
    directCalendarAccess: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginTop: 15,
    },
    directCalendarText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    openGoogleCalendarButton: {
        backgroundColor: '#4285F4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    openGoogleCalendarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});