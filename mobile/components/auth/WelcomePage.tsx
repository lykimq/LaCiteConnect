import React from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Platform, Linking } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { welcomeStyles } from '../../styles/welcome.styles';

type WelcomePageProps = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const WelcomePage = ({ navigation }: WelcomePageProps) => {
    const handleFindUs = () => {
        Linking.openURL('https://maps.google.com/?q=24+Rue+Antoine-Julien+Hénard+75012+Paris');
    };

    return (
        <SafeAreaView style={welcomeStyles.safeArea}>
            <ScrollView
                style={welcomeStyles.container}
                contentContainerStyle={welcomeStyles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={welcomeStyles.header}>
                    <Image
                        source={require('../../assets/church-logo.png')}
                        style={welcomeStyles.logo}
                        resizeMode="contain"
                    />
                    <Text style={welcomeStyles.title}>La Cité Connect</Text>
                    <Text style={welcomeStyles.subtitle}>To know Jesus and make Him known in Paris</Text>
                </View>

                <View style={welcomeStyles.featuresContainer}>
                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Join Us</Text>
                        <Text style={welcomeStyles.featureText}>
                            Every Sunday at 10:30 AM{'\n'}
                            Bilingual Service (English & French)
                        </Text>
                        <TouchableOpacity
                            style={welcomeStyles.locationButton}
                            onPress={handleFindUs}
                        >
                            <Text style={welcomeStyles.locationButtonText}>
                                24 Rue Antoine-Julien Hénard{'\n'}
                                75012, Paris
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Our Sundays</Text>
                        <Text style={welcomeStyles.featureText}>
                            We gather every Sunday morning for worship, teaching, and fellowship. Join us in person or online for a time of spiritual growth and community.
                        </Text>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Chez Nous</Text>
                        <Text style={welcomeStyles.featureText}>
                            Our small groups meet throughout the week in different locations across Paris. Connect with others and grow in your faith journey.
                        </Text>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <Text style={welcomeStyles.featureTitle}>Ensemble</Text>
                        <Text style={welcomeStyles.featureText}>
                            Join our monthly prayer meeting on the fourth Thursday at 19:45. Prayer is a core value of our church community.
                        </Text>
                    </View>
                </View>

                <View style={welcomeStyles.actionContainer}>
                    <TouchableOpacity
                        style={welcomeStyles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={welcomeStyles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={welcomeStyles.registerButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={welcomeStyles.registerButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={welcomeStyles.exploreButton}
                        onPress={() => {
                            // Reset the navigation state to GuestTabs
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'GuestTabs' }],
                            });
                        }}
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