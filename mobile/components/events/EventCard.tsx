import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Event } from '../../types/event';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { eventStyles } from '../../styles/event.styles';

type EventCardProps = {
    event: Event;
    onPress: (event: Event) => void;
};

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
    return (
        <TouchableOpacity
            style={eventStyles.eventCard}
            onPress={() => onPress(event)}
        >
            {event.pictureUrl && (
                <Image
                    source={{ uri: event.pictureUrl }}
                    style={eventStyles.eventImage}
                    resizeMode="cover"
                />
            )}
            <View style={eventStyles.eventContent}>
                <Text style={eventStyles.eventTitle}>{event.title}</Text>
                <Text style={eventStyles.eventDate}>
                    {formatDate(event.startTime)}
                </Text>
                <Text style={eventStyles.eventTime}>
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                </Text>
                <Text style={eventStyles.eventLocation}>
                    {event.address}
                </Text>
                <Text style={eventStyles.eventParticipants}>
                    {event.currentParticipants}/{event.maxParticipants || '∞'} participants
                </Text>
            </View>
        </TouchableOpacity>
    );
};