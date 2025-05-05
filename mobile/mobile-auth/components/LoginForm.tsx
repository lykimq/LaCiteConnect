import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { loginStyles } from '../styles/login.styles';
import { useLogin } from '../hooks/useLogin';

type LoginFormProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginForm = ({ navigation }: LoginFormProps) => {
    const {
        loginState,
        setEmail,
        setPassword,
        handleLogin,
        resetError,
    } = useLogin();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={loginStyles.container}
        >
            <View style={loginStyles.formContainer}>
                <TouchableOpacity
                    style={loginStyles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={loginStyles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <Text style={loginStyles.title}>Welcome Back</Text>

                <TextInput
                    style={loginStyles.input}
                    placeholder="Email"
                    value={loginState.email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!loginState.isLoading}
                />

                <TextInput
                    style={loginStyles.input}
                    placeholder="Password"
                    value={loginState.password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    editable={!loginState.isLoading}
                />

                {loginState.error && (
                    <Text style={[loginStyles.errorText, { color: 'red', marginBottom: 10 }]}>
                        {loginState.error}
                    </Text>
                )}

                <TouchableOpacity
                    style={loginStyles.loginButton}
                    onPress={handleLogin}
                    disabled={loginState.isLoading}
                >
                    {loginState.isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={loginStyles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={loginStyles.forgotPassword}>
                    <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};