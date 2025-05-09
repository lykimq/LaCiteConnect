import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
// @ts-ignore
import { CompositeNavigationProp } from '@react-navigation/native';
// @ts-ignore
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
// @ts-ignore
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
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        console.log('EventsPage mounted');
        checkAuthAndFetchEvents();
        return () => {
            console.log('EventsPage unmounted');
        };
    }, []);

    const checkAuthAndFetchEvents = async () => {
        try {
            console.log('Checking authentication...');
            const token = await AsyncStorage.getItem('token');
            const userData = await AsyncStorage.getItem('userData');

            // Check if the user is properly authenticated
            setIsAuthenticated(!!token && !!userData);

            console.log('Token available:', !!token, 'Fetching events...');
            await fetchEvents();
        } catch (error) {
            console.error('Error checking authentication:', error);
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
            setError('Failed to load events. Please ensure you have a working internet connection and the server is available.');
            Alert.alert(
                'Error',
                'Failed to load events. Please ensure you have a working internet connection.',
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

    const renderErrorWithActions = () => {
        if (!error) return null;

        return (
            <View style={eventStyles.errorContainer}>
                <Text style={eventStyles.errorText}>{error}</Text>
                <View style={eventStyles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={eventStyles.actionButton}
                        onPress={fetchEvents}
                    >
                        <Text style={eventStyles.actionButtonText}>Retry</Text>
                    </TouchableOpacity>

                    {!isAuthenticated && (
                        <TouchableOpacity
                            style={eventStyles.actionButton}
                            onPress={navigateToLogin}
                        >
                            <Text style={eventStyles.actionButtonText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    console.log('Rendering EventsPage, loading:', loading, 'error:', error, 'events count:', events.length);

    return (
        <View style={eventStyles.eventDetails}>
            <View style={eventStyles.eventHeader}>
                <Text style={eventStyles.eventTitle}>Upcoming Events</Text>
            </View>
            {error ? (
                renderErrorWithActions()
            ) : (
                <EventList
                    events={events}
                    onEventPress={handleEventPress}
                    loading={loading}
                />
            )}
        </View>
    );
};