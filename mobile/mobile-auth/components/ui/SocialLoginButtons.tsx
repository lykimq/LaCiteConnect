import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { FontAwesome } from '@expo/vector-icons';
import { SocialLoginProvider } from '../../types/auth.types';

const socialProviders: SocialLoginProvider[] = [
    {
        id: 'google',
        name: 'Google',
        icon: 'google',
        color: '#DB4437',
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: 'facebook',
        color: '#4267B2',
    },
    {
        id: 'apple',
        name: 'Apple',
        icon: 'apple',
        color: '#000000',
    },
];

interface SocialLoginButtonsProps {
    onProviderPress?: (provider: SocialLoginProvider) => void;
}

export const SocialLoginButtons = ({ onProviderPress }: SocialLoginButtonsProps) => {
    const handleProviderPress = (provider: SocialLoginProvider) => {
        if (onProviderPress) {
            onProviderPress(provider);
        }
    };

    return (
        <View style={styles.container}>
            {socialProviders.map((provider) => (
                <TouchableOpacity
                    key={provider.id}
                    style={[styles.button, { backgroundColor: provider.color }]}
                    onPress={() => handleProviderPress(provider)}
                >
                    <FontAwesome name={provider.icon as any} size={20} color="#fff" />
                    <ThemedText style={styles.buttonText}>
                        Continue with {provider.name}
                    </ThemedText>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});