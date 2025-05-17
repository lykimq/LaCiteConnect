import { StyleSheet, Dimensions } from 'react-native';
import { theme, createThemedStyles, layoutStyles } from './Theme';

/**
 * Creates themed styles for the WhoWeAre component
 */
export const createWhoWeAreStyles = (colors: any) => {
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
        scrollViewContent: {
            paddingBottom: 30,
        },
        heroSection: baseTheme.heroSection,
        heroContent: baseTheme.heroContent,
        heroTitle: baseTheme.textHeroTitle,
        heroSubtitle: baseTheme.textHeroSubtitle,

        // Section containers
        sectionsContainer: {
            padding: 20,
        },
        sectionCard: baseTheme.card,
        sectionHeader: baseTheme.cardHeader,
        sectionContent: baseTheme.cardContent,

        // Custom section elements
        sectionIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        sectionTitle: baseTheme.textSubheading,
        paragraph: baseTheme.textParagraph,
        link: {
            color: colors.primary,
            textDecorationLine: 'underline',
        },

        // Value items
        valueItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        valueIcon: {
            marginRight: 12,
        },
        valueText: {
            fontSize: 16,
            color: colors.text,
            flex: 1,
        },

        // Team grid
        teamGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 16,
        },
        teamMemberCard: {
            width: (Dimensions.get('window').width - 80) / 2,
            backgroundColor: colors.background,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            alignItems: 'center',
            ...baseTheme.shadowSmall,
            borderColor: colors.border,
            borderWidth: 1,
        },
        teamMemberImage: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginBottom: 12,
            borderWidth: 3,
            borderColor: colors.primary,
        },
        teamMemberInfo: {
            alignItems: 'center',
        },
        teamMemberName: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            textAlign: 'center',
        },
        teamMemberLastName: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.7,
            textAlign: 'center',
        },

        // Action buttons
        downloadButton: {
            ...baseTheme.buttonPill,
            alignSelf: 'center',
        },
        downloadButtonText: {
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: '600',
        },
        retryButton: {
            marginTop: 20,
            padding: 12,
            backgroundColor: colors.primary,
            borderRadius: 8,
            minWidth: 100,
            alignItems: 'center',
        },
        retryButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
    });
};