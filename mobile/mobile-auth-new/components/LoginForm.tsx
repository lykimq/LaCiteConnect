import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, ActivityIndicator, Image, Alert } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useRouter } from 'expo-router';
import { authStyles } from '../styles/authStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Welcome from './Welcome';
import { handleGoogleSignIn } from '../utils/googleSignIn';
import { validateLoginFields } from '../utils/formValidation';

const LoginForm: React.FC = () => {
    const router = useRouter();
    const { formState, updateFormState, login } = useLogin();
    const [error, setError] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Add dialog state for Google Sign-In
    const [dialogMessage, setDialogMessage] = useState<{ title: string; message: string }>({ title: '', message: '' });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogCallback, setDialogCallback] = useState<(() => void) | null>(null);

    const alertUtils = {
        setDialogMessage,
        setDialogVisible,
        setDialogCallback
    };

    const handleSubmit = async () => {
        try {
            console.log('Starting login process...');
            setError(null);
            updateFormState({ isLoading: true });

            const validationResult = validateLoginFields(formState);
            if (!validationResult.isValid) {
                console.log('Form validation failed:', validationResult.errors);
                setFieldErrors(validationResult.errors);
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

    const handleGoogleSignInPress = async () => {
        await handleGoogleSignIn(alertUtils);
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
                        style={[authStyles.input, fieldErrors.email && authStyles.inputError]}
                        placeholder="Enter your email"
                        value={formState.email}
                        onChangeText={(text) => {
                            updateFormState({ email: text });
                            setError(null);
                            setFieldErrors(prev => ({ ...prev, email: '' }));
                        }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {fieldErrors.email && <Text style={authStyles.errorText}>{fieldErrors.email}</Text>}
                </View>

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>Password</Text>
                    <TextInput
                        style={[authStyles.input, fieldErrors.password && authStyles.inputError]}
                        placeholder="Enter your password"
                        value={formState.password}
                        onChangeText={(text) => {
                            updateFormState({ password: text });
                            setError(null);
                            setFieldErrors(prev => ({ ...prev, password: '' }));
                        }}
                        secureTextEntry
                    />
                    {fieldErrors.password && <Text style={authStyles.errorText}>{fieldErrors.password}</Text>}
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

                <TouchableOpacity style={authStyles.googleButton} onPress={handleGoogleSignInPress}>
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


