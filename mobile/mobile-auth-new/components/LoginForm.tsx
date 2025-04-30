import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator, Platform, Dimensions, Image, Alert } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useRouter } from 'expo-router';
import { authStyles } from '../styles/authStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Welcome from './Welcome';

const LoginForm: React.FC = () => {
    const router = useRouter();
    const { formState, updateFormState, login, validateEmail, validatePassword } = useLogin();
    const [error, setError] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);

    const handleSubmit = async () => {
        try {
            console.log('Starting login process...');
            setError(null);
            updateFormState({ isLoading: true });

            if (!formState.email?.trim()) {
                console.log('Email validation failed: empty email');
                setError('Email is required');
                return;
            }

            if (!validateEmail(formState.email)) {
                console.log('Email validation failed: invalid email format');
                setError('Please enter a valid email address');
                return;
            }

            if (!formState.password?.trim()) {
                console.log('Password validation failed: empty password');
                setError('Password is required');
                return;
            }

            if (!validatePassword(formState.password)) {
                console.log('Password validation failed: password too short');
                setError('Password must be at least 6 characters');
                return;
            }

            const credentials = {
                email: formState.email.trim(),
                password: formState.password
            };

            console.log('Attempting login with credentials:', { email: credentials.email });
            const response = await login(credentials);
            console.log('Login response:', response);

            if (response) {
                console.log('Login successful, storing user data...');
                // Store user data in AsyncStorage
                await AsyncStorage.setItem('userData', JSON.stringify({
                    id: response.user.id,
                    email: response.user.email,
                    firstName: response.user.firstName,
                    lastName: response.user.lastName,
                    role: response.user.role
                }));
                console.log('User data stored successfully');

                // Clear the form
                updateFormState({
                    email: '',
                    password: '',
                    isLoading: false
                });

                // Show welcome screen
                setShowWelcome(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again later.';
            setError(errorMessage);
            Alert.alert('Login Failed', errorMessage);
        } finally {
            updateFormState({ isLoading: false });
        }
    };

    const handleGoogleSignIn = async () => {
        // Implement Google Sign In logic here
        try {
            // Google Sign In implementation
        } catch (error) {
            console.error('Google Sign In failed:', error);
            setError('Google Sign In failed. Please try again later.');
        }
    };

    const handleNavigateToRegister = () => {
        try {
            router.push('/(auth)/register');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleForgotPassword = () => {
        // Implement forgot password logic here
        console.log('Forgot password');
    };

    if (showWelcome) {
        return <Welcome />;
    }

    return (
        <View style={authStyles.container}>
            <View style={authStyles.formContainer}>
                <Text style={authStyles.title}>Sign In</Text>
                {error && <Text style={authStyles.error}>{error}</Text>}

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>Email</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Enter your email"
                        value={formState.email}
                        onChangeText={(text) => {
                            updateFormState({ email: text });
                            setError(null);
                        }}
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
                        onChangeText={(text) => {
                            updateFormState({ password: text });
                            setError(null);
                        }}
                        secureTextEntry
                    />
                </View>

                <View style={authStyles.optionsContainer}>
                    <TouchableOpacity
                        style={authStyles.rememberMeContainer}
                        onPress={() => updateFormState({ rememberMe: !formState.rememberMe })}
                    >
                        <View style={[authStyles.checkbox, formState.rememberMe && authStyles.checkboxChecked]}>
                            {formState.rememberMe && <View style={authStyles.checkboxInner} />}
                        </View>
                        <Text style={authStyles.rememberMeText}>Remember me</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={authStyles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[authStyles.button, formState.isLoading && authStyles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={formState.isLoading}
                >
                    {formState.isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={authStyles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <View style={authStyles.dividerContainer}>
                    <View style={authStyles.dividerLine} />
                    <Text style={authStyles.dividerText}>or</Text>
                    <View style={authStyles.dividerLine} />
                </View>

                <TouchableOpacity style={authStyles.googleButton} onPress={handleGoogleSignIn}>
                    <Image
                        source={require('../assets/icons8-google-30.png')}
                        tintColor="#FFFFFF"
                        style={authStyles.googleIcon}
                    />
                    <Text style={authStyles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <View style={[authStyles.signUpContainer, { pointerEvents: 'auto' }]}>
                    <Text style={authStyles.signUpText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={handleNavigateToRegister}>
                        <Text style={authStyles.signUpLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default LoginForm;


