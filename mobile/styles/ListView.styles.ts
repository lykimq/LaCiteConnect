import { StyleSheet } from 'react-native';
import { createThemedStyles } from './Theme';

/**
 * Styles specific to the ListView component
 */
export const createListViewStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        listContainer: {
            flex: 1,
            backgroundColor: colors.background,
        },

        // Quick period selector
        quickPeriodContainer: {
            marginBottom: 16,
            backgroundColor: colors.card,
            borderRadius: 15,
            padding: 12,
            ...baseTheme.shadowMedium,
        },
        quickPeriodSelector: {
            flexDirection: 'row',
            paddingVertical: 5,
            flexWrap: 'wrap',
        },
        quickPeriodButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
        },
        activeQuickPeriodButton: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        quickPeriodText: {
            fontSize: 14,
            color: colors.text,
        },
        activeQuickPeriodText: {
            color: '#FFFFFF',
            fontWeight: '500',
        },

        // No events container
        noEventsContainer: {
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
        },
        noEventsText: {
            fontSize: 16,
            color: colors.text,
            opacity: 0.7,
            textAlign: 'center',
        },
    });
};