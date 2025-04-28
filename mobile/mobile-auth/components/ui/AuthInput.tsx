import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';

interface AuthInputProps extends TextInputProps {
    label?: string;
    error?: string;
}

export const AuthInput = React.forwardRef<TextInput, AuthInputProps>(
    ({ label, error, style, ...props }, ref) => {
        return (
            <>
                {label && <ThemedText style={styles.label}>{label}</ThemedText>}
                <TextInput
                    ref={ref}
                    style={[styles.input, error && styles.inputError, style]}
                    placeholderTextColor="#666"
                    {...props}
                />
                {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
            </>
        );
    }
);

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 4,
    },
});