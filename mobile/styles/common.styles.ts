import { appColors } from './colors';

// Common component styling for reuse across the app
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