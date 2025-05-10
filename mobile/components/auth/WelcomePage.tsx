import React from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, Platform, Linking, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { welcomeStyles } from '../../styles/welcome.styles';
import { Ionicons } from '@expo/vector-icons';

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
                        <View style={styles.cardHeader}>
                            <Ionicons name="location" size={24} color="#FF9843" style={styles.cardIcon} />
                            <Text style={welcomeStyles.featureTitle}>Join Us</Text>
                        </View>
                        <Text style={welcomeStyles.featureText}>
                            Every Sunday at 10:30 AM{'\n'}
                            Bilingual Service (English & French)
                        </Text>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={handleFindUs}
                        >
                            <Ionicons name="map" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.actionButtonText}>
                                24 Rue Antoine-Julien Hénard{'\n'}
                                75012, Paris
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="calendar" size={24} color="#FF9843" style={styles.cardIcon} />
                            <Text style={welcomeStyles.featureTitle}>Our Sundays</Text>
                        </View>
                        <Text style={welcomeStyles.featureText}>
                            We gather every Sunday morning for worship, teaching, and fellowship. Join us in person or online for a time of spiritual growth and community.
                        </Text>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="people" size={24} color="#FF9843" style={styles.cardIcon} />
                            <Text style={welcomeStyles.featureTitle}>Chez Nous</Text>
                        </View>
                        <Text style={welcomeStyles.featureText}>
                            Our small groups meet throughout the week in different locations across Paris. Connect with others and grow in your faith journey.
                        </Text>
                    </View>

                    <View style={welcomeStyles.featureCard}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="heart" size={24} color="#FF9843" style={styles.cardIcon} />
                            <Text style={welcomeStyles.featureTitle}>Ensemble</Text>
                        </View>
                        <Text style={welcomeStyles.featureText}>
                            Join our monthly prayer meeting on the fourth Thursday at 19:45. Prayer is a core value of our church community.
                        </Text>
                    </View>
                </View>

                <View style={welcomeStyles.actionContainer}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Ionicons name="log-in" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.registerButton}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Ionicons name="person-add" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.registerButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'GuestTabs' }],
                            });
                        }}
                    >
                        <Ionicons name="compass" size={20} color="#FF9843" style={styles.buttonIcon} />
                        <Text style={styles.exploreButtonText}>Continue as Guest</Text>
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

const styles = StyleSheet.create({
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardIcon: {
        marginRight: 10,
    },
    actionButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonIcon: {
        marginRight: 8,
    },
    loginButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: '#2C3E50',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    exploreButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FF9843',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    exploreButtonText: {
        color: '#FF9843',
        fontSize: 16,
        fontWeight: '600',
    },
});