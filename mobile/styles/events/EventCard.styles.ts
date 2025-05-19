import { StyleSheet } from 'react-native';
import { createThemedStyles } from '../Theme';
import { MixedStyleDeclaration } from 'react-native-render-html';

/**
 * Styles specific to the EventCard component
 * This file contains all styles related to the event card UI element displayed in the events list
 */
export const createEventCardStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Main event card container
        eventCard: {
            backgroundColor: colors.card, // Background color of the card
            borderRadius: 15, // Rounded corners for the card
            marginBottom: 16, // Space between cards when stacked
            overflow: 'hidden', // Ensures content doesn't spill outside borders
            ...baseTheme.shadowMedium, // Applies shadow effect from theme
            borderWidth: 1, // Card border thickness
            borderColor: colors.border, // Card border color
            padding: 16, // Internal spacing within the card
        },
        // Container for the main content of the event card
        eventContent: {
            flex: 1, // Takes up available space
            position: 'relative', // For absolute positioning of child elements
            minHeight: 100, // Ensures minimum height for the card
        },
        // Container for the date icon/calendar in top right
        dateIconContainer: {
            position: 'absolute', // Positioned independently of normal flow
            top: 0, // Aligned to top
            right: 0, // Aligned to right
            backgroundColor: colors.primary + '15', // Semi-transparent primary color (15% opacity)
            borderRadius: 10, // Rounded corners
            padding: 8, // Internal spacing
            alignItems: 'center', // Centers content horizontally
            minWidth: 50, // Ensures minimum width
            zIndex: 1, // Places above other elements
        },
        // Style for the day number in the date icon
        dayNumber: {
            fontSize: 22, // Large text size
            fontWeight: 'bold', // Bold text
            color: colors.primary, // Uses primary theme color
        },
        // Style for the month name in the date icon
        monthName: {
            fontSize: 12, // Small text size
            color: colors.primary, // Uses primary theme color
            textTransform: 'uppercase', // Converts text to uppercase
        },
        // Style for the event title
        eventTitle: {
            fontSize: 18, // Large text size for title
            fontWeight: 'bold', // Bold text
            color: colors.text, // Uses theme text color
            marginRight: 60, // Makes space for date icon on right
            marginBottom: 10, // Spacing below title
        },
        // Style for the event header section
        eventHeader: {
            marginBottom: 8, // Spacing below header
        },
        // Container for location information
        eventLocation: {
            flexDirection: 'row', // Arranges children horizontally
            alignItems: 'flex-start', // Aligns items to the top
            marginBottom: 10, // Spacing below location
            paddingRight: 60, // Makes space for date icon
        },
        // Style for the location text
        locationText: {
            fontSize: 14, // Medium text size
            color: colors.text, // Uses theme text color
            marginLeft: 6, // Spacing to the left (after icon)
            opacity: 0.8, // Slightly transparent
            flex: 1, // Takes up available space
            flexWrap: 'wrap', // Allows text to wrap
        },
        // Container for event details
        detailsContainer: {
            marginTop: 6, // Spacing above details
        },
        // Style for each row of details
        detailRow: {
            flexDirection: 'row', // Arranges children horizontally
            alignItems: 'center', // Centers items vertically
            marginBottom: 8, // Spacing below each row
        },
        // Style for icons in detail rows
        detailIcon: {
            marginRight: 8, // Spacing to the right
            width: 16, // Fixed width
            justifyContent: 'center', // Centers content vertically
            alignItems: 'center', // Centers content horizontally
        },
        // Style for text in detail rows
        detailText: {
            fontSize: 14, // Medium text size
            color: colors.text, // Uses theme text color
            opacity: 0.8, // Slightly transparent
        },
        // Style for event description text
        eventDescription: {
            fontSize: 14, // Medium text size
            color: colors.text, // Uses theme text color
            opacity: 0.9, // Less transparent for better readability
            marginTop: 8, // Spacing above description
            marginBottom: 8, // Spacing below description
            paddingRight: 60, // Makes space for date icon
            minHeight: 40, // Minimum height to ensure consistent card sizing
            overflow: 'hidden', // Ensures text doesn't overflow
        },
        // Container for the footer of the event card
        eventFooter: {
            flexDirection: 'row', // Arranges children horizontally
            marginTop: 12, // Spacing above footer
            justifyContent: 'space-between', // Distributes space between items
            alignItems: 'center', // Centers items vertically
        },
        // Style for the "Read More" button
        readMoreButton: {
            flexDirection: 'row', // Arranges children horizontally
            alignItems: 'center', // Centers items vertically
        },
        // Style for the "Read More" text
        readMoreText: {
            fontSize: 14, // Medium text size
            color: colors.primary, // Uses primary theme color
            marginRight: 4, // Spacing to the right
        },
        // Container for action buttons
        eventActions: {
            flexDirection: 'row', // Arranges children horizontally
            marginTop: 8, // Spacing above actions
        },
        // Style for action buttons
        actionButton: {
            width: 40, // Fixed width
            height: 40, // Fixed height
            borderRadius: 20, // Fully rounded (circle)
            backgroundColor: colors.background, // Uses theme background color
            justifyContent: 'center', // Centers content vertically
            alignItems: 'center', // Centers content horizontally
            marginRight: 10, // Spacing to the right
            borderWidth: 1, // Button border thickness
            borderColor: colors.border, // Button border color
        },
        // Style for secondary action buttons
        secondaryActionButton: {
            backgroundColor: colors.primary + '15', // Semi-transparent primary color
            borderColor: colors.primary + '30', // Semi-transparent primary color for border
        },
    });
};

/**
 * Creates themed styles for HTML tags used in RenderHtml component
 * These styles control how HTML content is displayed in the event cards
 *
 * @param colors - The theme colors object
 * @returns Record of HTML tag styles
 */
export const createEventCardHtmlStyles = (colors: any): Record<string, MixedStyleDeclaration> => {
    return {
        // Base body text styling
        body: {
            color: colors.text, // Uses theme text color
            fontSize: 14, // Medium text size for readability
            lineHeight: 20, // Comfortable line spacing
            fontFamily: 'System', // System font for consistent display
            fontWeight: '400' // Regular weight for normal text
        },

        // Bold text styling
        b: {
            fontWeight: '700', // Bold weight for emphasis
            color: colors.text // Uses theme text color
        },

        // Strong text (alternative to bold)
        strong: {
            fontWeight: '700', // Bold weight for emphasis
            color: colors.text // Uses theme text color
        },

        // Italic text styling
        i: {
            fontStyle: 'italic', // Italic for emphasis or titles
            color: colors.text // Uses theme text color
        },

        // Emphasis text (alternative to italic)
        em: {
            fontStyle: 'italic', // Italic for emphasis
            color: colors.text // Uses theme text color
        },

        // Paragraph styling
        p: {
            marginVertical: 0, // No vertical margin to save space in preview
            color: colors.text // Uses theme text color
        },

        // Heading level 1
        h1: {
            fontSize: 18, // Slightly larger than body text
            fontWeight: '700', // Bold for headings
            marginVertical: 4, // Minimal spacing to save space
            color: colors.text // Uses theme text color
        },

        // Heading level 2
        h2: {
            fontSize: 16, // Medium size for subheadings
            fontWeight: '700', // Bold for headings
            marginVertical: 3, // Minimal spacing to save space
            color: colors.text // Uses theme text color
        },

        // Heading level 3
        h3: {
            fontSize: 15, // Slightly larger than body text
            fontWeight: '700', // Bold for headings
            marginVertical: 2, // Minimal spacing to save space
            color: colors.text // Uses theme text color
        },

        // Link styling
        a: {
            color: colors.primary, // Uses primary theme color for links
            textDecorationLine: 'underline' // Underline to indicate a link
        },

        // Unordered list container
        ul: {
            marginLeft: 10, // Indentation for list
            color: colors.text // Uses theme text color
        },

        // List item styling
        li: {
            marginBottom: 4, // Minimal spacing between items
            color: colors.text // Uses theme text color
        }
    };
};