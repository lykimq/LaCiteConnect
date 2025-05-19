import { StyleSheet } from 'react-native';
import { createThemedStyles } from './Theme';

/**
 * Common styles shared across event components
 */
export const createEventCommonStyles = (colors: any) => {
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

        // View content
        viewContent: {
            paddingHorizontal: 20,
        },

        // Month navigation
        monthNavigation: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
            backgroundColor: colors.card,
            borderRadius: 15,
            padding: 10,
            ...baseTheme.shadowMedium,
        },
        monthYearButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
        },
        monthYearText: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginRight: 8,
        },

        // View toggle
        viewToggle: {
            flexDirection: 'row',
            backgroundColor: colors.card,
            borderRadius: 10,
            padding: 4,
        },
        toggleButton: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 8,
        },
        activeToggleButton: {
            backgroundColor: colors.primary,
        },
        toggleButtonText: {
            fontSize: 14,
            color: colors.text,
        },
        activeToggleButtonText: {
            color: '#FFFFFF',
        },

        // Loading states
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        errorContainer: {
            padding: 20,
            alignItems: 'center',
        },
        errorText: {
            fontSize: 16,
            color: '#FF3B30',
            marginBottom: 16,
            textAlign: 'center',
        },
        retryButton: {
            ...baseTheme.buttonPrimary,
            paddingHorizontal: 20,
        },
        retryButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
        emptyContainer: {
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyText: {
            fontSize: 16,
            color: colors.text,
            opacity: 0.7,
            textAlign: 'center',
            marginBottom: 16,
        },
        emptyImage: {
            width: 120,
            height: 120,
            marginBottom: 16,
            opacity: 0.7,
        },

        // Buttons
        button: {
            backgroundColor: colors.primary,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 10,
        },
        buttonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
        },
    });
};