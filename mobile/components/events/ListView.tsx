import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventsStyles } from '../../styles/EventsContent.styles';
import { CalendarEvent, EventsContent } from './types';
import { EventCard } from './EventCard';

interface ListViewProps {
    events: CalendarEvent[];
    content: EventsContent | null;
    selectedQuickPeriod: 'all' | 'today' | 'tomorrow' | 'week' | 'month';
    setSelectedQuickPeriod: (period: 'all' | 'today' | 'tomorrow' | 'week' | 'month') => void;
    onViewFullDescription: (event: CalendarEvent) => void;
    onAddToCalendar: (event: CalendarEvent) => void;
    onViewDetailUrl: (event: CalendarEvent) => void;
    onOpenMap: (location: string) => void;
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
            {/* Quick Period Selector - Only show quick view options */}
            <View style={styles.quickPeriodContainer}>
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
            </View>

            {/* Events List */}
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
                <View style={styles.noEventsContainer}>
                    <Text style={styles.noEventsText}>
                        {content?.ui.noEventsText || 'No events found'}
                    </Text>
                </View>
            )}
        </View>
    );
};