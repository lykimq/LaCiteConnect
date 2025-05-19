/**
 * EventDetailsModal Component
 *
 * Displays a modal with detailed information about a selected event.
 * Shows the full event description, location, date/time, and attachments.
 * Provides action buttons for adding to calendar, viewing on map, and opening external details.
 */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventsStyles } from '../../styles/events/EventsContent.styles';
import { CalendarEvent, EventsContent, isDriveAttachment } from './types';
import {
    convertHtmlToFormattedText,
    extractAttachmentLinks,
    parseLocationString
} from '../../utils/htmlUtils';
import RenderHtml from 'react-native-render-html';
import { createEventDetailsHtmlStyles } from '../../styles/events/EventDetailsModal.styles';

/**
 * Props for the EventDetailsModal component
 */
interface EventDetailsModalProps {
    showFullDescription: boolean;                  // Whether the modal is visible
    onClose: () => void;                           // Handler to close the modal
    selectedEvent: CalendarEvent | null;           // The event being displayed
    content: EventsContent | null;                 // Localized content strings
    formatEventDate: (event: CalendarEvent) => string;  // Function to format event date
    onAddToCalendar: (event: CalendarEvent) => void;    // Handler for adding event to device calendar
    onViewDetailUrl: (event: CalendarEvent) => void;    // Handler for opening event detail URL
    onOpenMap: (location: string) => void;              // Handler for opening map with location
    onViewAttachment: (url: string) => void;            // Handler for viewing attachments
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
    showFullDescription,
    onClose,
    selectedEvent,
    content,
    formatEventDate,
    onAddToCalendar,
    onViewDetailUrl,
    onOpenMap,
    onViewAttachment
}) => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createEventsStyles);
    const { width } = useWindowDimensions();

    // If no event is selected, don't render anything
    if (!selectedEvent) return null;

    // Convert the description to a format suitable for HTML rendering
    const htmlContent = selectedEvent.description ? {
        html: selectedEvent.description
    } : { html: '' };

    // Get plain text for parts that don't need HTML rendering
    const formattedDescription = selectedEvent.description
        ? convertHtmlToFormattedText(selectedEvent.description)
        : '';

    const attachments = selectedEvent.description
        ? extractAttachmentLinks(selectedEvent.description)
        : [];
    const locationDetails = selectedEvent.location
        ? parseLocationString(selectedEvent.location)
        : null;

    // Get HTML styles from the styles file
    const tagsStyles = createEventDetailsHtmlStyles(themeColors);

    return (
        <Modal
            visible={showFullDescription}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.centeredModalOverlay}>
                {/* Background press handler to close modal */}
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ width: '100%', alignItems: 'center' }}
                >
                    <View style={styles.centeredModalContent}>
                        {/* Modal Header - Title and Close Button */}
                        <View style={styles.descriptionModalHeader}>
                            <Text style={styles.descriptionModalTitle} numberOfLines={2}>
                                {selectedEvent.summary}
                            </Text>
                            <TouchableOpacity
                                style={styles.modalCloseIconButton}
                                onPress={onClose}
                            >
                                <Ionicons name="close" size={18} color={themeColors.text} />
                            </TouchableOpacity>
                        </View>

                        {/* Event Date/Time */}
                        <Text style={styles.modalEventDate}>
                            {formatEventDate(selectedEvent)}
                        </Text>

                        {/* Scrollable Content Area */}
                        <ScrollView
                            style={styles.descriptionModalScrollView}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                            showsVerticalScrollIndicator
                            bounces
                            decelerationRate={Platform.OS === 'ios' ? 'fast' : 'normal'}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View
                                style={{
                                    paddingTop: 8,
                                    backgroundColor: themeColors.card,
                                    borderRadius: 12,
                                }}
                            >
                                {/* Event Location - Only displayed if available */}
                                {locationDetails && (
                                    <View style={styles.eventLocation}>
                                        <Ionicons
                                            name="location-outline"
                                            size={18}
                                            color={themeColors.primary}
                                            style={{ marginTop: 2 }}
                                        />
                                        <Text style={styles.locationText}>
                                            {locationDetails.address}
                                        </Text>
                                    </View>
                                )}

                                {/* Full Event Description using HTML renderer */}
                                <View style={styles.descriptionModalText}>
                                    <RenderHtml
                                        contentWidth={width - 64} // Account for padding
                                        source={htmlContent}
                                        tagsStyles={tagsStyles}
                                        defaultTextProps={{
                                            selectable: true
                                        }}
                                    />
                                </View>

                                {/* Attachments Section - Only displayed if attachments exist */}
                                {attachments.length > 0 && (
                                    <View style={[styles.modalPhotoAttachmentsContainer, { marginTop: 16 }]}>
                                        <Text style={styles.modalAttachmentsTitle}>
                                            {content?.ui.viewFilesText || 'Attachments'}
                                        </Text>
                                        {attachments.map((attachment, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                style={styles.modalPhotoItem}
                                                onPress={() => onViewAttachment(attachment.url)}
                                            >
                                                <Ionicons
                                                    name={isDriveAttachment(attachment.url) ? 'document-outline' : 'link-outline'}
                                                    size={16}
                                                    color={themeColors.text}
                                                />
                                                <Text style={styles.modalAttachmentText} numberOfLines={1}>
                                                    {attachment.title}
                                                </Text>
                                                <Ionicons name="open-outline" size={16} color={themeColors.text} />
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        {/* Action Buttons */}
                        <View style={styles.modalButtonsContainer}>
                            <View style={styles.modalButtonsRow}>
                                {/* Add to Calendar Button */}
                                <TouchableOpacity
                                    style={[
                                        styles.modalActionButton,
                                        {
                                            flex: 1,
                                            backgroundColor: themeColors.primary + '15',
                                            marginRight: 8
                                        }
                                    ]}
                                    onPress={() => onAddToCalendar(selectedEvent)}
                                >
                                    <Ionicons name="calendar-outline" size={18} color={themeColors.primary} />
                                    <Text style={[styles.actionButtonText, { marginLeft: 6 }]}>
                                        {content?.ui.addToCalendarText || 'Add to Calendar'}
                                    </Text>
                                </TouchableOpacity>

                                {/* View Location Button - Only displayed if location available */}
                                {locationDetails && (
                                    <TouchableOpacity
                                        style={[
                                            styles.modalActionButton,
                                            { flex: 1, backgroundColor: themeColors.primary + '15' }
                                        ]}
                                        onPress={() => onOpenMap(selectedEvent.location || '')}
                                    >
                                        <Ionicons name="map-outline" size={18} color={themeColors.primary} />
                                        <Text style={[styles.actionButtonText, { marginLeft: 6 }]}>
                                            {content?.ui.viewLocationText || 'View Location'}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* View Details Button - Only displayed if details URL available */}
                            {selectedEvent.detailsUrl && (
                                <TouchableOpacity
                                    style={[
                                        styles.modalActionButton,
                                        { marginTop: 8, backgroundColor: themeColors.primary }
                                    ]}
                                    onPress={() => {
                                        onClose();
                                        onViewDetailUrl(selectedEvent);
                                    }}
                                >
                                    <Ionicons name="open-outline" size={18} color="#FFFFFF" />
                                    <Text style={[styles.actionButtonText, { marginLeft: 6, color: '#FFFFFF' }]}>
                                        {content?.ui.viewDetailsText || 'View Details'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};
