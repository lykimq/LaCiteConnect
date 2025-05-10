import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Event } from '../../types/event.types';
import { eventStyles } from '../../styles/event.styles';

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    phoneNumber?: string;
}

type EventRegistrationFormProps = {
    event: Event;
    userData?: UserData | null;
    onSubmit: (formData: {
        name: string;
        email: string;
        phone: string;
    }) => void;
    loading?: boolean;
    error?: string;
};

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
    event,
    userData,
    onSubmit,
    loading,
    error,
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Pre-fill form with user data if available
    useEffect(() => {
        if (userData) {
            const fullName = `${userData.firstName} ${userData.lastName}`.trim();
            setName(fullName);
            setEmail(userData.email || '');
            setPhone(userData.phoneNumber || '');
        }
    }, [userData]);

    const handleSubmit = () => {
        onSubmit({ name, email, phone });
    };

    return (
        <View style={eventStyles.eventContent}>
            <Text style={eventStyles.eventTitle}>Register for {event.title}</Text>
            <Text style={eventStyles.eventDescription}>
                Please fill out the form below to register for this event.
            </Text>

            {error && (
                <View style={eventStyles.errorContainer}>
                    <Text style={eventStyles.errorText}>{error}</Text>
                </View>
            )}

            <TextInput
                style={eventStyles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />

            <TextInput
                style={eventStyles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={eventStyles.input}
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <TouchableOpacity
                style={[
                    eventStyles.registerButton,
                    loading && { opacity: 0.7 },
                ]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={eventStyles.registerButtonText}>
                    {loading ? 'Registering...' : 'Register'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};