import { StyleSheet } from 'react-native';
import { createThemedStyles } from '../Theme';

/**
 * Common styles shared across event components
 * These styles provide a consistent look and feel for all event-related screens and components
 */
export const createEventCommonStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Basic layout containers
        container: {
            flex: 1, // Takes up the entire screen
            backgroundColor: colors.background, // Uses theme background color
        },
        scrollView: {
            flex: 1, // Takes up available space
        },
        scrollViewContent: {
            paddingBottom: 30, // Adds padding at the bottom for better scrolling experience
        },

        // Hero section at the top of event screens
        heroSection: baseTheme.heroSection, // Uses themed hero section style
        heroContent: baseTheme.heroContent, // Uses themed hero content style
        heroTitle: baseTheme.textHeroTitle, // Uses themed hero title text style
        heroSubtitle: baseTheme.textHeroSubtitle, // Uses themed hero subtitle text style

        // Quick actions section (buttons for common tasks)
        quickActionsContainer: baseTheme.quickActionsContainer, // Container for quick action buttons
        quickActionsRow: baseTheme.quickActionsRow, // Row layout for action buttons
        quickActionButton: baseTheme.quickActionButton, // Individual action button
        quickActionIcon: {
            marginBottom: 8, // Space between icon and text
        },
        quickActionText: {
            fontSize: 14, // Medium text size
            fontWeight: '600', // Semi-bold text
            color: colors.text, // Uses theme text color
            textAlign: 'center', // Centers text horizontally
        },

        // Main view content area
        viewContent: {
            paddingHorizontal: 20, // Horizontal padding on both sides
        },

        // Loading, error, and empty states
        loadingContainer: {
            flex: 1, // Takes up available space
            justifyContent: 'center', // Centers content vertically
            alignItems: 'center', // Centers content horizontally
            padding: 20, // Internal padding
        },
        errorContainer: {
            padding: 20, // Internal padding
            alignItems: 'center', // Centers content horizontally
        },
        errorText: {
            fontSize: 16, // Medium-large text size
            color: '#FF3B30', // Error red color
            marginBottom: 16, // Space below error text
            textAlign: 'center', // Centers text horizontally
        },
        retryButton: {
            ...baseTheme.buttonPrimary, // Uses themed primary button style
            paddingHorizontal: 20, // Horizontal padding
        },
        retryButtonText: {
            color: '#FFFFFF', // White text
            fontSize: 16, // Medium-large text size
            fontWeight: '600', // Semi-bold text
        },
        emptyContainer: {
            padding: 20, // Internal padding
            alignItems: 'center', // Centers content horizontally
            justifyContent: 'center', // Centers content vertically
        },
        emptyText: {
            fontSize: 16, // Medium-large text size
            color: colors.text, // Uses theme text color
            opacity: 0.7, // Slightly transparent
            textAlign: 'center', // Centers text horizontally
            marginBottom: 16, // Space below empty text
        },
        emptyImage: {
            width: 120, // Fixed width
            height: 120, // Fixed height
            marginBottom: 16, // Space below image
            opacity: 0.7, // Slightly transparent
        },

        // Common button styles
        button: {
            backgroundColor: colors.primary, // Uses primary theme color
            paddingVertical: 12, // Vertical padding
            paddingHorizontal: 20, // Horizontal padding
            borderRadius: 10, // Rounded corners
        },
        buttonText: {
            color: '#FFFFFF', // White text
            fontSize: 16, // Medium-large text size
            fontWeight: '600', // Semi-bold text
            textAlign: 'center', // Centers text horizontally
        },
    });
};