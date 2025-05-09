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
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type RegisterFormNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

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
    const navigation = useNavigation<RegisterFormNavigationProp>();
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

    React.useEffect(() => {
        updateFormState(initialFormState);
    }, []);

    const handleSubmit = async () => {
        const validationResult = validateRegisterFields(formState);

        if (!validationResult.isValid) {
            setFieldErrors(validationResult.errors);
            return;
        }

        try {
            updateFormState({ isLoading: true, error: null });
            const response = await handleRegister();

            if (response) {
                Alert.alert(
                    'Registration Successful',
                    'Your account has been created successfully. You can now log in with your credentials.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                updateFormState(initialFormState);
                                navigation.navigate('Login');
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
            setError(errorMessage);
            Alert.alert('Registration Failed', errorMessage);
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
                <Text style={[authStyles.title, { marginBottom: 24, textAlign: 'left' }]}>Create Account</Text>
                {error && <Text style={authStyles.error}>{error}</Text>}

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
