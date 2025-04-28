import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthInput } from './ui/AuthInput';
import { AuthButton } from './ui/AuthButton';
import { ThemedText } from './ThemedText';
import { useLogin } from '../hooks/useLogin';

export const AuthForm = () => {
    const router = useRouter();
    const {
        formState,
        updateFormState,
        handleLogin,
        validateEmail,
        validatePassword,
    } = useLogin();

    const handleSubmit = async () => {
        if (!validateEmail(formState.email)) {
            updateFormState({
                error: { message: 'Please enter a valid email address' },
            });
            return;
        }

        if (!validatePassword(formState.password)) {
            updateFormState({
                error: { message: 'Password must be at least 6 characters long' },
            });
            return;
        }

        try {
            await handleLogin();
            router.replace('/(tabs)');
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    return (
        <View style={styles.container}>
            <AuthInput
                label="Email"
                placeholder="Enter your email"
                value={formState.email}
                onChangeText={(text) => updateFormState({ email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={formState.error?.message}
            />

            <AuthInput
                label="Password"
                placeholder="Enter your password"
                value={formState.password}
                onChangeText={(text) => updateFormState({ password: text })}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                error={formState.error?.message}
            />

            <View style={styles.rememberMeContainer}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => updateFormState({ rememberMe: !formState.rememberMe })}
                >
                    <View
                        style={[
                            styles.checkboxInner,
                            formState.rememberMe && styles.checkboxChecked,
                        ]}
                    />
                </TouchableOpacity>
                <ThemedText style={styles.rememberMeText}>Remember me</ThemedText>
            </View>

            <AuthButton
                title="Login"
                onPress={handleSubmit}
                loading={formState.isLoading}
                disabled={formState.isLoading}
            />

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/(auth)/register')}
            >
                <ThemedText style={styles.linkText}>
                    Don't have an account? Register
                </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/(auth)/forgot-password')}
            >
                <ThemedText style={styles.linkText}>Forgot Password?</ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
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
    rememberMeText: {
        fontSize: 14,
        color: '#666',
    },
    linkButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 14,
    },
});