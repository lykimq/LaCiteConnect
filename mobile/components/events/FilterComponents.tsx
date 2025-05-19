/**
 * Filter Components for Events
 *
 * This file contains multiple components related to filtering and sorting events:
 * 1. QuickFilters - A simple filter button that opens the detailed filter modal
 * 2. FilterModal - A modal with comprehensive filtering and sorting options
 */
import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventsStyles } from '../../styles/events/EventsContent.styles';
import { EventsContent, FilterOptions, EventCategory } from './types';

/**
 * QuickFilters Component
 *
 * Displays a horizontal bar with a "Filter" button that opens the detailed filter modal.
 * Provides a convenient way for users to access filtering options.
 */
interface QuickFiltersProps {
    onShowFilterModal: () => void;     // Handler to open the filter modal
    content: EventsContent | null;     // Localized content strings
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({ onShowFilterModal, content }) => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickFiltersContainer}
            contentContainerStyle={styles.quickFiltersContent}
        >
            {/* Filter Button - Opens the detailed filter modal */}
            <TouchableOpacity
                style={styles.moreFiltersButton}
                onPress={onShowFilterModal}
            >
                <Ionicons name="options-outline" size={16} color={themeColors.primary} />
                <Text style={styles.moreFiltersText}>
                    {content?.ui.filterText || 'More'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

/**
 * FilterModal Component
 *
 * Displays a comprehensive modal with filtering and sorting options for events.
 * Allows users to:
 * - Search events by text
 * - Filter by time period (All, Upcoming, This Week, This Month, Past)
 * - Sort events by date in ascending or descending order
 */
interface FilterModalProps {
    showFilterModal: boolean;                     // Whether the modal is visible
    onClose: () => void;                          // Handler to close the modal
    filterOptions: FilterOptions;                 // Current filter options
    onFilterChange: (options: FilterOptions) => void;  // Handler to update filter options
    content: EventsContent | null;                // Localized content strings
}

export const FilterModal: React.FC<FilterModalProps> = ({
    showFilterModal,
    onClose,
    filterOptions,
    onFilterChange,
    content
}) => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);

    return (
        <Modal
            visible={showFilterModal}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View
                style={styles.modalOverlay}
                onStartShouldSetResponder={() => true}
                onResponderRelease={onClose}
            >
                <View
                    style={styles.filterModalContent}
                    onStartShouldSetResponder={() => true}
                >
                    {/* Modal Header - Title and Close Button */}
                    <View style={styles.filterModalHeader}>
                        <Text style={styles.filterModalTitle}>
                            {content?.ui.filterModalTitle || 'Filter Events'}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={24} color={themeColors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar - Text search for events */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={themeColors.text} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={content?.ui.searchPlaceholder || 'Search events...'}
                            value={filterOptions.searchQuery}
                            onChangeText={(text) => onFilterChange({ ...filterOptions, searchQuery: text })}
                            placeholderTextColor={themeColors.text + '80'}
                        />
                    </View>

                    {/* Time Period Filters - Grid of category options */}
                    <Text style={styles.filterSectionTitle}>
                        {content?.ui.filterSectionTitle || 'Time Period'}
                    </Text>
                    <View style={styles.filterOptionsGrid}>
                        {[
                            { value: 'all', icon: 'calendar', label: content?.ui.filterOptions.allEvents || 'All Events' },
                            { value: 'upcoming', icon: 'time', label: content?.ui.filterOptions.upcoming || 'Upcoming' },
                            { value: 'thisWeek', icon: 'calendar-outline', label: content?.ui.filterOptions.thisWeek || 'This Week' },
                            { value: 'thisMonth', icon: 'calendar-number', label: content?.ui.filterOptions.thisMonth || 'This Month' },
                            { value: 'past', icon: 'hourglass', label: content?.ui.filterOptions.pastEvents || 'Past Events' }
                        ].map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={[
                                    styles.filterOptionCard,
                                    filterOptions.category === option.value && styles.activeFilterOptionCard
                                ]}
                                onPress={() => onFilterChange({ ...filterOptions, category: option.value as EventCategory })}
                            >
                                <Ionicons
                                    name={option.icon as any}
                                    size={24}
                                    color={filterOptions.category === option.value ? '#FFFFFF' : themeColors.primary}
                                />
                                <Text style={[
                                    styles.filterOptionCardText,
                                    filterOptions.category === option.value && styles.activeFilterOptionCardText
                                ]}>
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Sort Options - Toggle between ascending and descending */}
                    <Text style={styles.filterSectionTitle}>
                        {content?.ui.sortSectionTitle || 'Sort By'}
                    </Text>
                    <View style={styles.sortOptionsContainer}>
                        <TouchableOpacity
                            style={styles.sortButton}
                            onPress={() => onFilterChange({
                                ...filterOptions,
                                sortOrder: filterOptions.sortOrder === 'asc' ? 'desc' : 'asc'
                            })}
                        >
                            <Ionicons
                                name={filterOptions.sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
                                size={20}
                                color={themeColors.primary}
                            />
                            <Text style={styles.sortButtonText}>
                                {filterOptions.sortOrder === 'asc'
                                    ? `${content?.ui.sortOptions.date} (${content?.ui.sortOrderLabel || ''} ↑)`
                                    : `${content?.ui.sortOptions.date} (${content?.ui.sortOrderLabel || ''} ↓)`}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Apply Button - Closes the modal and applies filters */}
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={onClose}
                    >
                        <Text style={styles.applyButtonText}>
                            {content?.ui.applyFiltersText || 'Apply Filters'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};