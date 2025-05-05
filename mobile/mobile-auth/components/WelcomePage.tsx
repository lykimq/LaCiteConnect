import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

type WelcomePageProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

export const WelcomePage = ({ navigation }: WelcomePageProps) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={require('../assets/church-logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>La Cité Connect</Text>
                    <Text style={styles.subtitle}>Your Digital Church Community</Text>
                </View>

                <View style={styles.featuresContainer}>
                    <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>Stay Connected</Text>
                        <Text style={styles.featureText}>
                            Join our community and stay updated with church events, services, and activities.
                        </Text>
                    </View>

                    <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>Grow Together</Text>
                        <Text style={styles.featureText}>
                            Access sermons, Bible studies, and prayer groups to strengthen your faith journey.
                        </Text>
                    </View>

                    <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>Serve & Share</Text>
                        <Text style={styles.featureText}>
                            Participate in community service and share your blessings with others.
                        </Text>
                    </View>
                </View>

                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <LinearGradient
                            colors={['#3498DB', '#2980B9']}
                            style={styles.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => {/* TODO: Navigate to Register */ }}
                    >
                        <Text style={styles.registerButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => {/* TODO: Handle guest mode */ }}
                    >
                        <Text style={styles.exploreButtonText}>Continue as Guest</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    logo: {
        width: width * 0.35,
        height: width * 0.35,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#7F8C8D',
        textAlign: 'center',
    },
    featuresContainer: {
        marginBottom: 40,
    },
    featureCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#6C757D',
        lineHeight: 20,
    },
    actionContainer: {
        marginBottom: 20,
    },
    loginButton: {
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 15,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    registerButton: {
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#3498DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    registerButtonText: {
        color: '#3498DB',
        fontSize: 18,
        fontWeight: '600',
    },
    exploreButton: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exploreButtonText: {
        color: '#6C757D',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        marginTop: 'auto',
        paddingVertical: 20,
    },
    footerText: {
        color: '#6C757D',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});