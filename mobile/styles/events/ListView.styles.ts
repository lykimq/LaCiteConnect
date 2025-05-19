import { StyleSheet } from 'react-native';
import { createThemedStyles } from '../Theme';

/**
 * Styles specific to the ListView component
 * This file contains styles for the list view that displays events in a vertical scrolling list
 * with filtering options for time periods
 */
export const createListViewStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Main container for the list view
        listContainer: {
            flex: 1, // Takes up available space
            backgroundColor: colors.background, // Uses theme background color
        },

        // Quick period selector section (Today, Tomorrow, Next 7 Days, etc.)
        quickPeriodContainer: {
            marginBottom: 16, // Space below the container
            backgroundColor: colors.card, // Background color for the container
            borderRadius: 15, // Rounded corners
            padding: 12, // Internal padding
            ...baseTheme.shadowMedium, // Applies shadow effect from theme
        },
        // Horizontal scroll view for period options
        quickPeriodSelector: {
            flexDirection: 'row', // Arranges items horizontally
            paddingVertical: 5, // Vertical padding
            flexWrap: 'wrap', // Allows items to wrap to next line if needed
        },
        // Individual period selection button
        quickPeriodButton: {
            paddingVertical: 8, // Vertical padding
            paddingHorizontal: 16, // Horizontal padding
            borderRadius: 20, // Fully rounded corners (pill shape)
            marginRight: 8, // Space to the right
            marginBottom: 8, // Space below
            backgroundColor: colors.background, // Uses theme background color
            borderWidth: 1, // Border thickness
            borderColor: colors.border, // Border color
        },
        // Style for the active/selected period button
        activeQuickPeriodButton: {
            backgroundColor: colors.primary, // Uses primary theme color
            borderColor: colors.primary, // Border matches background
        },
        // Text style for period buttons
        quickPeriodText: {
            fontSize: 14, // Medium text size
            color: colors.text, // Uses theme text color
        },
        // Text style for the active/selected period button
        activeQuickPeriodText: {
            color: '#FFFFFF', // White text
            fontWeight: '500', // Semi-bold text
        },

        // Container shown when no events are available
        noEventsContainer: {
            padding: 30, // Internal padding
            alignItems: 'center', // Centers content horizontally
            justifyContent: 'center', // Centers content vertically
        },
        // Text style for the "no events" message
        noEventsText: {
            fontSize: 16, // Medium-large text size
            color: colors.text, // Uses theme text color
            opacity: 0.7, // Slightly transparent
            textAlign: 'center', // Centers text horizontally
        },
    });
};