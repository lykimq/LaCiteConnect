import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator, Platform, Dimensions, Image } from 'react-native';
import { useRegister } from '../hooks/useRegister';
import { useRouter } from 'expo-router';
import { authStyles } from '../styles/authStyles';

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

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    formContainer: {
        width: isWeb ? Math.min(400, width * 0.9) : '100%',
        maxWidth: 400,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 5,
            },
        }),
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
        textAlign: 'center',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4285F4',
        height: 50,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 20,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
            },
        }),
    },
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 12,
        tintColor: '#FFFFFF',
    },
    googleButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        color: '#666',
        paddingHorizontal: 10,
        fontSize: 14,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f8f8f8',
    },
    error: {
        color: '#ff3b30',
        marginBottom: 15,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#FF9843',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#666',
    },
    signUpLink: {
        fontSize: 14,
        color: '#FF9843',
        fontWeight: 'bold',
    },
});