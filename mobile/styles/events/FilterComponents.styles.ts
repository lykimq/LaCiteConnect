import { StyleSheet } from 'react-native';
import { createThemedStyles } from '../Theme';

/**
 * Styles specific to the FilterComponents (QuickFilters and FilterModal)
 * This file contains styles for the filtering interface elements that allow users
 * to filter and sort events by various criteria such as date, category, and search terms
 */
export const createFilterComponentsStyles = (colors: any) => {
    // Get base themed styles
    const baseTheme = createThemedStyles(colors);

    return StyleSheet.create({
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

        // Filter modal
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
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
    });
};