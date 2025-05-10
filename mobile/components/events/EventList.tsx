import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { Event } from '../../types/event.types';
import { EventCard } from './EventCard';
import { eventStyles } from '../../styles/event.styles';

type EventListProps = {
    events: Event[];
    onEventPress: (event: Event) => void;
    loading?: boolean;
    error?: string;
};

export const EventList: React.FC<EventListProps> = ({
    events,
    onEventPress,
    loading,
    error,
}) => {
    if (loading) {
        return (
            <View style={eventStyles.loadingContainer}>
                <Text>Loading events...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={eventStyles.errorContainer}>
                <Text style={eventStyles.errorText}>{error}</Text>
            </View>
        );
    }

    if (events.length === 0) {
        return (
            <View style={eventStyles.eventContent}>
                <Text style={eventStyles.eventDescription}>
                    No events found. Check back later!
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <EventCard event={item} onPress={onEventPress} />
            )}
            contentContainerStyle={eventStyles.eventContent}
        />
    );
};