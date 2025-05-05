import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, ActivityIndicator, Image, Alert } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authStyles } from '../styles/auth.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateLoginFields } from '../utils/formValidation';
import { authService } from '../services/authService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type LoginFormProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginForm: React.FC<LoginFormProps> = ({ navigation }) => {
    const { formState, updateFormState, login } = useLogin();
    const [error, setError] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsTestingConnection(true);
            console.log('Testing connection before login...');
            const isConnected = await authService.testConnection();

            if (!isConnected) {
                Alert.alert(
                    'Connection Error',
                    'Unable to connect to the server. Please check your internet connection and try again.'
                );
                return;
            }

            console.log('Connection test successful, proceeding with login...');
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
            setIsTestingConnection(false);
            updateFormState({ isLoading: false });
        }
    };

    const handleNavigateToRegister = () => {
        navigation.navigate('Register');
    };

    const handleForgotPassword = () => {
        // Implement forgot password logic here
        console.log('Forgot password');
    };

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
                    <View style={authStyles.passwordContainer}>
                        <TextInput
                            style={[authStyles.input, fieldErrors.password && authStyles.inputError, { flex: 1 }]}
                            placeholder="Enter your password"
                            value={formState.password}
                            onChangeText={(text) => {
                                updateFormState({ password: text });
                                setError(null);
                                setFieldErrors(prev => ({ ...prev, password: '' }));
                            }}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            style={authStyles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                        </TouchableOpacity>
                    </View>
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
                    disabled={formState.isLoading || isTestingConnection}
                >
                    {(formState.isLoading || isTestingConnection) ? (
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

                <TouchableOpacity style={authStyles.googleButton}>
                    <Image
                        source={require('../assets/icons8-google-30.png')}
                        style={authStyles.googleIcon}
                    />
                    <Text style={authStyles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <View style={authStyles.signUpContainer}>
                    <Text style={authStyles.signUpText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={handleNavigateToRegister}>
                        <Text style={authStyles.signUpLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};


