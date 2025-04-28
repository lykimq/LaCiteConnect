import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
    const { formState, updateFormState, login } = useLogin();

    const handleSubmit = async () => {
        try {
            const credentials = {
                email: formState.email,
                password: formState.password
            };
            await login(credentials);
            // Handle successful login (e.g., navigation)
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={formState.email}
                onChangeText={(text) => updateFormState({ email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={formState.password}
                onChangeText={(text) => updateFormState({ password: text })}
                secureTextEntry
            />
            <View style={styles.rememberMeContainer}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => updateFormState({ rememberMe: !formState.rememberMe })}
                >
                    <View style={[styles.checkboxInner, formState.rememberMe && styles.checkboxChecked]} />
                </TouchableOpacity>
                <Text>Remember me</Text>
            </View>
            {formState.error && <Text style={styles.error}>{formState.error}</Text>}
            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={formState.isLoading}
            >
                {formState.isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    checkboxChecked: {
        backgroundColor: '#007AFF',
    },
    error: {
        color: 'red',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007AFF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});