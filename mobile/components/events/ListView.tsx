/**
 * ListView Component
 *
 * Displays events in a vertical scrolling list format.
 * Includes a horizontal quick period selector that allows users to filter events by time period.
 * Renders each event as an EventCard component.
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventsStyles } from '../../styles/events/EventsContent.styles';
import { CalendarEvent, EventsContent } from './types';
import { EventCard } from './EventCard';

/**
 * Props for the ListView component
 */
interface ListViewProps {
    events: CalendarEvent[];                   // Array of events to display
    content: EventsContent | null;             // Localized content strings
    selectedQuickPeriod: 'all' | 'today' | 'tomorrow' | 'week' | 'month';  // Currently selected time period filter
    setSelectedQuickPeriod: (period: 'all' | 'today' | 'tomorrow' | 'week' | 'month') => void;  // Handler to change the selected period
    onViewFullDescription: (event: CalendarEvent) => void;  // Handler for viewing full event description
    onAddToCalendar: (event: CalendarEvent) => void;        // Handler for adding event to device calendar
    onViewDetailUrl: (event: CalendarEvent) => void;        // Handler for opening event detail URL
    onOpenMap: (location: string) => void;                  // Handler for opening map with location
}

export const ListView: React.FC<ListViewProps> = ({
    events,
    content,
    selectedQuickPeriod,
    setSelectedQuickPeriod,
    onViewFullDescription,
    onAddToCalendar,
    onViewDetailUrl,
    onOpenMap
}) => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);

    return (
        <View style={styles.listContainer}>
            {/* Quick Period Selector - Horizontal scrolling buttons to filter by time period */}
            <View style={styles.quickPeriodContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.quickPeriodSelector}
                >
                    {/* Quick Period Options - All, Today, Tomorrow, Next 7 Days, Next 30 Days */}
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
            </View>

            {/* Events List - Renders EventCard components or "No events" message */}
            {events.length > 0 ? (
                events.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        content={content || {}}
                        onViewFullDescription={onViewFullDescription}
                        onAddToCalendar={onAddToCalendar}
                        onViewDetailUrl={onViewDetailUrl}
                        onOpenMap={onOpenMap}
                    />
                ))
            ) : (
                // No Events Message - Displayed when no events match the current filters
                <View style={styles.noEventsContainer}>
                    <Text style={styles.noEventsText}>
                        {content?.ui.noEventsText || 'No events found'}
                    </Text>
                </View>
            )}
        </View>
    );
};