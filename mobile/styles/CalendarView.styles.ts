import { StyleSheet } from 'react-native';
import { createThemedStyles } from './Theme';

/**
 * Styles specific to the CalendarView component
 */
export const createCalendarViewStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Calendar
        calendarContainer: {
            backgroundColor: colors.card,
            borderRadius: 20,
            overflow: 'hidden',
            height: 400,
            marginBottom: 20,
            ...baseTheme.shadowMedium,
            borderWidth: 1,
            borderColor: colors.border,
        },
        calendar: {
            flex: 1,
        },
    });
};