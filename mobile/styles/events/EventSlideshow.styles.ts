/**
 * EventSlideshow Styles
 * Defines the styling for the EventSlideshow component, including layout, dimensions,
 * and visual appearance of the slideshow container, slides, images, and pagination indicators.
 *
 * The styles are designed to be responsive and maintain consistent spacing across different
 * screen sizes while providing a smooth user experience for image viewing.
 */

import { StyleSheet, Dimensions } from 'react-native';
import { CustomThemeColors } from '../../contexts/ThemeContext';

// Get screen width for responsive layout calculations
// Used to ensure slides take up the full width of the device screen
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Creates the styles for the EventSlideshow component
 * @param {CustomThemeColors} themeColors - Theme colors from the app's theme context
 * @returns {StyleSheet} StyleSheet object containing all component styles
 */
export const createEventSlideshowStyles = (themeColors: CustomThemeColors) => StyleSheet.create({
    /**
     * Main container styles for the entire slideshow
     * - Fixed height ensures consistent vertical space
     * - Vertical margin provides spacing from surrounding content
     */
    container: {
        height: 200, // Fixed height for consistent slideshow size
        marginVertical: 16, // Spacing above and below the slideshow
    },

    slideshowContainer: {
        flex: 1,
        position: 'relative',
    },

    /**
     * Individual slide container styles
     * - Full screen width ensures proper slide sizing
     * - Centered content alignment for optimal image display
     * - Fixed height matches container for consistency
     */
    slide: {
        width: SCREEN_WIDTH, // Full screen width for each slide
        height: '100%', // Matches container height
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
    },

    /**
     * Image styling within each slide
     * - Full width and height within slide container
     * - 'contain' resizeMode ensures image fits while maintaining aspect ratio
     * - Padding provides spacing around the image
     * - Transparent background allows for theme compatibility
     */
    image: {
        flex: 1, // Use flex to fill available space while respecting aspect ratio
        width: '90%', // Slightly less than full width to prevent edge touching
        height: '90%', // Slightly less than full height to prevent edge touching
        resizeMode: 'contain', // Maintain aspect ratio while fitting in container
        padding: 10, // Space around the image
        backgroundColor: 'transparent', // Allow background to show through
    },

    /**
     * Pagination dots container styles
     * - Absolute positioning at bottom of slideshow
     * - Row layout for horizontal dot arrangement
     * - Centered alignment for consistent spacing
     * - Full width to ensure dots span the entire slideshow
     */
    paginationContainer: {
        flexDirection: 'row', // Arrange dots horizontally
        position: 'absolute', // Position over the slideshow
        bottom: 16, // Distance from bottom of slideshow
        left: 0,
        right: 0,
        justifyContent: 'center', // Center dots horizontally
        alignItems: 'center', // Center dots vertically
        zIndex: 1,
    },

    /**
     * Individual pagination dot styles
     * - Fixed height for consistent dot size
     * - Rounded corners for circular appearance
     * - Horizontal margin for spacing between dots
     * - Width is animated in the component for active state
     */
    paginationDot: {
        width: 8, // Width of the dot
        height: 8, // Height of the dot
        borderRadius: 4, // Half of height for circular shape
        marginHorizontal: 4, // Space between dots
        backgroundColor: '#FFFFFF', // Color of the dot (white)
    },
});