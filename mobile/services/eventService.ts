import { Event, EventRegistration, CreateRegistrationDto } from '../types/event';
import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthHeader = async (): Promise<Record<string, string>> => {
    const token = await AsyncStorage.getItem('token');
    console.log('Auth token:', token ? 'Present' : 'Missing');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const eventService = {
    /**
     * Get all upcoming events
     */
    getUpcomingEvents: async (): Promise<Event[]> => {
        try {
            const url = `${API_BASE_URL}/events`;
            console.log('Fetching events from:', url);
            const headers = await getAuthHeader();
            console.log('Request headers:', headers);

            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received events:', data);
            return data;
        } catch (error) {
            console.error('Error in getUpcomingEvents:', error);
            throw error;
        }
    },

    /**
     * Get event details by ID
     */
    getEventById: async (id: string): Promise<Event> => {
        try {
            const url = `${API_BASE_URL}/events/${id}`;
            console.log('Fetching event details from:', url);
            const headers = await getAuthHeader();
            console.log('Request headers:', headers);

            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Failed to fetch event details: ${response.status}`);
            }

            const data = await response.json();
            console.log('Received event details:', data);
            return data;
        } catch (error) {
            console.error('Error in getEventById:', error);
            throw error;
        }
    },

    /**
     * Register for an event
     */
    registerForEvent: async (dto: CreateRegistrationDto): Promise<EventRegistration> => {
        try {
            const url = `${API_BASE_URL}/events/register`;
            console.log('Registering for event:', url);
            console.log('Registration data:', dto);
            const headers = await getAuthHeader();
            console.log('Request headers:', headers);

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(dto),
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                let errorMessage = 'Failed to register for event';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorMessage;
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Registration successful:', data);
            return data;
        } catch (error) {
            console.error('Error in registerForEvent:', error);
            throw error;
        }
    },

    /**
     * Get user's event registrations
     */
    getUserRegistrations: async (): Promise<EventRegistration[]> => {
        try {
            const url = `${API_BASE_URL}/events/my-registrations`;
            console.log('Fetching user registrations from:', url);
            const headers = await getAuthHeader();
            console.log('Request headers:', headers);

            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                let errorMessage = 'Failed to fetch user registrations';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorMessage;
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Received user registrations:', data);
            return data;
        } catch (error) {
            console.error('Error in getUserRegistrations:', error);
            throw error;
        }
    },

    /**
     * Update registration status
     */
    updateRegistrationStatus: async (registrationId: string, status: string): Promise<EventRegistration> => {
        try {
            const url = `${API_BASE_URL}/events/registrations/${registrationId}/status`;
            const headers = await getAuthHeader();

            const response = await fetch(url, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = 'Failed to update registration status';
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMessage = errorJson.message || errorMessage;
                } catch (e) {
                    console.error('Failed to parse error response:', e);
                }
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error) {
            console.error('Error in updateRegistrationStatus:', error);
            throw error;
        }
    },
};