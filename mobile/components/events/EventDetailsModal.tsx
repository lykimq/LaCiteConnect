import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createEventsStyles } from '../../styles/EventsContent.styles';
import { CalendarEvent, EventsContent, isDriveAttachment } from './types';
import { convertHtmlToFormattedText, extractAttachmentLinks, parseLocationString } from '../../utils/htmlUtils';

interface EventDetailsModalProps {
    showFullDescription: boolean;
    onClose: () => void;
    selectedEvent: CalendarEvent | null;
    content: EventsContent | null;
    formatEventDate: (event: CalendarEvent) => string;
    onAddToCalendar: (event: CalendarEvent) => void;
    onViewDetailUrl: (event: CalendarEvent) => void;
    onOpenMap: (location: string) => void;
    onViewAttachment: (url: string) => void;
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

    if (!selectedEvent) return null;

    // Format the description and ensure it's not empty
    const formattedDescription = selectedEvent.description ?
        convertHtmlToFormattedText(selectedEvent.description) : '';
    const attachments = selectedEvent.description ?
        extractAttachmentLinks(selectedEvent.description) : [];
    const locationDetails = selectedEvent.location ?
        parseLocationString(selectedEvent.location) : null;

    return (
        <Modal
            visible={showFullDescription}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    style={styles.descriptionModalContent}
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                >
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

                    <Text style={styles.modalEventDate}>
                        {formatEventDate(selectedEvent)}
                    </Text>

                    <ScrollView
                        style={styles.descriptionModalScrollView}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        showsVerticalScrollIndicator={true}
                        bounces={true}
                        decelerationRate="fast"
                        scrollEventThrottle={16}
                        overScrollMode="always"
                        keyboardShouldPersistTaps="handled"
                        scrollToOverflowEnabled={true}
                        directionalLockEnabled={true}
                        automaticallyAdjustContentInsets={false}
                        contentInsetAdjustmentBehavior="automatic"
                    >
                        <View style={{
                            paddingBottom: 16,
                            paddingTop: 8,
                            backgroundColor: themeColors.card,
                            borderRadius: 12,
                        }}>
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

                            <Text
                                style={[
                                    styles.descriptionModalText,
                                    { lineHeight: 24 }
                                ]}
                                selectable={true}
                            >
                                {formattedDescription}
                            </Text>

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

                    <View style={styles.modalButtonsContainer}>
                        <View style={styles.modalButtonsRow}>
                            <TouchableOpacity
                                style={[styles.modalActionButton, { flex: 1, backgroundColor: themeColors.primary + '15', marginRight: 8 }]}
                                onPress={() => onAddToCalendar(selectedEvent)}
                            >
                                <Ionicons name="calendar-outline" size={18} color={themeColors.primary} />
                                <Text style={[styles.actionButtonText, { marginLeft: 6 }]}>
                                    {content?.ui.addToCalendarText || 'Add to Calendar'}
                                </Text>
                            </TouchableOpacity>

                            {locationDetails && (
                                <TouchableOpacity
                                    style={[styles.modalActionButton, { flex: 1, backgroundColor: themeColors.primary + '15' }]}
                                    onPress={() => onOpenMap(selectedEvent.location || '')}
                                >
                                    <Ionicons name="map-outline" size={18} color={themeColors.primary} />
                                    <Text style={[styles.actionButtonText, { marginLeft: 6 }]}>
                                        {content?.ui.viewLocationText || 'View Location'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {selectedEvent.detailsUrl && (
                            <TouchableOpacity
                                style={[styles.modalActionButton, { marginTop: 8, backgroundColor: themeColors.primary }]}
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
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
};