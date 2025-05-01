import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, ActivityIndicator, Platform, Image, ScrollView, KeyboardAvoidingView, Modal, Pressable } from 'react-native';
import { useRegister } from '../hooks/useRegister';
import { useRouter } from 'expo-router';
import { authStyles } from '../styles/authStyles';
import { handleAlert } from '../utils/alertUtils';
import { countryCodes } from '../utils/countries';
import { ProfileImagePicker } from './ProfileImagePicker';
import CountryPicker from './CountryPicker';
import RegisterInputFields from './RegisterInputFields';
import DialogModal from './DialogModal';
import { validateRegisterFields } from '../utils/formValidation';
import { handleGoogleSignIn } from '../utils/googleSignIn';

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
    } = useRegister();
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // Add dialog state
    const [dialogMessage, setDialogMessage] = useState<{ title: string; message: string }>({ title: '', message: '' });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogCallback, setDialogCallback] = useState<(() => void) | null>(null);

    const alertUtils = {
        setDialogMessage,
        setDialogVisible,
        setDialogCallback
    };

    React.useEffect(() => {
        updateFormState(initialFormState);
    }, []);


    const handleSubmit = async () => {
        console.log('Register form submitted');
        const validationResult = validateRegisterFields(formState);

        if (!validationResult.isValid) {
            console.log('Form validation failed:', validationResult.errors);
            setFieldErrors(validationResult.errors);
            return;
        }

        try {
            console.log('Starting registration process');
            updateFormState({ isLoading: true, error: null });
            const response = await handleRegister();
            console.log('Registration response received:', response);

            if (response) {
                console.log('Registration successful, showing alert');
                handleAlert(
                    'Registration Successful',
                    'Your account has been created successfully. You can now log in with your credentials.',
                    () => {
                        // Clear the form
                        updateFormState(initialFormState);
                        // Navigate to login
                        router.replace('/(auth)/login');
                    },
                    alertUtils
                );
            }
        } catch (error) {
            console.error('Registration error in form:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
            setError(errorMessage);
            handleAlert('Registration Failed', errorMessage, null, alertUtils);
        } finally {
            updateFormState({ isLoading: false });
        }
    };

    const handleGoogleSignInPress = async () => {
        await handleGoogleSignIn(alertUtils);
    };

    const handleNavigateToLogin = () => {
        try {
            router.push('/(auth)/login');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={authStyles.container}
        >
            <DialogModal
                visible={dialogVisible}
                message={dialogMessage}
                onClose={() => setDialogVisible(false)}
            />

            <ScrollView
                contentContainerStyle={authStyles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={authStyles.formContainer}>
                    <Text style={authStyles.title}>Create Account</Text>
                    {error ? <Text style={authStyles.error}>{error}</Text> : null}

                    <ProfileImagePicker
                        profileImage={profileImage}
                        setProfileImage={setProfileImage}
                        updateFormState={updateFormState}
                    />

                    <RegisterInputFields
                        formState={formState}
                        updateFormState={updateFormState}
                        fieldErrors={fieldErrors}
                        setFieldErrors={setFieldErrors}
                    />

                    <View style={authStyles.inputContainer}>
                        <Text style={authStyles.label}>Phone Number</Text>
                        <View style={authStyles.phoneInputContainer}>
                            <CountryPicker
                                selectedCountry={selectedCountry}
                                setSelectedCountry={setSelectedCountry}
                                updateFormState={updateFormState}
                            />
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

                    <TouchableOpacity style={authStyles.googleButton} onPress={handleGoogleSignInPress}>
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
