import { StyleSheet } from 'react-native';
import { createThemedStyles } from '../Theme';

/**
 * Styles specific to the EventDetailsModal component
 * This file contains styles for the modal that displays detailed event information
 * when a user taps on an event card or requests to see more details
 */
export const createEventDetailsModalStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Main modal content container for description view
        descriptionModalContent: {
            backgroundColor: colors.card, // Background color of the modal
            borderRadius: 20, // Highly rounded corners
            padding: 20, // Internal spacing
            width: '90%', // Takes up 90% of the screen width
            maxHeight: '85%', // Maximum height to ensure it fits on screen
            ...baseTheme.shadowLarge, // Applies large shadow from theme
        },
        // Header section of the modal
        descriptionModalHeader: {
            flexDirection: 'row', // Arranges children horizontally
            justifyContent: 'space-between', // Distributes space between title and close button
            alignItems: 'flex-start', // Aligns items to the top
            marginBottom: 12, // Space below header
            paddingBottom: 12, // Extra padding at bottom
            borderBottomWidth: 1, // Bottom border thickness
            borderBottomColor: colors.border, // Bottom border color
        },
        // Title of the event in the modal
        descriptionModalTitle: {
            fontSize: 20, // Large text size
            fontWeight: 'bold', // Bold text
            color: colors.text, // Uses theme text color
            flex: 1, // Takes up available space
            marginRight: 16, // Space to the right
        },
        // Close button in the modal header
        modalCloseIconButton: {
            padding: 4, // Internal padding to increase tap target
        },
        // Event date display in the modal
        modalEventDate: {
            fontSize: 15, // Medium text size
            color: colors.text, // Uses theme text color
            opacity: 0.8, // Slightly transparent
            marginBottom: 16, // Space below date
        },
        // Scrollable area for description content
        descriptionModalScrollView: {
            flexGrow: 1, // Allows scroll view to grow
            maxHeight: '70%', // Maximum height constraint
            marginVertical: 16, // Vertical margin
        },
        // Style for the description text
        descriptionModalText: {
            fontSize: 16, // Medium-large text size
            color: colors.text, // Uses theme text color
            lineHeight: 24, // Space between lines
            marginBottom: 16, // Space below text
            paddingHorizontal: 4, // Small horizontal padding
            opacity: 0.9, // Slightly transparent
        },
        // Container for photo attachments in the modal
        modalPhotoAttachmentsContainer: {
            marginTop: 16, // Space above container
            marginBottom: 8, // Space below container
            backgroundColor: colors.background + '30', // Semi-transparent background color
            borderRadius: 12, // Rounded corners
            padding: 12, // Internal padding
        },
        // Title for attachments section
        modalAttachmentsTitle: {
            fontSize: 16, // Medium-large text size
            fontWeight: '600', // Semi-bold text
            marginBottom: 12, // Space below title
            color: colors.text, // Uses theme text color
        },
        // Individual photo item in the attachments list
        modalPhotoItem: {
            flexDirection: 'row', // Arranges children horizontally
            alignItems: 'center', // Centers items vertically
            padding: 12, // Internal padding
            backgroundColor: colors.card, // Uses theme card color
            borderRadius: 8, // Rounded corners
            marginBottom: 8, // Space below each item
            borderWidth: 1, // Border thickness
            borderColor: colors.border, // Border color
        },
        // Text for attachment items
        modalAttachmentText: {
            flex: 1, // Takes up available space
            marginLeft: 8, // Space to the left
            marginRight: 8, // Space to the right
            color: colors.text, // Uses theme text color
            fontSize: 14, // Medium text size
        },
        // Container for action buttons at the bottom of modal
        modalButtonsContainer: {
            marginTop: 16, // Space above container
            paddingTop: 16, // Extra padding at top
            borderTopWidth: 1, // Top border thickness
            borderTopColor: colors.border, // Top border color
        },
        // Row of buttons in the modal footer
        modalButtonsRow: {
            flexDirection: 'row', // Arranges children horizontally
            justifyContent: 'space-between', // Distributes space between buttons
            marginBottom: 8, // Space below row
        },
        // Style for action buttons in the modal
        modalActionButton: {
            flexDirection: 'row', // Arranges children horizontally
            alignItems: 'center', // Centers items vertically
            justifyContent: 'center', // Centers items horizontally
            paddingVertical: 12, // Vertical padding
            paddingHorizontal: 16, // Horizontal padding
            borderRadius: 10, // Rounded corners
        },
        // Text style for action buttons
        actionButtonText: {
            fontSize: 15, // Medium text size
            fontWeight: '600', // Semi-bold text
        },

        // Centered modal overlay styles
        centeredModalOverlay: {
            flex: 1, // Takes up the entire screen
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
            justifyContent: 'center', // Centers content vertically
            alignItems: 'center', // Centers content horizontally
        },
        // Centered modal content container
        centeredModalContent: {
            backgroundColor: colors.card, // Uses theme card color
            borderRadius: 20, // Highly rounded corners
            padding: 20, // Internal padding
            width: '90%', // Takes up 90% of the screen width
            maxHeight: '80%', // Maximum height to ensure it fits on screen
            shadowColor: "#000", // Shadow color
            shadowOffset: {
                width: 0, // No horizontal shadow offset
                height: 2, // Small vertical shadow offset
            },
            shadowOpacity: 0.25, // Shadow opacity
            shadowRadius: 3.84, // Shadow blur radius
            elevation: 5, // Android elevation (shadow)
        },
    });
};