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
    return StyleSheet.create({
        ...commonStyles,
        ...eventCardStyles,
        ...calendarViewStyles,
        ...listViewStyles,
        ...filterComponentsStyles,
        ...eventDetailsModalStyles
    });
};