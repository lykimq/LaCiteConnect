import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { authStyles } from '../styles/auth.styles';
import { authService } from '../services/authService';

type RegisterFormProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const handleRegister = async () => {
        if (!email || !password || !firstName || !lastName) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            const response = await authService.register({
                email: email.trim(),
                password,
                firstName,
                lastName,
            });

            console.log('Registration successful:', response);
            Alert.alert('Success', 'Registration successful! Please log in.');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={authStyles.container}>
            <View style={authStyles.formContainer}>
                <Text style={authStyles.title}>Create Account</Text>

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>First Name</Text>
                    <TextInput
                        style={[authStyles.input, fieldErrors.firstName && authStyles.inputError]}
                        placeholder="Enter your first name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    {fieldErrors.firstName && <Text style={authStyles.errorText}>{fieldErrors.firstName}</Text>}
                </View>

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>Last Name</Text>
                    <TextInput
                        style={[authStyles.input, fieldErrors.lastName && authStyles.inputError]}
                        placeholder="Enter your last name"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                    {fieldErrors.lastName && <Text style={authStyles.errorText}>{fieldErrors.lastName}</Text>}
                </View>

                <View style={authStyles.inputContainer}>
                    <Text style={authStyles.label}>Email</Text>
                    <TextInput
                        style={[authStyles.input, fieldErrors.email && authStyles.inputError]}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
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
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    {fieldErrors.password && <Text style={authStyles.errorText}>{fieldErrors.password}</Text>}
                </View>

                <TouchableOpacity
                    style={[authStyles.button, isLoading && authStyles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={authStyles.buttonText}>Register</Text>
                    )}
                </TouchableOpacity>

                <View style={authStyles.signUpContainer}>
                    <Text style={authStyles.signUpText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={authStyles.signUpLink}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};