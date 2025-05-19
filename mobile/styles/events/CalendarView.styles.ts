import { StyleSheet } from 'react-native';
import { createThemedStyles } from '../Theme';

/**
 * Styles specific to the CalendarView component
 * This file contains styles for the calendar view that shows events in a monthly calendar format
 */
export const createCalendarViewStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Main container for the calendar WebView
        calendarContainer: {
            backgroundColor: colors.card, // Background color for the calendar container
            borderRadius: 20, // Rounded corners for the container
            overflow: 'hidden', // Ensures content doesn't spill outside borders
            height: 400, // Fixed height for the calendar
            marginBottom: 20, // Space below the calendar
            ...baseTheme.shadowMedium, // Applies shadow effect from theme
            borderWidth: 1, // Border thickness
            borderColor: colors.border, // Border color
        },
        // Style for the WebView itself
        calendar: {
            flex: 1, // Takes up available space in the container
        },
    });
};