import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { welcomeStyles } from '../../styles/welcome.styles';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type GetConnectedContentProps = {
    showProfileSection?: boolean;
    userData?: {
        firstName: string;
        lastName: string;
    };
};

export const GetConnectedContent = ({ showProfileSection, userData }: GetConnectedContentProps) => {
    const { colors } = useTheme();

    const handleSubscribe = () => {
        Linking.openURL('https://egliselacite.us15.list-manage.com/subscribe?u=b7c8a90c7c939a0dbcc276d14&id=03e223e5ce');
    };

    const handleVolunteer = () => {
        Linking.openURL('https://www.egliselacite.com/about-1-1');
    };

    const handlePrayerRequest = () => {
        Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSfWI6SAJJI3CCqc1Fb3coe-fQoFPdUdmvbSPuMWLU5y3A7_Vw/viewform');
    };

    const handleChezNous = () => {
        Linking.openURL('https://www.egliselacite.com/chez-nous-enquiry');
    };

    const handleChezNousDetails = () => {
        Linking.openURL('https://www.egliselacite.com/chez-nous');
    };

    return (
        <ScrollView
            contentContainerStyle={welcomeStyles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                <Text style={[welcomeStyles.title, { color: colors.text }]}>
                    Connect with us
                </Text>
                <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                    Whether you are a member, a regular visitor or you are just checking in, sign up to our mail list and stay connected with what is happening at La Cité!
                </Text>
            </View>

            <View style={welcomeStyles.featuresContainer}>
                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="mail" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Stay Updated</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        Join our mailing list to receive updates about our services, events, and community news.
                    </Text>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleSubscribe}
                    >
                        <Ionicons name="paper-plane" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>
                            Subscribe Now
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="people" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Get Involved</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        Want to get involved in the church, connect with others, and serve God with us? Volunteer with one of our teams!
                    </Text>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleVolunteer}
                    >
                        <Ionicons name="hand-left" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>
                            Volunteer Now
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="home" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Join A Chez Nous</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        Just as the early church met in homes, our Chez Nous are small groups of usually around 4-12 people that meet 2 or 3 times a month in homes in different parts of Paris.{'\n\n'}
                        These groups enjoy a time of fellowship over a meal, opening the Word of God and praying together.{'\n\n'}
                        As Jesus being the center of these groups, our Chez Nous allow us to grow together in our faith, to have a sense of belonging and to care for one another.
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, { flex: 1, marginRight: 5 }]}
                            onPress={handleChezNous}
                        >
                            <Ionicons name="add-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.actionButtonText}>
                                Join a Group
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { flex: 1, marginLeft: 5 }]}
                            onPress={handleChezNousDetails}
                        >
                            <Ionicons name="information-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                            <Text style={styles.actionButtonText}>
                                View Details
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="heart" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Prayer Support</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        Do you need prayer or pastoral help? We're here to support you in your journey of faith.
                    </Text>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handlePrayerRequest}
                    >
                        <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>
                            Submit Prayer Request
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    actionButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
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
});