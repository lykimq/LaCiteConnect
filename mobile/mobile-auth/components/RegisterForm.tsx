import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthInput } from './ui/AuthInput';
import { AuthButton } from './ui/AuthButton';
import { ThemedText } from './ThemedText';
import { useRegister } from '../hooks/useRegister';
import { SocialLoginButtons } from './ui/SocialLoginButtons';

export const RegisterForm = () => {
    const router = useRouter();
    const {
        formState,
        updateFormState,
        handleRegister,
        validateEmail,
        validatePassword,
        validateConfirmPassword,
    } = useRegister();

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

        if (!validateConfirmPassword(formState.password, formState.confirmPassword)) {
            updateFormState({
                error: { message: 'Passwords do not match' },
            });
            return;
        }

        try {
            await handleRegister();
            router.replace('/(tabs)');
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    return (
        <View style={styles.container}>
            <AuthInput
                label="First Name"
                placeholder="Enter your first name"
                value={formState.firstName}
                onChangeText={(text) => updateFormState({ firstName: text })}
                autoCapitalize="words"
                autoComplete="name-given"
            />

            <AuthInput
                label="Last Name"
                placeholder="Enter your last name"
                value={formState.lastName}
                onChangeText={(text) => updateFormState({ lastName: text })}
                autoCapitalize="words"
                autoComplete="name-family"
            />

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
                autoComplete="password-new"
                error={formState.error?.message}
            />

            <AuthInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formState.confirmPassword}
                onChangeText={(text) => updateFormState({ confirmPassword: text })}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                error={formState.error?.message}
            />

            <AuthButton
                title="Register"
                onPress={handleSubmit}
                loading={formState.isLoading}
                disabled={formState.isLoading}
            />

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>OR</ThemedText>
                <View style={styles.dividerLine} />
            </View>

            <SocialLoginButtons />

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/(auth)/login')}
            >
                <ThemedText style={styles.linkText}>
                    Already have an account? Login
                </ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 20,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 10,
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