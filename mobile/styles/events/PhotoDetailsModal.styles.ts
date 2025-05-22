import { StyleSheet, Platform, Dimensions } from 'react-native';
import { createThemedStyles } from '../Theme';

// Get device screen dimensions for responsive styling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * PhotoDetailsModal Styles
 * Creates a themed stylesheet for the photo details modal component.
 * Handles styling for:
 * - Modal overlay and background
 * - Image display and controls
 * - Navigation buttons
 * - Sharing buttons
 * - Platform-specific adjustments
 */
export const createPhotoDetailsModalStyles = (colors: any) => {
    // Get base themed styles for consistent theming across the app
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        /**
         * Modal overlay covers the entire screen with a semi-transparent background
         * This creates a dimming effect that helps the photo stand out
         * flex: 1 ensures it takes up all available space
         */
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark overlay (90% opacity) for better photo viewing
            justifyContent: 'center', // Center content vertically
            alignItems: 'center', // Center content horizontally
        },

        /**
         * Close Button Container
         * Positions the close button in the top-right corner
         * Includes platform-specific positioning for iOS and Android
         */
        closeButtonContainer: {
            position: 'absolute', // Position over other content
            top: Platform.OS === 'ios' ? 50 : 30, // Account for status bar height differences
            right: 20, // Distance from right edge
            zIndex: 2, // Ensure it stays above other elements
            padding: 8, // Increase tap target size
            borderRadius: 20, // Circular background
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        },

        /**
         * Photo container is the main wrapper for the photo
         * It handles the layout and dimensions of the photo display area
         * Takes up the full screen width and height for maximum photo size
         */
        photoContainer: {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            justifyContent: 'center', // Center photo vertically
            alignItems: 'center', // Center photo horizontally
        },

        /**
         * Photo style controls how the image itself is displayed
         * Uses 'contain' resize mode to show the entire photo while maintaining aspect ratio
         * Takes up all available space in the container
         */
        photo: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain', // Maintain aspect ratio and show full image
        },

        /**
         * Navigation buttons (prev/next) styling
         * Semi-transparent circular buttons positioned on the left and right sides
         * Vertically centered with proper spacing and touch targets
         */
        navigationButton: {
            position: 'absolute', // Position over the photo
            top: '50%', // Center vertically
            transform: [{ translateY: -25 }], // Offset by half height for true center
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            borderRadius: 25, // Circular shape
            padding: 12, // Comfortable tap target
            zIndex: 2, // Stay above the photo
        },

        /**
         * Left navigation button specific positioning
         * Places the button on the left side with proper spacing
         */
        leftButton: {
            left: 20, // Distance from left edge
        },

        /**
         * Right navigation button specific positioning
         * Places the button on the right side with proper spacing
         */
        rightButton: {
            right: 20, // Distance from right edge
        },

        /**
         * Pagination container holds the dots indicating current photo position
         * Positioned at the bottom of the screen with proper spacing
         * Uses row layout to display dots horizontally
         */
        paginationContainer: {
            position: 'absolute',
            bottom: 40, // Distance from bottom
            flexDirection: 'row', // Horizontal layout
            justifyContent: 'center', // Center dots horizontally
            width: '100%', // Take full width for proper centering
        },

        /**
         * Individual pagination dot styling
         * Small circular indicators with proper spacing
         * Uses theme colors for consistency
         */
        paginationDot: {
            width: 8, // Dot size
            height: 8,
            borderRadius: 4, // Make perfectly circular
            marginHorizontal: 4, // Space between dots
            backgroundColor: colors.primary, // Use theme primary color
        },

        /**
         * Active pagination dot styling
         * Highlights the current photo's dot
         * Slightly larger and brighter than inactive dots
         */
        activePaginationDot: {
            backgroundColor: '#FFFFFF', // White for better visibility
            transform: [{ scale: 1.2 }], // Slightly larger than inactive dots
        },

        /**
         * Action Buttons Container
         * Wrapper for the sharing buttons at the bottom
         * Semi-transparent background with platform-specific positioning
         */
        actionButtonsContainer: {
            position: 'absolute', // Position over other content
            bottom: Platform.OS === 'ios' ? 100 : 80, // Platform-specific positioning
            left: 0, // Start from left edge
            right: 0, // End at right edge
            paddingVertical: 15, // Vertical padding
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            alignItems: 'center', // Center the ScrollView horizontally
        },

        /**
         * Action Buttons ScrollView Content
         * Horizontal layout for sharing buttons
         * Centered content with proper spacing
         */
        actionButtonsScroll: {
            paddingHorizontal: 20, // Horizontal padding
            flexDirection: 'row', // Horizontal layout
            alignItems: 'center', // Center content
        },

        /**
         * Individual Action Button
         * Circular buttons for sharing options
         * Consistent size and spacing
         */
        actionButton: {
            width: 44, // Consistent size
            height: 44, // Consistent size
            borderRadius: 22, // Circular shape
            justifyContent: 'center', // Center content
            alignItems: 'center', // Center content
            marginHorizontal: 6, // Reduced margin for tighter grouping
        },
    });
};