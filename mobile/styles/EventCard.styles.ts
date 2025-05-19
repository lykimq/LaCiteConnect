import { StyleSheet } from 'react-native';
import { createThemedStyles } from './Theme';

/**
 * Styles specific to the EventCard component
 */
export const createEventCardStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Event cards
        eventCard: {
            backgroundColor: colors.card,
            borderRadius: 15,
            marginBottom: 16,
            overflow: 'hidden',
            ...baseTheme.shadowMedium,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
        },
        eventContent: {
            flex: 1,
            position: 'relative',
            minHeight: 100,
        },
        dateIconContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: colors.primary + '15',
            borderRadius: 10,
            padding: 8,
            alignItems: 'center',
            minWidth: 50,
            zIndex: 1,
        },
        dayNumber: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.primary,
        },
        monthName: {
            fontSize: 12,
            color: colors.primary,
            textTransform: 'uppercase',
        },
        eventTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginRight: 60,
            marginBottom: 10,
        },
        eventHeader: {
            marginBottom: 8,
        },
        eventLocation: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 10,
            paddingRight: 60,
        },
        locationText: {
            fontSize: 14,
            color: colors.text,
            marginLeft: 6,
            opacity: 0.8,
            flex: 1,
            flexWrap: 'wrap',
        },
        detailsContainer: {
            marginTop: 6,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        detailIcon: {
            marginRight: 8,
            width: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        detailText: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.8,
        },
        eventDescription: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.7,
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 8,
        },
        eventFooter: {
            flexDirection: 'row',
            marginTop: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        readMoreButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        readMoreText: {
            fontSize: 14,
            color: colors.primary,
            marginRight: 4,
        },
        eventActions: {
            flexDirection: 'row',
            marginTop: 8,
        },
        actionButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
            borderWidth: 1,
            borderColor: colors.border,
        },
        secondaryActionButton: {
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary + '30',
        },
    });
};