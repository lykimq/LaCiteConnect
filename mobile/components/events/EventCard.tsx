/**
 * EventCard Component
 *
 * Displays a single calendar event in a card format for the list view.
 * Shows event details including date, title, location, and a preview of the description.
 * Provides action buttons for calendar integration, opening external links, and viewing on map.
 */
import React from 'react';
import { View, Text, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventsStyles } from '../../styles/events/EventsContent.styles';
import { CalendarEvent } from './types'
import { convertHtmlToFormattedText, parseLocationString } from '../../utils/htmlUtils';
import RenderHtml, { CustomBlockRenderer } from 'react-native-render-html';
import { createEventCardHtmlStyles } from '../../styles/events/EventCard.styles';

/**
 * Props for the EventCard component
 */
interface EventCardProps {
    event: CalendarEvent;                  // The event data to display
    content: {                             // Localized content strings
        months?: string[];                 // Localized month names
        ui?: {
            allDayText?: string;           // Text for all-day events
            dateNotSpecifiedText?: string; // Text for events with no date
        };
    };
    onViewFullDescription: (event: CalendarEvent) => void;  // Handler for viewing the full description
    onAddToCalendar: (event: CalendarEvent) => void;        // Handler for adding event to device calendar
    onViewDetailUrl: (event: CalendarEvent) => void;        // Handler for opening event detail URL
    onOpenMap: (location: string) => void;                  // Handler for opening map with location
}

/**
 * Custom Text Renderer that limits text to 2 lines with ellipsis
 */
const TruncatedTextRenderer: CustomBlockRenderer = function TruncatedTextRenderer({
    TDefaultRenderer,
    ...props
}) {
    return (
        <TDefaultRenderer
            {...props}
            textProps={{
                ...props.textProps,
                numberOfLines: 2,
                ellipsizeMode: 'tail'
            }}
        />
    );
};

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
    const { width } = useWindowDimensions();

    // Process event date for display
    const eventDate = new Date(event.start.dateTime || event.start.date || '');
    const monthIndex = eventDate.getMonth();

    // Process event description and location
    const htmlContent = event.description ? { html: event.description } : { html: '' };
    const locationDetails = event.location ? parseLocationString(event.location) : null;

    // Get HTML styles from the styles file
    const tagsStyles = createEventCardHtmlStyles(themeColors);

    // Custom renderers that enforce 2-line limit
    const renderers = {
        p: TruncatedTextRenderer
    };

    return (
        <View key={event.id} style={styles.eventCard}>
            <View style={styles.eventContent}>
                {/* Date Icon - Shows day number and month name */}
                <View style={styles.dateIconContainer}>
                    <Text style={styles.dayNumber}>{eventDate.getDate()}</Text>
                    <Text style={styles.monthName}>
                        {content?.months?.[monthIndex] || eventDate.toLocaleString('default', { month: 'short' })}
                    </Text>
                </View>

                {/* Event Title */}
                <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle} numberOfLines={2}>
                        {event.summary}
                    </Text>
                </View>

                {/* Event Location - Only displayed if available */}
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

                {/* Event Description Preview with HTML rendering */}
                {event.description && (
                    <TouchableOpacity
                        style={styles.eventDescription}
                        onPress={() => onViewFullDescription(event)}
                        activeOpacity={0.7}
                    >
                        <RenderHtml
                            contentWidth={width - 100} // Account for padding and date icon
                            source={htmlContent}
                            tagsStyles={tagsStyles}
                            renderers={renderers}
                            enableExperimentalMarginCollapsing={true}
                        />
                    </TouchableOpacity>
                )}

                {/* Action Buttons */}
                <View style={styles.eventActions}>
                    {/* Add to Calendar Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryActionButton]}
                        onPress={() => onAddToCalendar(event)}
                    >
                        <Ionicons name="calendar-outline" size={16} color={themeColors.primary} />
                    </TouchableOpacity>

                    {/* External Details Link Button - Only displayed if available */}
                    {event.detailsUrl && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.secondaryActionButton]}
                            onPress={() => onViewDetailUrl(event)}
                        >
                            <Ionicons name="open-outline" size={16} color={themeColors.primary} />
                        </TouchableOpacity>
                    )}

                    {/* Map Location Button - Only displayed if location available */}
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