import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator, Platform, Dimensions, Image, ScrollView, KeyboardAvoidingView, Modal, Pressable, Alert } from 'react-native';
import { useRegister } from '../hooks/useRegister';
import { useRouter } from 'expo-router';
import { authStyles } from '../styles/authStyles';
import * as ImagePicker from 'expo-image-picker';

// Common country codes with their flags and names
const countryCodes = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+86', name: 'China', flag: '🇨🇳' },
    { code: '+91', name: 'India', flag: '🇮🇳' },
    { code: '+61', name: 'Australia', flag: '🇦🇺' },
    { code: '+55', name: 'Brazil', flag: '🇧🇷' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
];

const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    phoneRegion: '+1',
    profilePictureUrl: '',
    isLoading: false,
    error: null
};

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const {
        formState,
        updateFormState,
        handleRegister,
        validateEmail,
        validatePassword,
        validateConfirmPassword,
    } = useRegister();
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    React.useEffect(() => {
        updateFormState(initialFormState);
    }, []);

    const validateFields = () => {
        const errors: Record<string, string> = {};

        if (!formState.firstName?.trim()) {
            errors.firstName = 'First name is required';
        }

        if (!formState.lastName?.trim()) {
            errors.lastName = 'Last name is required';
        }

        if (!formState.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formState.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formState.password?.trim()) {
            errors.password = 'Password is required';
        } else if (!validatePassword(formState.password)) {
            errors.password = 'Password must be at least 6 characters long';
        }

        if (!formState.confirmPassword?.trim()) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (!validateConfirmPassword(formState.password, formState.confirmPassword)) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        console.log('Register form submitted');
        if (!validateFields()) {
            console.log('Form validation failed');
            return;
        }

        try {
            console.log('Starting registration process');
            updateFormState({ isLoading: true, error: null });
            const response = await handleRegister();
            console.log('Registration response received:', response);

            if (response) {
                console.log('Registration successful, showing alert');
                Alert.alert(
                    'Registration Successful',
                    'Your account has been created successfully. You can now log in with your credentials.',
                    [
                        {
                            text: 'Go to Login',
                            onPress: () => {
                                // Clear the form
                                updateFormState(initialFormState);
                                // Navigate to login
                                router.replace('/(auth)/login');
                            }
                        }
                    ],
                    { cancelable: false }
                );
            }
        } catch (error) {
            console.error('Registration error in form:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
            setError(errorMessage);
            Alert.alert('Registration Failed', errorMessage);
        } finally {
            updateFormState({ isLoading: false });
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            setProfileImage(result.assets[0].uri);
            updateFormState({ profilePictureUrl: result.assets[0].uri });
        }
    };

    const handleGoogleSignIn = async () => {
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

    const handleCountrySelect = (country: typeof countryCodes[0]) => {
        setSelectedCountry(country);
        setShowCountryPicker(false);
        updateFormState({ phoneRegion: country.code });
    };

    const renderCountrySelector = () => {
        if (Platform.OS === 'web') {
            return (
                <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                        const country = countryCodes.find(c => c.code === e.target.value);
                        if (country) handleCountrySelect(country);
                    }}
                    style={{
                        height: '50px',
                        padding: '0 12px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        backgroundColor: '#f8f8f8',
                        marginRight: '8px',
                        fontSize: '16px',
                        color: '#333',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    {countryCodes.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.flag} {country.name} ({country.code})
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <>
                <TouchableOpacity
                    style={authStyles.countryCodeButton}
                    onPress={() => setShowCountryPicker(true)}
                >
                    <Text style={authStyles.countryCodeText}>
                        {selectedCountry.flag} {selectedCountry.code}
                    </Text>
                </TouchableOpacity>
                <Modal
                    visible={showCountryPicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowCountryPicker(false)}
                >
                    <Pressable
                        style={authStyles.modalOverlay}
                        onPress={() => setShowCountryPicker(false)}
                    >
                        <View style={authStyles.modalContent}>
                            <View style={authStyles.modalHeader}>
                                <Text style={authStyles.modalTitle}>Select Country</Text>
                                <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                                    <Text style={authStyles.modalClose}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView style={authStyles.countryList}>
                                {countryCodes.map((country) => (
                                    <Pressable
                                        key={country.code}
                                        style={({ pressed }) => [
                                            authStyles.countryItem,
                                            pressed && authStyles.countryItemPressed
                                        ]}
                                        onPress={() => handleCountrySelect(country)}
                                    >
                                        <Text style={authStyles.countryItemText}>
                                            {country.flag} {country.name} ({country.code})
                                        </Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        </View>
                    </Pressable>
                </Modal>
            </>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={authStyles.container}
        >
            <ScrollView
                contentContainerStyle={authStyles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={authStyles.formContainer}>
                    <Text style={authStyles.title}>Create Account</Text>
                    {error ? <Text style={authStyles.error}>{error}</Text> : null}

                    <View style={authStyles.profileImageContainer}>
                        <TouchableOpacity onPress={pickImage} style={authStyles.profileImageButton}>
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    style={authStyles.profileImage}
                                />
                            ) : (
                                <View style={authStyles.profileImagePlaceholder}>
                                    <Text style={authStyles.profileImagePlaceholderText}>
                                        Add Photo
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={authStyles.inputContainer}>
                        <Text style={authStyles.label}>First Name *</Text>
                        <TextInput
                            style={[
                                authStyles.input,
                                fieldErrors.firstName && authStyles.inputError
                            ]}
                            placeholder="Enter your first name"
                            value={formState.firstName || ''}
                            onChangeText={(text) => {
                                updateFormState({ firstName: text });
                                setFieldErrors(prev => ({ ...prev, firstName: '' }));
                            }}
                            autoCapitalize="words"
                        />
                        {fieldErrors.firstName ? (
                            <Text style={authStyles.errorText}>{fieldErrors.firstName}</Text>
                        ) : null}
                    </View>

                    <View style={authStyles.inputContainer}>
                        <Text style={authStyles.label}>Last Name *</Text>
                        <TextInput
                            style={[
                                authStyles.input,
                                fieldErrors.lastName && authStyles.inputError
                            ]}
                            placeholder="Enter your last name"
                            value={formState.lastName || ''}
                            onChangeText={(text) => {
                                updateFormState({ lastName: text });
                                setFieldErrors(prev => ({ ...prev, lastName: '' }));
                            }}
                            autoCapitalize="words"
                        />
                        {fieldErrors.lastName ? (
                            <Text style={authStyles.errorText}>{fieldErrors.lastName}</Text>
                        ) : null}
                    </View>

                    <View style={authStyles.inputContainer}>
                        <Text style={authStyles.label}>Email *</Text>
                        <TextInput
                            style={[
                                authStyles.input,
                                fieldErrors.email && authStyles.inputError
                            ]}
                            placeholder="Enter your email"
                            value={formState.email || ''}
                            onChangeText={(text) => {
                                updateFormState({ email: text });
                                setFieldErrors(prev => ({ ...prev, email: '' }));
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {fieldErrors.email ? (
                            <Text style={authStyles.errorText}>{fieldErrors.email}</Text>
                        ) : null}
                    </View>

                    <View style={authStyles.inputContainer}>
                        <Text style={authStyles.label}>Password *</Text>
                        <TextInput
                            style={[
                                authStyles.input,
                                fieldErrors.password && authStyles.inputError
                            ]}
                            placeholder="Enter your password"
                            value={formState.password || ''}
                            onChangeText={(text) => {
                                updateFormState({ password: text });
                                setFieldErrors(prev => ({ ...prev, password: '' }));
                            }}
                            secureTextEntry
                        />
                        {fieldErrors.password ? (
                            <Text style={authStyles.errorText}>{fieldErrors.password}</Text>
                        ) : null}
                    </View>

                    <View style={authStyles.inputContainer}>
                        <Text style={authStyles.label}>Confirm Password *</Text>
                        <TextInput
                            style={[
                                authStyles.input,
                                fieldErrors.confirmPassword && authStyles.inputError
                            ]}
                            placeholder="Confirm your password"
                            value={formState.confirmPassword || ''}
                            onChangeText={(text) => {
                                updateFormState({ confirmPassword: text });
                                setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                            }}
                            secureTextEntry
                        />
                        {fieldErrors.confirmPassword ? (
                            <Text style={authStyles.errorText}>{fieldErrors.confirmPassword}</Text>
                        ) : null}
                    </View>

                    <View style={authStyles.inputContainer}>
                        <Text style={authStyles.label}>Phone Number</Text>
                        <View style={authStyles.phoneInputContainer}>
                            {renderCountrySelector()}
                            <TextInput
                                style={[authStyles.input, authStyles.phoneInput]}
                                placeholder="Enter your phone number"
                                value={formState.phoneNumber || ''}
                                onChangeText={(text) => updateFormState({ phoneNumber: text })}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[authStyles.button, formState.isLoading && authStyles.buttonDisabled]}
                        onPress={handleSubmit}
                        disabled={formState.isLoading}
                    >
                        {formState.isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={authStyles.buttonText}>Register</Text>
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
                            style={[authStyles.googleIcon, { tintColor: '#FFFFFF' }]}
                        />
                        <Text style={authStyles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <View style={authStyles.signUpContainer}>
                        <Text style={authStyles.signUpText}>Already have an account?</Text>
                        <TouchableOpacity onPress={handleNavigateToLogin}>
                            <Text style={authStyles.signUpLink}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterForm;
