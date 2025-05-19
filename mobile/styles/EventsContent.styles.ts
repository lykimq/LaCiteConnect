import { StyleSheet } from 'react-native';
import { createEventCommonStyles } from './EventsCommon.styles';
import { createEventCardStyles } from './EventCard.styles';
import { createCalendarViewStyles } from './CalendarView.styles';
import { createListViewStyles } from './ListView.styles';
import { createFilterComponentsStyles } from './FilterComponents.styles';
import { createEventDetailsModalStyles } from './EventDetailsModal.styles';

/**
 * Creates themed styles for the EventsContent component
 * This file re-exports styles from individual component style files
 * for better code organization and maintainability
 *
 * This is the main style aggregator for all event-related components:
 * - Common event styles (shared across all event components)
 * - Event cards (displayed in lists and grids)
 * - Calendar view (monthly calendar display of events)
 * - List view (vertical scrolling list of events)
 * - Filter components (category filters, date filters, etc.)
 * - Event details modal (expanded view when tapping on an event)
 */
export const createEventsStyles = (colors: any) => {
    // Import all the component-specific styles
    const commonStyles = createEventCommonStyles(colors);
    const eventCardStyles = createEventCardStyles(colors);
    const calendarViewStyles = createCalendarViewStyles(colors);
    const listViewStyles = createListViewStyles(colors);
    const filterComponentsStyles = createFilterComponentsStyles(colors);
    const eventDetailsModalStyles = createEventDetailsModalStyles(colors);

    // Merge all styles into a single StyleSheet
    // This allows components to access any style they need through a single styles object,
    // making it easier to maintain consistent styling across the events section
    return StyleSheet.create({
        ...commonStyles,
        ...eventCardStyles,
        ...calendarViewStyles,
        ...listViewStyles,
        ...filterComponentsStyles,
        ...eventDetailsModalStyles
    });
};