import { StyleSheet } from 'react-native';
import { appColors } from './colors';

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