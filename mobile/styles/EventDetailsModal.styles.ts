import { StyleSheet } from 'react-native';
import { createThemedStyles } from './Theme';

/**
 * Styles specific to the EventDetailsModal component
 */
export const createEventDetailsModalStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Description modal
        descriptionModalContent: {
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: 20,
            width: '90%',
            maxHeight: '85%',
            ...baseTheme.shadowLarge,
        },
        descriptionModalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 12,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        descriptionModalTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
            flex: 1,
            marginRight: 16,
        },
        modalCloseIconButton: {
            padding: 4,
        },
        modalEventDate: {
            fontSize: 15,
            color: colors.text,
            opacity: 0.8,
            marginBottom: 16,
        },
        descriptionModalScrollView: {
            flexGrow: 1,
            maxHeight: '70%',
            marginVertical: 16,
        },
        descriptionModalText: {
            fontSize: 16,
            color: colors.text,
            lineHeight: 24,
            marginBottom: 16,
            paddingHorizontal: 4,
            opacity: 0.9,
        },
        modalPhotoAttachmentsContainer: {
            marginTop: 16,
            marginBottom: 8,
            backgroundColor: colors.background + '30',
            borderRadius: 12,
            padding: 12,
        },
        modalAttachmentsTitle: {
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 12,
            color: colors.text,
        },
        modalPhotoItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: colors.card,
            borderRadius: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        modalAttachmentText: {
            flex: 1,
            marginLeft: 8,
            marginRight: 8,
            color: colors.text,
            fontSize: 14,
        },
        modalButtonsContainer: {
            marginTop: 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        modalButtonsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        modalActionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 10,
        },
        actionButtonText: {
            fontSize: 15,
            fontWeight: '600',
        },

        // Updated modal styles for centered position
        centeredModalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        centeredModalContent: {
            backgroundColor: colors.card,
            borderRadius: 20,
            padding: 20,
            width: '90%',
            maxHeight: '80%',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
    });
};