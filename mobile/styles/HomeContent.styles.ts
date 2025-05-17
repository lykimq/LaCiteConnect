import { StyleSheet, Dimensions } from 'react-native';
import { theme, createThemedStyles, layoutStyles } from './Theme';

/**
 * Creates themed styles for the HomeContent component
 */
export const createHomeStyles = (colors: any) => {
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

        // Section containers
        sectionContainer: {
            paddingHorizontal: 20,
            marginBottom: 25,
        },
        sectionHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 15,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.text,
        },
        seeAllButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        seeAllText: {
            fontSize: 14,
            color: colors.primary,
            marginRight: 4,
        },

        // Live stream card
        liveStreamCard: {
            ...baseTheme.card,
        },
        liveStreamThumbnail: {
            width: '100%',
            height: 200,
            backgroundColor: '#000',
        },
        liveStreamInfo: {
            padding: 15,
        },
        liveStreamTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 8,
        },
        liveStreamMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
        },
        liveIndicator: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FF3B30',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            marginRight: 10,
        },
        liveText: {
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold',
            marginLeft: 4,
        },
        viewerCount: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        viewerText: {
            color: colors.text,
            opacity: 0.7,
            fontSize: 12,
            marginLeft: 4,
        },

        // Upcoming events
        upcomingEventsContainer: {
            marginBottom: 20,
        },
        eventCard: {
            backgroundColor: colors.card,
            borderRadius: 15,
            padding: 15,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            ...baseTheme.shadowSmall,
            borderWidth: 1,
            borderColor: colors.border,
        },
        eventDate: {
            width: 50,
            height: 50,
            backgroundColor: colors.primary + '15',
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
        },
        eventDay: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.primary,
        },
        eventMonth: {
            fontSize: 12,
            color: colors.primary,
            textTransform: 'uppercase',
        },
        eventInfo: {
            flex: 1,
        },
        eventTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 4,
        },
        eventTime: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.7,
        },

        // Articles
        articlesContainer: {
            marginBottom: 20,
        },
        articleCard: {
            ...baseTheme.card,
            padding: 0,
        },
        articleImage: {
            width: '100%',
            height: 150,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
        },
        articleInfo: {
            padding: 15,
        },
        articleTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.text,
            marginBottom: 6,
        },
        articleMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        articleDate: {
            fontSize: 12,
            color: colors.text,
            opacity: 0.7,
        },
        articleSummary: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.8,
            lineHeight: 20,
        },

        // Other components
        separator: {
            height: 1,
            backgroundColor: colors.border,
            marginVertical: 15,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 30,
        },
        errorText: {
            fontSize: 16,
            color: '#FF3B30',
            marginBottom: 20,
            textAlign: 'center',
            paddingHorizontal: 24,
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
    });
};