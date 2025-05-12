import { StyleSheet } from 'react-native';

// Common colors for the app
export const appColors = {
    primary: '#FF9843',
    secondary: '#4CAF50',
    text: {
        primary: '#333',
        secondary: '#666',
        light: '#999'
    },
    background: {
        primary: '#FFFFFF',
        secondary: '#F8F9FA',
        accent: '#FFE4C4'
    },
    border: '#E0E0E0',
};

// Common component styling
export const commonComponentStyles = {
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: appColors.text.primary,
        textAlign: 'center',
    },
    subtitleText: {
        fontSize: 18,
        color: appColors.text.secondary,
        textAlign: 'center',
    },
    buttonPrimary: {
        backgroundColor: appColors.primary,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
};

// Navigation styles
export const navigationStyles = StyleSheet.create({
    tabBar: {
        backgroundColor: appColors.background.primary,
        borderTopWidth: 1,
        borderTopColor: appColors.border,
        paddingBottom: 5,
        paddingTop: 5,
    },
    header: {
        backgroundColor: appColors.background.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        height: 90, // Increased height to accommodate status bar
        justifyContent: 'flex-end', // Push content to bottom
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 20, // Smaller font for the header
        fontWeight: 'bold',
        color: appColors.text.primary,
        textAlign: 'center',
    },
});

// Tab bar colors
export const tabBarColors = {
    active: appColors.primary,
    inactive: '#7F8C8D',
} as const;