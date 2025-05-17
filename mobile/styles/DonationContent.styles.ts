import { StyleSheet } from 'react-native';
import { theme, createThemedStyles, layoutStyles } from './Theme';

/**
 * Creates themed styles for the DonationContent component
 */
export const createDonationStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
        // Reuse the base layout and common elements
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollView: {
            flex: 1,
        },
        heroSection: baseTheme.heroSection,
        heroContent: baseTheme.heroContent,
        heroTitle: baseTheme.textHeroTitle,
        heroSubtitle: baseTheme.textHeroSubtitle,

        // Card elements
        cardContainer: {
            ...baseTheme.card,
            marginHorizontal: 20,
            marginBottom: 25,
        },
        cardHeader: baseTheme.cardHeader,
        cardHeaderIcon: {
            marginRight: 12,
        },
        sectionTitle: baseTheme.textSubheading,
        paragraph: {
            ...baseTheme.textParagraph,
            padding: 16,
        },

        // Bank details
        bankDetailsContainer: {
            marginTop: 16,
            backgroundColor: colors.card,
            padding: 18,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            ...baseTheme.shadowSmall,
            marginHorizontal: 16,
            marginBottom: 16,
        },
        bankDetailRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingHorizontal: 4,
        },
        bankDetailLabel: {
            fontSize: 14,
            color: colors.text,
            fontWeight: '500',
            opacity: 0.8,
            flex: 1,
            marginRight: 10,
        },
        bankDetailValueContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        bankDetailValue: {
            fontSize: 14,
            color: colors.primary,
            fontWeight: '600',
            marginRight: 8,
            textAlign: 'right',
        },

        // Donation button
        donateNowContainer: {
            paddingHorizontal: 16,
            paddingVertical: 24,
            marginTop: 8,
            marginBottom: 16,
        },
        donateNowButton: {
            backgroundColor: colors.primary,
            paddingVertical: 18,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            ...baseTheme.shadowLarge,
        },
        donateNowButtonText: {
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
        },

        // Quick actions
        quickActionsContainer: baseTheme.quickActionsContainer,
        quickActionsRow: baseTheme.quickActionsRow,
        quickActionButton: baseTheme.quickActionButton,
        quickActionIcon: {
            marginBottom: 8,
        },
        quickActionText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.text,
            textAlign: 'center',
        },

        // Floating action button
        fab: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: colors.primary,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            ...baseTheme.shadowLarge,
        },
    });
};