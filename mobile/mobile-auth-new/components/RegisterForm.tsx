import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator, Platform, Dimensions, Image } from 'react-native';
import { useRegister } from '../hooks/useRegister';
import { useRouter } from 'expo-router';
import { authStyles } from '../styles/authStyles';

const RegisterForm = () => {
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
            updateFormState({ error: 'Please enter a valid email address' });
            return;
        }

        if (!validatePassword(formState.password)) {
            updateFormState({ error: 'Password must be at least 6 characters long' });
            return;
        }

        if (!validateConfirmPassword(formState.password, formState.confirmPassword)) {
            updateFormState({ error: 'Passwords do not match' });
            return;
        }

        try {
            await handleRegister();
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    const handleGoogleSignIn = async () => {
        // Implement Google Sign In logic here
        try {
            // Google Sign In implementation
        } catch (error) {
            console.error('Google Sign In failed:', error);
        }
    };

    const handleNavigateToLogin = () => {
        try {
            router.push('/(auth)/login');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    return (
        <View style={authStyles.container}>
            <View style={authStyles.formContainer}>
                <Text style={authStyles.title}>Create Account</Text>
                {formState.error && <Text style={authStyles.error}>{formState.error}</Text>}

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>Full Name</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Enter your full name"
                        value={formState.firstName}
                        onChangeText={(text) => updateFormState({ firstName: text })}
                        autoCapitalize="words"
                    />
                </View>

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>Email</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Enter your email"
                        value={formState.email}
                        onChangeText={(text) => updateFormState({ email: text })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>Password</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Enter your password"
                        value={formState.password}
                        onChangeText={(text) => updateFormState({ password: text })}
                        secureTextEntry
                    />
                </View>

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>Confirm Password</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Confirm your password"
                        value={formState.confirmPassword}
                        onChangeText={(text) => updateFormState({ confirmPassword: text })}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={authStyles.button} onPress={handleSubmit}>
                    <Text style={authStyles.buttonText}>Register</Text>
                </TouchableOpacity>

                <View style={authStyles.dividerContainer}>
                    <View style={authStyles.dividerLine} />
                    <Text style={authStyles.dividerText}>or</Text>
                    <View style={authStyles.dividerLine} />
                </View>

                <TouchableOpacity style={authStyles.googleButton} onPress={handleGoogleSignIn}>
                    <Image
                        source={require('../assets/icons8-google-30.png')}
                        style={authStyles.googleIcon}
                    />
                    <Text style={authStyles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <View style={authStyles.signUpContainer}>
                    <Text style={authStyles.signUpText}>Already have an account? </Text>
                    <TouchableOpacity onPress={handleNavigateToLogin}>
                        <Text style={authStyles.signUpLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

RegisterForm.displayName = 'RegisterForm';

export { RegisterForm };
