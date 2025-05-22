import { StyleSheet, Platform, Dimensions } from 'react-native';
import { createThemedStyles } from '../Theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Creates themed styles for the PhotoDetailsModal component
 * These styles control the appearance of the modal that displays full-size photos
 * when a user taps on a photo in the slideshow
 */
export const createPhotoDetailsModalStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Modal overlay that covers the entire screen
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker overlay for better photo viewing
            justifyContent: 'center',
            alignItems: 'center',
        },

        // Close button container
        closeButtonContainer: {
            position: 'absolute',
            top: Platform.OS === 'ios' ? 50 : 30,
            right: 20,
            zIndex: 2,
            padding: 8,
            borderRadius: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },

        // Photo container that allows for zooming and panning
        photoContainer: {
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            justifyContent: 'center',
            alignItems: 'center',
        },

        // Full-size photo style
        photo: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
        },

        // Navigation buttons for previous/next photos
        navigationButton: {
            position: 'absolute',
            top: '50%',
            transform: [{ translateY: -25 }],
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: 25,
            padding: 12,
            zIndex: 2,
        },

        // Left navigation button specific positioning
        leftButton: {
            left: 20,
        },

        // Right navigation button specific positioning
        rightButton: {
            right: 20,
        },

        // Pagination indicator container
        paginationContainer: {
            position: 'absolute',
            bottom: 40,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
        },

        // Individual pagination dot
        paginationDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginHorizontal: 4,
            backgroundColor: colors.primary,
        },

        // Active pagination dot
        activePaginationDot: {
            backgroundColor: '#FFFFFF',
            transform: [{ scale: 1.2 }],
        },
    });
};