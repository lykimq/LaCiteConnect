import { authStyles } from '../../styles/auth.styles';
import { TextInput, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { RegisterFormState } from '../../types/auth.types';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    showEyeIcon?: boolean;
    onToggleSecureEntry?: () => void;
    isPasswordVisible?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'none',
    showEyeIcon = false,
    onToggleSecureEntry,
    isPasswordVisible,
}) => (
    <View style={authStyles.inputContainer}>
        <Text style={authStyles.label}>{label}</Text>
        <View style={authStyles.passwordContainer}>
            <TextInput
                style={[authStyles.input, error && authStyles.inputError, { flex: 1 }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry && !isPasswordVisible}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
            />
            {showEyeIcon && (
                <TouchableOpacity
                    style={authStyles.eyeIcon}
                    onPress={onToggleSecureEntry}
                >
                    <Text>{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
            )}
        </View>
        {error ? <Text style={authStyles.errorText}>{error}</Text> : null}
    </View>
);

interface RegisterInputFieldsProps {
    formState: RegisterFormState;
    updateFormState: (updates: Partial<RegisterFormState>) => void;
    fieldErrors: Record<string, string>;
    setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const RegisterInputFields: React.FC<RegisterInputFieldsProps> = ({
    formState,
    updateFormState,
    fieldErrors,
    setFieldErrors,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <>
            <InputField
                label="First Name *"
                value={formState.firstName}
                onChangeText={(text: string) => {
                    updateFormState({ firstName: text });
                    setFieldErrors((prev) => ({ ...prev, firstName: '' }));
                }}
                error={fieldErrors.firstName}
                placeholder="Enter your first name"
                autoCapitalize="words"
            />

            <InputField
                label="Last Name *"
                value={formState.lastName}
                onChangeText={(text: string) => {
                    updateFormState({ lastName: text });
                    setFieldErrors((prev) => ({ ...prev, lastName: '' }));
                }}
                error={fieldErrors.lastName}
                placeholder="Enter your last name"
                autoCapitalize="words"
            />

            <InputField
                label="Email *"
                value={formState.email}
                onChangeText={(text: string) => {
                    updateFormState({ email: text });
                    setFieldErrors((prev) => ({ ...prev, email: '' }));
                }}
                error={fieldErrors.email}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter your email"
            />

            <InputField
                label="Password *"
                value={formState.password}
                onChangeText={(text: string) => {
                    updateFormState({ password: text });
                    setFieldErrors((prev) => ({ ...prev, password: '' }));
                }}
                error={fieldErrors.password}
                secureTextEntry={true}
                placeholder="Enter your password"
                showEyeIcon={true}
                onToggleSecureEntry={() => setShowPassword((prev) => !prev)}
                isPasswordVisible={showPassword}
            />

            <InputField
                label="Confirm Password *"
                value={formState.confirmPassword}
                onChangeText={(text: string) => {
                    updateFormState({ confirmPassword: text });
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                error={fieldErrors.confirmPassword}
                secureTextEntry={true}
                placeholder="Confirm your password"
                showEyeIcon={true}
                onToggleSecureEntry={() => setShowConfirmPassword((prev) => !prev)}
                isPasswordVisible={showConfirmPassword}
            />
        </>
    );
};

export default RegisterInputFields;