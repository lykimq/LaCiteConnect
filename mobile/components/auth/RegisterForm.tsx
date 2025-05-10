import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, ActivityIndicator, Platform, Image, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { useRegister } from '../../hooks/useRegister';
import { useNavigation } from '@react-navigation/native';
import { authStyles } from '../../styles/auth.styles';
import { countryCodes } from '../../utils/countries';
import { ProfileImagePicker } from './ProfileImagePicker';
import CountryPicker from './CountryPicker';
import RegisterInputFields from './RegisterInputFields';
import DialogModal from './DialogModal';
import { validateRegisterFields } from '../../utils/formValidation';
// @ts-ignore
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RegisterFormProps = {
    navigation: NativeStackScreenProps<RootStackParamList, 'Register'>['navigation'];
};

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

const RegisterForm: React.FC<RegisterFormProps> = ({ navigation }) => {
    const {
        formState,
        updateFormState,
        handleRegister,
    } = useRegister();
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [dialogMessage, setDialogMessage] = useState<{ title: string; message: string }>({ title: '', message: '' });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isUpdatingProfilePicture, setIsUpdatingProfilePicture] = useState(false);

    React.useEffect(() => {
        updateFormState(initialFormState);
    }, []);

    const handleSubmit = async () => {
        const validationResult = validateRegisterFields(formState);

        if (!validationResult.isValid) {
            setFieldErrors(validationResult.errors);
            return;
        }

        // Ensure profile picture is set in formState
        if (profileImage && !formState.profilePictureUrl) {
            updateFormState({ profilePictureUrl: profileImage });
        }

        try {
            updateFormState({ isLoading: true, error: null });
            const response = await handleRegister();

            if (response) {
                // If we have a profile image but the API didn't save it (happens with large images)
                if (profileImage && response.user && !response.user.profilePictureUrl) {
                    try {
                        setIsUpdatingProfilePicture(true);
                        console.log('Uploading profile picture separately...');
                        await authService.updateProfilePicture(profileImage);
                        console.log('Profile picture uploaded successfully');

                        // Update the stored user data with the new profile picture
                        const userData = await AsyncStorage.getItem('userData');
                        if (userData) {
                            const parsedUserData = JSON.parse(userData);
                            parsedUserData.profilePictureUrl = profileImage;
                            await AsyncStorage.setItem('userData', JSON.stringify(parsedUserData));
                        }
                    } catch (error) {
                        console.error('Failed to upload profile picture:', error);
                        setDialogMessage({
                            title: 'Profile Picture Update',
                            message: 'Your account was created successfully, but we couldn\'t upload your profile picture. You can update it later in your profile settings.'
                        });
                        setDialogVisible(true);
                    } finally {
                        setIsUpdatingProfilePicture(false);
                    }
                }

                // Navigate to MainTabs instead of WelcomeUser
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainTabs' }],
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'An error occurred during registration';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError(errorMessage);
        } finally {
            updateFormState({ isLoading: false });
        }
    };

    const handleGoogleSignInPress = async () => {
        console.log('Google sign in pressed');
    };

    const handleNavigateToLogin = () => {
        try {
            navigation.navigate('Login');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: '#fff' }}
        >
            <DialogModal
                visible={dialogVisible}
                message={dialogMessage}
                onClose={() => setDialogVisible(false)}
            />

            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 40,
                    paddingBottom: 32,
                    flexGrow: 1,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Text style={[authStyles.title, { marginBottom: 24, textAlign: 'center' }]}>Create Account</Text>
                {error && <Text style={authStyles.error}>{error}</Text>}

                <View style={{ alignItems: 'center', marginBottom: 24 }}>
                    <ProfileImagePicker
                        profileImage={profileImage}
                        setProfileImage={setProfileImage}
                        updateFormState={updateFormState}
                    />
                </View>

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
                    {fieldErrors.phoneNumber && (
                        <Text style={authStyles.error}>{fieldErrors.phoneNumber}</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={[authStyles.button, { width: '100%', marginTop: 8 }]}
                    onPress={handleSubmit}
                    disabled={formState.isLoading}
                >
                    {formState.isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={authStyles.buttonText}>Create Account</Text>
                    )}
                </TouchableOpacity>

                <View style={authStyles.dividerContainer}>
                    <View style={authStyles.dividerLine} />
                    <Text style={authStyles.dividerText}>or</Text>
                    <View style={authStyles.dividerLine} />
                </View>

                <TouchableOpacity style={[authStyles.googleButton, { width: '100%' }]} onPress={handleGoogleSignInPress}>
                    <Image
                        source={require('../../assets/icons8-google-30.png')}
                        style={[authStyles.googleIcon, { tintColor: '#FFFFFF' }]}
                    />
                    <Text style={authStyles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <View style={[authStyles.signUpContainer, { marginTop: 24 }]}>
                    <Text style={authStyles.signUpText}>Already have an account?</Text>
                    <TouchableOpacity onPress={handleNavigateToLogin}>
                        <Text style={authStyles.signUpLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterForm;
