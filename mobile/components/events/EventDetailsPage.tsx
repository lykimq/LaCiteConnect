import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Event, CreateRegistrationDto } from '../../types/event.types';
import { EventRegistrationForm } from './EventRegistrationForm';
import { eventStyles } from '../../styles/event.styles';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { eventService } from 'services/eventService';

type RouteParams = {
    eventId: string;
};

export const EventDetailsPage: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { eventId } = route.params as RouteParams;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [registrationError, setRegistrationError] = useState<string | undefined>();

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        try {
            setLoading(true);
            const data = await eventService.getEventById(eventId);
            setEvent(data);
            setError(undefined);
        } catch (err) {
            console.error('Error fetching event details:', err);
            setError('Failed to load event details. Please ensure you have a working internet connection and the server is available.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegistration = async (formData: {
        name: string;
        email: string;
        phone: string;
    }) => {
        try {
            setRegistrationError(undefined);

            if (!formData.name || !formData.email) {
                setRegistrationError('Please provide your name and email.');
                return;
            }

            const [firstName, ...lastNameParts] = formData.name.split(' ');
            const lastName = lastNameParts.join(' ');

            if (!firstName || !lastName) {
                setRegistrationError('Please provide both first and last name.');
                return;
            }

            const registrationDto: CreateRegistrationDto = {
                eventId,
                firstName,
                lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                numberOfGuests: 0,
                additionalNotes: '',
            };

            await eventService.registerForEvent(registrationDto);

            Alert.alert(
                'Success',
                'You have successfully registered for this event!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (err) {
            console.error('Error registering for event:', err);
            setRegistrationError('Failed to register for the event. Please ensure you have a working internet connection and try again.');
        }
    };

    const renderErrorWithRetry = () => {
        return (
            <View style={eventStyles.errorContainer}>
                <Text style={eventStyles.errorText}>
                    {error || 'Event not found'}
                </Text>
                <View style={eventStyles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={eventStyles.actionButton}
                        onPress={fetchEventDetails}
                    >
                        <Text style={eventStyles.actionButtonText}>Retry</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={eventStyles.actionButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={eventStyles.actionButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={eventStyles.loadingContainer}>
                <Text>Loading event details...</Text>
            </View>
        );
    }

    if (error || !event) {
        return renderErrorWithRetry();
    }

    return (
        <ScrollView style={eventStyles.eventDetails}>
            {event.pictureUrl && (
                <Image
                    source={{ uri: event.pictureUrl }}
                    style={eventStyles.eventImageLarge}
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
                <Text style={eventStyles.eventLocation}>{event.address}</Text>
                <Text style={eventStyles.eventParticipants}>
                    {event.currentParticipants}/{event.maxParticipants || '∞'} participants
                </Text>

                <Text style={eventStyles.eventDescription}>
                    {event.description}
                </Text>

                <EventRegistrationForm
                    event={event}
                    onSubmit={handleRegistration}
                    error={registrationError}
                />
            </View>
        </ScrollView>
    );
};