import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useTheme } from 'hooks/useTheme';
import { EventRegistrationForm } from './EventRegistrationForm';
import { eventService } from 'services/eventService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CreateRegistrationDto, Event } from '../../types/event';
import { EventRegistrationRouteProp } from '../../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<EventRegistrationRouteProp>();

    useEffect(() => {
        const fetchEventAndUserData = async () => {
            try {
                // Fetch event data
                const eventData = await eventService.getEventById(route.params.eventId);
                setEvent(eventData);

                // Fetch user data from AsyncStorage
                const storedUserData = await AsyncStorage.getItem('userData');
                if (storedUserData) {
                    setUserData(JSON.parse(storedUserData));
                }
            } catch (error) {
                console.error('Error loading data:', error);
                Alert.alert('Error', 'Failed to load event details');
                navigation.goBack();
            }
        };
        fetchEventAndUserData();
    }, [route.params.eventId]);

    const handleSubmit = async (formData: { name: string; email: string; phone: string }) => {
        try {
            setLoading(true);
            const [firstName, ...lastNameParts] = formData.name.split(' ');
            const lastName = lastNameParts.join(' ');

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
            setError('Failed to register for the event. Please try again.');
            Alert.alert(
                'Error',
                'Failed to register for the event. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

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