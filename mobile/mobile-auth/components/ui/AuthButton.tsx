import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';

interface AuthButtonProps {
    onPress: () => void;
    title: string;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

export const AuthButton = ({
    onPress,
    title,
    loading = false,
    disabled = false,
    variant = 'primary',
}: AuthButtonProps) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'secondary' && styles.secondaryButton,
                (disabled || loading) && styles.disabledButton,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#fff' : '#007AFF'} />
            ) : (
                <ThemedText
                    style={[
                        styles.buttonText,
                        variant === 'secondary' && styles.secondaryButtonText,
                    ]}
                >
                    {title}
                </ThemedText>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007AFF',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: '#007AFF',
    },
});