import { StyleSheet } from 'react-native';
import { theme, createThemedStyles } from './Theme';

/**
 * Creates themed styles for the GetConnectedContent component
 */
export const createGetConnectedStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Reuse the base layout and common elements
        container: baseTheme.container,
        scrollView: baseTheme.scrollView,
        scrollViewContent: {
            ...baseTheme.scrollViewContent,
        },

        // Hero section with custom height
        heroSection: {
            ...baseTheme.heroSection,
            height: 220, // Increased height for this specific component
            borderBottomLeftRadius: 35,
            borderBottomRightRadius: 35,
            padding: 24,
        },
        heroContent: baseTheme.heroContent,
        heroTitle: {
            ...baseTheme.textHeroTitle,
            fontSize: 36,
            marginBottom: 12,
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        heroSubtitle: {
            ...baseTheme.textHeroSubtitle,
            opacity: 0.95,
            lineHeight: 24,
            textShadowColor: 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
        },

        // Quick actions with custom placement
        quickActionsContainer: {
            ...baseTheme.quickActionsContainer,
            marginTop: -40, // Increased negative margin
        },
        quickActionsRow: baseTheme.quickActionsRow,
        quickActionButton: {
            ...baseTheme.quickActionButton,
        },
        quickActionIconContainer: {
            marginBottom: 8,
        },
        quickActionText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
            textAlign: 'center',
        },

        // Sections
        sectionsContainer: {
            paddingHorizontal: 20,
        },
        sectionCard: {
            ...baseTheme.card,
            borderRadius: 20,
            marginBottom: 16,
            ...baseTheme.shadowMedium,
        },
        sectionHeader: {
            ...baseTheme.cardHeader,
        },
        sectionIconContainer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        sectionTitle: baseTheme.textSubheading,
        sectionContent: baseTheme.cardContent,
        sectionText: {
            ...baseTheme.textParagraph,
        },

        // Contact grid
        contactGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -8,
            marginBottom: 16,
        },
        contactButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 12,
            marginHorizontal: 8,
            marginBottom: 12,
            flex: 1,
            minWidth: '45%',
            borderWidth: 1,
            borderColor: colors.border,
        },
        contactIconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.primary + '15',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
        },
        contactText: {
            fontSize: 14,
            color: colors.text,
            flex: 1,
        },

        // Button styling
        sectionButton: {
            ...baseTheme.buttonPrimary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            ...baseTheme.shadowMedium,
        },
        dualButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 12,
            marginTop: 8,
        },
        dualButton: {
            flex: 1,
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 12,
            ...baseTheme.shadowMedium,
        },
        sectionButtonIcon: {
            marginRight: 8,
        },
        sectionButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },

        // Loading and error states
        loadingContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        errorText: {
            fontSize: 16,
            color: '#FF3B30',
            marginBottom: 20,
            textAlign: 'center',
            paddingHorizontal: 24,
        },
    });
};