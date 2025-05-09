import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TabParamList } from '../../types/navigation';
import { Event } from '../../types/event';
import { EventList } from './EventList';
import { eventStyles } from '../../styles/event.styles';
import { eventService } from 'services/eventService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EventsPageNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, 'Events'>,
    NativeStackNavigationProp<RootStackParamList>
>;

type EventsPageProps = {
    navigation: EventsPageNavigationProp;
};

export const EventsPage: React.FC<EventsPageProps> = ({ navigation }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        console.log('EventsPage mounted');
        verifyTokenAndFetchEvents();
        return () => {
            console.log('EventsPage unmounted');
        };
    }, []);

    const verifyTokenAndFetchEvents = async () => {
        try {
            console.log('Verifying token...');
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.log('No token found, creating temporary one');
                // Create a temporary token for guest access
                await AsyncStorage.setItem('token', 'guest-access-token');
            }
            console.log('Token available, fetching events...');
            await fetchEvents();
        } catch (error) {
            console.error('Error verifying token:', error);
            setError('Authentication error. Please try again.');
        }
    };

    const fetchEvents = async () => {
        console.log('Fetching events...');
        try {
            setLoading(true);
            console.log('Calling eventService.getUpcomingEvents()');
            const data = await eventService.getUpcomingEvents();
            console.log('Received events data:', data);
            setEvents(data);
            setError(undefined);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Failed to load events. Please try again later.');
            Alert.alert(
                'Error',
                'Failed to load events. Please try again later.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
            console.log('Finished fetching events, loading:', loading);
        }
    };

    const handleEventPress = (event: Event) => {
        console.log('Event pressed:', event.id);
        if (navigation.navigate) {
            navigation.navigate('EventDetails', { eventId: event.id });
        }
    };

    const navigateToLogin = () => {
        // Use a more compatible navigation approach
        if (navigation.getParent()) {
            // If we have a parent navigator, use it to navigate to Login
            navigation.getParent()?.navigate('Login');
        } else {
            // Direct navigation as fallback
            navigation.navigate('Login' as any);
        }
    };

    console.log('Rendering EventsPage, loading:', loading, 'error:', error, 'events count:', events.length);

    return (
        <View style={eventStyles.eventDetails}>
            <View style={eventStyles.eventHeader}>
                <Text style={eventStyles.eventTitle}>Upcoming Events</Text>
            </View>
            <EventList
                events={events}
                onEventPress={handleEventPress}
                loading={loading}
                error={error}
            />
        </View>
    );
};