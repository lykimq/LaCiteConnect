import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator, Platform, Dimensions, Image } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useRouter } from 'expo-router';
import { authStyles } from '../styles/authStyles';

const LoginForm = () => {
    const router = useRouter();
    const { formState, updateFormState, login } = useLogin();
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState(formState.email);
    const [password, setPassword] = useState(formState.password);
    const [error, setError] = useState(formState.error);

    const handleSubmit = async () => {
        try {
            const credentials = {
                email: email,
                password: password
            };
            await login(credentials);
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred. Please try again later.');
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
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>Password</Text>
                    <TextInput
                        style={authStyles.input}
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <View style={authStyles.optionsContainer}>
                    <TouchableOpacity
                        style={authStyles.rememberMeContainer}
                        onPress={() => setRememberMe(!rememberMe)}
                    >
                        <View style={[authStyles.checkbox, rememberMe && authStyles.checkboxChecked]}>
                            {rememberMe && <View style={authStyles.checkboxInner} />}
                        </View>
                        <Text style={authStyles.rememberMeText}>Remember me</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={authStyles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={authStyles.button} onPress={handleSubmit}>
                    <Text style={authStyles.buttonText}>Login</Text>
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
                        tintColor="#FFFFFF"
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

LoginForm.displayName = 'LoginForm';

export { LoginForm };


