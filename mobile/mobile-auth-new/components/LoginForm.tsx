import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, ActivityIndicator, Platform, Dimensions, Image } from 'react-native';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
    const { formState, updateFormState, login } = useLogin();

    const handleSubmit = async () => {
        try {
            const credentials = {
                email: formState.email,
                password: formState.password
            };
            await login(credentials);
            // Handle successful login (e.g., navigation)
        } catch (error) {
            // Error is already handled in the hook
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

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Sign In</Text>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleSignIn}
                >
                    <Image
                        source={require('../assets/icons8-google-30.png')}
                        style={styles.googleIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.googleButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={formState.email}
                        onChangeText={(text) => updateFormState({ email: text })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        value={formState.password}
                        onChangeText={(text) => updateFormState({ password: text })}
                        secureTextEntry
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.optionsContainer}>
                    <View style={styles.rememberMeContainer}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => updateFormState({ rememberMe: !formState.rememberMe })}
                        >
                            <View style={[styles.checkboxInner, formState.rememberMe && styles.checkboxChecked]} />
                        </TouchableOpacity>
                        <Text style={styles.rememberMeText}>Remember me</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>

                {formState.error && <Text style={styles.error}>{formState.error}</Text>}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={formState.isLoading}
                >
                    {formState.isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>SIGN IN</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Not registered yet? </Text>
                    <TouchableOpacity>
                        <Text style={styles.signUpLink}>Sign Up</Text>
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
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#666',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    checkboxChecked: {
        backgroundColor: '#FF9843',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#666',
    },
    forgotPassword: {
        fontSize: 14,
        color: '#FF9843',
        textDecorationLine: 'underline',
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


