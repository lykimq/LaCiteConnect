import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventsStyles } from '../../styles/EventsContent.styles';
import { CalendarEvent } from './types';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { convertHtmlToFormattedText, parseLocationString } from '../../utils/htmlUtils';

interface EventCardProps {
    event: CalendarEvent;
    content: {
        months?: string[];
        ui?: {
            allDayText?: string;
            dateNotSpecifiedText?: string;
        };
    };
    onViewFullDescription: (event: CalendarEvent) => void;
    onAddToCalendar: (event: CalendarEvent) => void;
    onViewDetailUrl: (event: CalendarEvent) => void;
    onOpenMap: (location: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
    event,
    content,
    onViewFullDescription,
    onAddToCalendar,
    onViewDetailUrl,
    onOpenMap
}) => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);

    const eventDate = new Date(event.start.dateTime || event.start.date || '');
    const monthIndex = eventDate.getMonth();

    // Format the description using HTML utils
    const formattedDescription = event.description ? convertHtmlToFormattedText(event.description) : '';
    const locationDetails = event.location ? parseLocationString(event.location) : null;

    return (
        <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventContent}>
                {/* Simplified Date Icon */}
                <View style={styles.dateIconContainer}>
                    <Text style={styles.dayNumber}>{eventDate.getDate()}</Text>
                    <Text style={styles.monthName}>
                        {content?.months?.[monthIndex] || eventDate.toLocaleString('default', { month: 'short' })}
                    </Text>
                </View>

                <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.summary}
                    </Text>
                </View>

                {locationDetails && (
                    <TouchableOpacity
                        style={styles.eventLocation}
                        onPress={() => onOpenMap(event.location || '')}
                    >
                        <Ionicons
                            name="location-outline"
                            size={18}
                            color={themeColors.primary}
                            style={{ marginTop: 2 }}
                        />
                        <Text style={styles.locationText}>
                            {locationDetails.address}
                        </Text>
                    </TouchableOpacity>
                )}

                {formattedDescription && (
                    <Text
                        style={styles.eventDescription}
                        numberOfLines={2}
                        onPress={() => onViewFullDescription(event)}
                    >
                        {formattedDescription}
                    </Text>
                )}

                <View style={styles.eventActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryActionButton]}
                        onPress={() => onAddToCalendar(event)}
                    >
                        <Ionicons name="calendar-outline" size={16} color={themeColors.primary} />
                    </TouchableOpacity>

                    {event.detailsUrl && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryActionButton]}
                            onPress={() => onViewDetailUrl(event)}
                        >
                            <Ionicons name="open-outline" size={16} color={themeColors.primary} />
                        </TouchableOpacity>
                    )}

                    {locationDetails && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryActionButton]}
                            onPress={() => onOpenMap(event.location || '')}
                        >
                            <Ionicons name="map-outline" size={16} color={themeColors.primary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};