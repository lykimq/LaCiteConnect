import { Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { welcomeStyles } from '../styles/welcome.styles';

type WelcomePageProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export const WelcomePage = ({ navigation }: WelcomePageProps) => {
    return (
        <SafeAreaView style={welcomeStyles.safeArea}>
            <ScrollView style={welcomeStyles.container} contentContainerStyle={welcomeStyles.scrollContent}>
                <View style={welcomeStyles.header}>
                    <Image
                        source={require('../assets/church-logo.png')}
                        style={welcomeStyles.logo}
                        resizeMode="contain"
                    />
                    <Text style={welcomeStyles.title}>La Cité Connect</Text>
                    <Text style={welcomeStyles.subtitle}>Your Digital Church Community</Text>
                </View>

                <View style={welcomeStyles.featuresContainer}>
                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Stay Connected</Text>
                        <Text style={welcomeStyles.featureText}>
                            Join our community and stay updated with church events, services, and activities.
                        </Text>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Grow Together</Text>
                        <Text style={welcomeStyles.featureText}>
                            Access sermons, Bible studies, and prayer groups to strengthen your faith journey.
                        </Text>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Serve & Share</Text>
                        <Text style={welcomeStyles.featureText}>
                            Participate in community service and share your blessings with others.
                        </Text>
                    </View>
                </View>

                <View style={welcomeStyles.actionContainer}>
                    <TouchableOpacity
                        style={[welcomeStyles.loginButton, { backgroundColor: '#3498DB' }]}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={welcomeStyles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={welcomeStyles.registerButton}
                        onPress={() => { navigation.navigate('Register') }}
                    >
                        <Text style={welcomeStyles.registerButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={welcomeStyles.exploreButton}
                        onPress={() => {/* TODO: Handle guest mode */ }}
                    >
                        <Text style={welcomeStyles.exploreButtonText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.footer}>
                    <Text style={welcomeStyles.footerText}>
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};