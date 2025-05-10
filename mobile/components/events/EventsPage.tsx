import React, { useEffect, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, FlatList } from 'react-native';
// @ts-ignore
import { CompositeNavigationProp } from '@react-navigation/native';
// @ts-ignore
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
// @ts-ignore
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabParamList } from '../../types/navigation';
import { Event } from '../../types/event.types';
import { EventList } from './EventList';
import { eventStyles } from '../../styles/event.styles';
import { eventService } from 'services/eventService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { welcomeStyles } from '../../styles/welcome.styles';
import { useTheme } from '../../hooks/useTheme';

type EventsPageNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, 'Events'>,
    NativeStackNavigationProp<RootStackParamList>
>;

type EventsPageProps = {
    navigation: EventsPageNavigationProp;
};

export const EventsPage: React.FC<EventsPageProps> = ({ navigation }) => {
    const { colors } = useTheme();
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

    const renderHeader = () => (
        <View style={[welcomeStyles.header, { marginTop: 40 }]}>
            <Text style={[welcomeStyles.title, { color: colors.text }]}>
                Upcoming Events
            </Text>
            <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                Join us for our upcoming events
            </Text>
        </View>
    );

    const renderErrorWithActions = () => {
        if (!error) return null;

        return (
            <View style={welcomeStyles.featureCard}>
                <Text style={[welcomeStyles.featureText, { color: 'red' }]}>{error}</Text>
                <View style={eventStyles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={welcomeStyles.loginButton}
                        onPress={fetchEvents}
                    >
                        <Text style={welcomeStyles.loginButtonText}>Retry</Text>
                    </TouchableOpacity>

                    {!isAuthenticated && (
                        <TouchableOpacity
                            style={welcomeStyles.loginButton}
                            onPress={navigateToLogin}
                        >
                            <Text style={welcomeStyles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const renderContent = () => {
        if (error) {
            return renderErrorWithActions();
        }

        return (
            <View style={welcomeStyles.featureCard}>
                <EventList
                    events={events}
                    onEventPress={handleEventPress}
                    loading={loading}
                />
            </View>
        );
    };

    console.log('Rendering EventsPage, loading:', loading, 'error:', error, 'events count:', events.length);

    return (
        <FlatList
            data={[1]} // Single item since we're using it as a container
            renderItem={() => renderContent()}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={welcomeStyles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyExtractor={() => 'events-container'}
        />
    );
};