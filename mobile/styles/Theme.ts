import { StyleSheet, Dimensions } from 'react-native';

// ============================================================================
// COLOR DEFINITIONS
// These form the foundation of the app's color palette
// ============================================================================

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
    card: '#FFFFFF',
    error: '#FF3B30',
    success: '#28A745',
    warning: '#FFC107',
    info: '#17A2B8',
    overlay: 'rgba(0, 0, 0, 0.5)',
    shadow: {
        light: 'rgba(0, 0, 0, 0.1)',
        medium: 'rgba(0, 0, 0, 0.2)',
        dark: 'rgba(0, 0, 0, 0.3)'
    }
};

// Tab bar colors
export const tabBarColors = {
    active: appColors.primary,
    inactive: '#7F8C8D',
} as const;

// Function to create dynamic colors with opacity
export const withOpacity = (color: string, opacity: number): string => {
    // Convert opacity (0-1) to hex (00-FF)
    const hexOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');

    // If color is a 6-digit hex, add opacity
    if (color.startsWith('#') && color.length === 7) {
        return `${color}${hexOpacity}`;
    }

    // Return the original color if format is not supported
    return color;
};

// Common color combinations for specific UI elements
export const uiColors = {
    heroBackground: appColors.primary,
    cardBackground: appColors.card,
    buttonPrimary: appColors.primary,
    buttonSecondary: appColors.secondary,
    buttonText: '#FFFFFF',
    link: appColors.primary
};

// ============================================================================
// CORE STYLES
// These form the foundation of the app's visual language
// ============================================================================

// Shadow styles for different elevations
export const shadowStyles = StyleSheet.create({
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    }
});

// Text styles for typography
export const textStyles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: appColors.text.primary,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: appColors.text.secondary,
        textAlign: 'center',
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: appColors.text.primary,
        marginBottom: 8,
    },
    subheading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: appColors.text.primary,
        flex: 1,
    },
    paragraph: {
        fontSize: 16,
        color: appColors.text.primary,
        opacity: 0.8,
        lineHeight: 24,
        marginBottom: 15,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.9,
    },
});

// Button styles
export const buttonStyles = StyleSheet.create({
    primary: {
        backgroundColor: appColors.primary,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadowStyles.small,
    },
    secondary: {
        backgroundColor: appColors.secondary,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadowStyles.small,
    },
    outline: {
        backgroundColor: 'transparent',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: appColors.primary,
    },
    pill: {
        backgroundColor: appColors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...shadowStyles.medium,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: appColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

// Layout styles
export const layoutStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: appColors.background.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

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
        ...shadowStyles.small,
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

// ============================================================================
// COMPONENT STYLES
// These are common reusable components used throughout the app
// ============================================================================

// Base styles used across components
export const baseStyles = StyleSheet.create({
    // Shadows (for backward compatibility, prefer direct use of shadowStyles)
    shadowSmall: shadowStyles.small,
    shadowMedium: shadowStyles.medium,
    shadowLarge: shadowStyles.large,

    // Text (for backward compatibility, prefer direct use of textStyles)
    textTitle: textStyles.title,
    textSubtitle: textStyles.subtitle,
    textHeading: textStyles.heading,
    textSubheading: textStyles.subheading,
    textParagraph: textStyles.paragraph,
    textButtonPrimary: textStyles.buttonText,
    textHeroTitle: textStyles.heroTitle,
    textHeroSubtitle: textStyles.heroSubtitle,

    // Buttons (for backward compatibility, prefer direct use of buttonStyles)
    buttonPrimary: buttonStyles.primary,
    buttonSecondary: buttonStyles.secondary,
    buttonOutline: buttonStyles.outline,
    buttonPill: buttonStyles.pill,

    // Common UI elements
    heroSection: {
        height: 200,
        backgroundColor: appColors.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: 20,
        justifyContent: 'flex-end',
        ...shadowStyles.large,
    },
    heroContent: {
        marginBottom: 20,
    },
    card: {
        backgroundColor: appColors.card || appColors.background.primary,
        borderRadius: 20,
        marginBottom: 20,
        ...shadowStyles.medium,
        borderColor: appColors.border,
        borderWidth: 1,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: withOpacity(appColors.primary, 0.1),
        borderBottomWidth: 1,
        borderBottomColor: appColors.border,
    },
    cardContent: {
        padding: 16,
    },
    quickActionsContainer: {
        marginTop: -30,
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    quickActionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickActionButton: {
        backgroundColor: appColors.card || appColors.background.primary,
        borderRadius: 15,
        padding: 15,
        width: '48%',
        alignItems: 'center',
        ...shadowStyles.medium,
        borderWidth: 1,
        borderColor: appColors.border,
    },
});

// Legacy compatibility object - keep for backward compatibility
export const commonComponentStyles = {
    shadow: shadowStyles.medium,
    titleText: textStyles.title,
    subtitleText: textStyles.subtitle,
    buttonPrimary: buttonStyles.primary,
    buttonText: textStyles.buttonText,
};

// A function that creates themed styles with the given colors
export function createThemedStyles(colors: any = appColors) {
    return {
        ...baseStyles,
        colors: colors,
    };
}

// Default theme export for direct use
export const theme = createThemedStyles(appColors);