import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useTheme } from 'hooks/useTheme';
import { EventRegistrationForm } from './EventRegistrationForm';
import { eventService } from 'services/eventService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CreateRegistrationDto, Event } from '../../types/event.types';
import { EventRegistrationRouteProp } from '../../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eventStyles } from '../../styles/event.styles';

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber?: string;
}

export const EventRegistrationPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState<Event | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | undefined>(undefined);
    const [fetchError, setFetchError] = useState<string | undefined>(undefined);
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<EventRegistrationRouteProp>();

    useEffect(() => {
        fetchEventAndUserData();
    }, [route.params.eventId]);

    const fetchEventAndUserData = async () => {
        try {
            setLoading(true);
            // Fetch event data
            try {
                const eventData = await eventService.getEventById(route.params.eventId);
                setEvent(eventData);
                setFetchError(undefined);
            } catch (error) {
                console.error('Error loading event data:', error);
                setFetchError('Failed to load event details. Please ensure you have a working internet connection and try again.');
                return;
            }

            // Fetch user data from AsyncStorage
            try {
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                // Non-critical error, we can continue without user data
            }
        } catch (error) {
            console.error('Error loading data:', error);
            setFetchError('Failed to load required data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData: { name: string; email: string; phone: string }) => {
        try {
            setLoading(true);
            setError(undefined);

            if (!formData.name || !formData.email) {
                setError('Please provide your name and email.');
                return;
            }

            const [firstName, ...lastNameParts] = formData.name.split(' ');
            const lastName = lastNameParts.join(' ');

            if (!firstName || !lastName) {
                setError('Please provide both first and last name.');
                return;
            }

            const registrationDto: CreateRegistrationDto = {
                eventId: route.params.eventId,
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
                'You have successfully registered for the event!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.error('Failed to register for event:', error);
            setError('Failed to register for the event. Please ensure you have a working internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderErrorWithRetry = () => {
        return (
            <View style={eventStyles.errorContainer}>
                <Text style={eventStyles.errorText}>{fetchError}</Text>
                <View style={eventStyles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={eventStyles.actionButton}
                        onPress={fetchEventAndUserData}
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

    if (loading && !event) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={eventStyles.loadingContainer}>
                    <Text>Loading event details...</Text>
                </View>
            </View>
        );
    }

    if (fetchError) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {renderErrorWithRetry()}
            </View>
        );
    }

    if (!event) {
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <EventRegistrationForm
                event={event}
                userData={userData}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});