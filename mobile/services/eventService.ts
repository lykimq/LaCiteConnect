import { Event, EventRegistration, CreateRegistrationDto } from '../types/event';
import { API_BASE_URL } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data for when API is unavailable or auth fails
const MOCK_EVENTS: Event[] = [
    {
        id: 'mock-event-1',
        title: 'Sunday Service',
        description: 'Weekly Sunday worship service for the community.',
        pictureUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        address: 'Main Church Hall, 123 Faith Street',
        latitude: 40.7128,
        longitude: -74.0060,
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        endTime: new Date(Date.now() + 86400000 + 7200000), // Tomorrow + 2 hours
        status: 'published',
        maxParticipants: 150,
        currentParticipants: 87,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'mock-event-2',
        title: 'Youth Group Meeting',
        description: 'Weekly gathering for young people aged 13-18.',
        pictureUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
        address: 'Youth Center, 456 Community Avenue',
        latitude: 40.7120,
        longitude: -74.0050,
        startTime: new Date(Date.now() + 172800000), // Day after tomorrow
        endTime: new Date(Date.now() + 172800000 + 5400000), // Day after tomorrow + 1.5 hours
        status: 'published',
        maxParticipants: 50,
        currentParticipants: 32,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 'mock-event-3',
        title: 'Bible Study',
        description: 'Deep dive into scripture with Pastor John.',
        pictureUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5dc49537',
        address: 'Meeting Room 3, 789 Faith Street',
        latitude: 40.7135,
        longitude: -74.0070,
        startTime: new Date(Date.now() + 259200000), // 3 days from now
        endTime: new Date(Date.now() + 259200000 + 3600000), // 3 days from now + 1 hour
        status: 'published',
        maxParticipants: 30,
        currentParticipants: 30,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const getAuthHeader = async (): Promise<Record<string, string>> => {
    const token = await AsyncStorage.getItem('token');
    console.log('Auth token:', token ? 'Present' : 'Missing');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

// Function to decide whether to use API or mock data
const shouldUseMockData = async (): Promise<boolean> => {
    // If we're in development mode or using a temporary token, use mock data
    const token = await AsyncStorage.getItem('token');
    return !token || token === 'temp-auth-token' || token === 'guest-access-token';
};

export const eventService = {
    /**
     * Get all upcoming events
     */
    getUpcomingEvents: async (): Promise<Event[]> => {
        try {
            // Check if we should use mock data
            const useMockData = await shouldUseMockData();
            if (useMockData) {
                console.log('Using mock events data');
                return MOCK_EVENTS;
            }

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
                console.log('API request failed, falling back to mock data');
                return MOCK_EVENTS;
            }

            const data = await response.json();
            console.log('Received events:', data);
            return data;
        } catch (error) {
            console.error('Error in getUpcomingEvents:', error);
            console.log('Error occurred, falling back to mock data');
            return MOCK_EVENTS;
        }
    },

    /**
     * Get event details by ID
     */
    getEventById: async (id: string): Promise<Event> => {
        try {
            // Check if we should use mock data
            const useMockData = await shouldUseMockData();
            if (useMockData) {
                console.log('Using mock event details');
                const mockEvent = MOCK_EVENTS.find(event => event.id === id);
                if (mockEvent) {
                    return mockEvent;
                }
                return MOCK_EVENTS[0]; // Return the first mock event if ID not found
            }

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
                console.log('API request failed, falling back to mock data');
                return MOCK_EVENTS.find(event => event.id === id) || MOCK_EVENTS[0];
            }

            const data = await response.json();
            console.log('Received event details:', data);
            return data;
        } catch (error) {
            console.error('Error in getEventById:', error);
            console.log('Error occurred, falling back to mock data');
            return MOCK_EVENTS.find(event => event.id === id) || MOCK_EVENTS[0];
        }
    },

    /**
     * Register for an event
     */
    registerForEvent: async (dto: CreateRegistrationDto): Promise<EventRegistration> => {
        try {
            // Check if we should use mock data
            const useMockData = await shouldUseMockData();
            if (useMockData) {
                console.log('Using mock registration data');

                // Return a mock successful registration
                return {
                    id: `reg-${Math.random().toString(36).substr(2, 9)}`,
                    eventId: dto.eventId,
                    userId: 'mock-user-id',
                    timeSlotId: null,
                    registrationStatus: 'CONFIRMED',
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    phoneNumber: dto.phoneNumber || null,
                    numberOfGuests: dto.numberOfGuests,
                    additionalNotes: dto.additionalNotes || null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }

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
        const response = await fetch(`${API_BASE_URL}/events/registrations/${registrationId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update registration status');
        }

        return response.json();
    },
};