import { StyleSheet, Platform, Dimensions } from 'react-native';
import { createThemedStyles } from '../Theme';

// Get device screen dimensions for responsive styling
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Creates themed styles for the PhotoDetailsModal component
 * These styles control the appearance of the modal that displays full-size photos
 * when a user taps on a photo in the slideshow
 *
 * @param colors - Theme colors object containing the app's color scheme
 * @returns StyleSheet object with all the styles for the PhotoDetailsModal
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
         * Close button container positions and styles the close button
         * It's positioned absolutely in the top-right corner with a semi-transparent background
         * The button has platform-specific positioning for iOS and Android
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
    });
};