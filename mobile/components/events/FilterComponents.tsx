import React from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventsStyles } from '../../styles/EventsContent.styles';
import { EventsContent, FilterOptions, EventCategory } from './types';

interface QuickFiltersProps {
    onShowFilterModal: () => void;
    content: EventsContent | null;
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

interface FilterModalProps {
    showFilterModal: boolean;
    onClose: () => void;
    filterOptions: FilterOptions;
    onFilterChange: (options: FilterOptions) => void;
    content: EventsContent | null;
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

                    {/* Search Bar */}
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

                    {/* Time Period Selection */}
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

                    {/* Sort Options */}
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

                    {/* Apply Button */}
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