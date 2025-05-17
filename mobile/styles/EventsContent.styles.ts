import { StyleSheet } from 'react-native';
import { theme, createThemedStyles } from './Theme';

/**
 * Creates themed styles for the EventsContent component
 */
export const createEventsStyles = (colors: any) => {
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

        // Filter bar
        filterBar: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
        },
        filterButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingVertical: 8,
            paddingHorizontal: 12,
            ...baseTheme.shadowSmall,
        },
        filterButtonText: {
            fontSize: 14,
            color: colors.text,
            marginLeft: 6,
        },

        // Quick filters
        quickFiltersContainer: {
            marginHorizontal: 20,
            marginBottom: 16,
        },
        quickFiltersContent: {
            paddingVertical: 5,
        },
        moreFiltersButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            ...baseTheme.shadowSmall,
        },
        moreFiltersText: {
            fontSize: 14,
            color: colors.primary,
            marginLeft: 6,
            fontWeight: '500',
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

        // Calendar
        calendarContainer: {
            backgroundColor: colors.card,
            borderRadius: 20,
            overflow: 'hidden',
            height: 400,
            marginBottom: 20,
            ...baseTheme.shadowMedium,
            borderWidth: 1,
            borderColor: colors.border,
        },
        calendar: {
            flex: 1,
        },

        // Event cards
        eventCard: {
            backgroundColor: colors.card,
            borderRadius: 15,
            marginBottom: 16,
            overflow: 'hidden',
            ...baseTheme.shadowMedium,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 16,
        },
        eventContent: {
            flex: 1,
            position: 'relative',
            minHeight: 100,
        },
        dateIconContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: colors.primary + '15',
            borderRadius: 10,
            padding: 8,
            alignItems: 'center',
            minWidth: 50,
            zIndex: 1,
        },
        dayNumber: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.primary,
        },
        monthName: {
            fontSize: 12,
            color: colors.primary,
            textTransform: 'uppercase',
        },
        eventTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginRight: 60,
            marginBottom: 10,
        },
        eventHeader: {
            marginBottom: 8,
        },
        eventLocation: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        locationText: {
            fontSize: 14,
            color: colors.text,
            marginLeft: 6,
            opacity: 0.8,
        },
        detailsContainer: {
            marginTop: 6,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        detailIcon: {
            marginRight: 8,
            width: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        detailText: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.8,
        },
        eventDescription: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.7,
            marginTop: 8,
            lineHeight: 20,
            marginBottom: 8,
        },
        eventFooter: {
            flexDirection: 'row',
            marginTop: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        readMoreButton: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        readMoreText: {
            fontSize: 14,
            color: colors.primary,
            marginRight: 4,
        },
        eventActions: {
            flexDirection: 'row',
            marginTop: 8,
        },
        actionButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
            borderWidth: 1,
            borderColor: colors.border,
        },
        secondaryActionButton: {
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary + '30',
        },

        // Event details
        eventDetailCard: {
            ...baseTheme.card,
            padding: 0,
            marginBottom: 20,
        },
        eventDetailImage: {
            width: '100%',
            height: 200,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        eventDetailContent: {
            padding: 20,
        },
        eventDetailTitle: {
            fontSize: 22,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 15,
        },
        eventDetailInfoSection: {
            marginBottom: 20,
        },
        eventDetailSection: {
            marginBottom: 20,
        },
        eventDetailSectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 10,
        },
        eventDetailText: {
            fontSize: 16,
            color: colors.text,
            opacity: 0.8,
            lineHeight: 24,
        },

        // Tags
        tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 10,
            marginBottom: 15,
        },
        tagItem: {
            backgroundColor: colors.primary + '15',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
        },
        tagText: {
            fontSize: 12,
            color: colors.primary,
            fontWeight: '500',
        },

        // Action buttons
        actionButtonsContainer: {
            marginTop: 20,
            marginBottom: 10,
        },
        primaryActionButton: {
            ...baseTheme.buttonPrimary,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 14,
            borderRadius: 12,
            marginBottom: 10,
        },
        detailSecondaryActionButton: {
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 14,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.primary,
        },
        actionButtonIcon: {
            marginRight: 8,
        },
        primaryActionButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
        },
        secondaryActionButtonText: {
            color: colors.primary,
            fontSize: 16,
            fontWeight: '600',
        },

        // Location map
        mapContainer: {
            height: 200,
            borderRadius: 12,
            overflow: 'hidden',
            marginVertical: 15,
            borderWidth: 1,
            borderColor: colors.border,
        },
        map: {
            flex: 1,
        },

        // Attendees section
        attendeesContainer: {
            marginVertical: 15,
        },
        attendeesList: {
            flexDirection: 'row',
        },
        attendeeAvatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            marginLeft: -10,
        },
        firstAttendeeAvatar: {
            marginLeft: 0,
        },
        attendeeCount: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: -10,
        },
        attendeeCountText: {
            fontSize: 12,
            fontWeight: 'bold',
            color: colors.primary,
        },
        attendeeNames: {
            marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        attendeeName: {
            fontSize: 14,
            color: colors.text,
            marginRight: 5,
            marginBottom: 5,
        },

        // Filter modal
        modalOverlay: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        filterModalContent: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            padding: 20,
            maxHeight: '80%',
        },
        filterModalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        filterModalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
        },
        closeButton: {
            padding: 5,
        },
        filterSection: {
            marginBottom: 20,
        },
        filterSectionTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 12,
        },
        filterOptions: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        filterOption: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        filterOptionSelected: {
            backgroundColor: colors.primary + '15',
            borderColor: colors.primary,
        },
        filterOptionText: {
            fontSize: 14,
            color: colors.text,
            marginLeft: 6,
        },
        filterOptionTextSelected: {
            color: colors.primary,
            fontWeight: '500',
        },

        // Search container
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.border,
        },
        searchInput: {
            flex: 1,
            fontSize: 14,
            color: colors.text,
            marginLeft: 8,
            padding: 0,
        },

        // Filter options grid
        filterOptionsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        filterOptionCard: {
            width: '48%',
            backgroundColor: colors.card,
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        activeFilterOptionCard: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        filterOptionCardText: {
            fontSize: 14,
            color: colors.text,
            marginTop: 8,
            fontWeight: '500',
            textAlign: 'center',
        },
        activeFilterOptionCardText: {
            color: '#FFFFFF',
        },

        // Sort options
        sortOptionsContainer: {
            marginBottom: 20,
        },
        sortButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: colors.border,
        },
        sortButtonText: {
            fontSize: 14,
            color: colors.text,
            marginLeft: 8,
        },

        // Apply button
        applyButton: {
            backgroundColor: colors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: 'center',
        },
        applyButtonText: {
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '600',
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

        listContainer: {
            flex: 1,
            backgroundColor: colors.background,
        },

        // Quick period selector (simplified from period selector)
        quickPeriodContainer: {
            marginBottom: 16,
            backgroundColor: colors.card,
            borderRadius: 15,
            padding: 12,
            ...baseTheme.shadowMedium,
        },
        quickPeriodSelector: {
            flexDirection: 'row',
            paddingVertical: 5,
            flexWrap: 'wrap',
        },
        quickPeriodButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
            marginRight: 8,
            marginBottom: 8,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
        },
        activeQuickPeriodButton: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
        },
        quickPeriodText: {
            fontSize: 14,
            color: colors.text,
        },
        activeQuickPeriodText: {
            color: '#FFFFFF',
            fontWeight: '500',
        },

        // Description modal
        descriptionModalContent: {
            backgroundColor: colors.background,
            borderRadius: 20,
            padding: 20,
            marginHorizontal: 20,
            marginVertical: 40,
            maxHeight: '80%',
            ...baseTheme.shadowLarge,
        },
        descriptionModalHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 10,
        },
        descriptionModalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.text,
            flex: 1,
            marginRight: 10,
        },
        modalCloseIconButton: {
            padding: 5,
        },
        modalEventDate: {
            fontSize: 14,
            color: colors.text,
            opacity: 0.7,
            marginBottom: 15,
        },
        descriptionModalScrollView: {
            marginVertical: 10,
        },
        descriptionModalText: {
            fontSize: 15,
            color: colors.text,
            lineHeight: 22,
        },
        modalPhotoAttachmentsContainer: {
            marginTop: 20,
        },
        modalAttachmentsTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colors.text,
            marginBottom: 10,
        },
        modalPhotoItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderRadius: 10,
            padding: 12,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: colors.border,
        },
        modalAttachmentText: {
            flex: 1,
            fontSize: 14,
            color: colors.text,
            marginHorizontal: 8,
        },
        modalButtonsContainer: {
            marginTop: 20,
        },
        modalButtonsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        modalActionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 12,
        },
        actionButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.primary,
        },

        // No events container
        noEventsContainer: {
            padding: 30,
            alignItems: 'center',
            justifyContent: 'center',
        },
        noEventsText: {
            fontSize: 16,
            color: colors.text,
            opacity: 0.7,
            textAlign: 'center',
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

        // Month selector
        monthSelector: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
    });
};