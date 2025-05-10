import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Linking } from 'react-native';
import { welcomeStyles } from '../../styles/welcome.styles';
import { useTheme } from '../../hooks/useTheme';

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
        Linking.openURL('https://egliselacite.us15.list-manage.com/subscribe?   u=b7c8a90c7c939a0dbcc276d14&id=03e223e5ce');
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
        // Using Google Maps URL with the church's location coordinates
        Linking.openURL('https://www.egliselacite.com/chez-nous');
    };

    return (
        <ScrollView
            contentContainerStyle={welcomeStyles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {showProfileSection && userData ? (
                <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                    <Text style={[welcomeStyles.title, { color: colors.text }]}>
                        Connect with us
                    </Text>
                    <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                        Whether you are a member, a regular visitor or you are just checking in, sign up to our mail list and stay connected with what is happening at La Cité!
                    </Text>
                </View>
            ) : (
                <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                    <Text style={[welcomeStyles.title, { color: colors.text }]}>
                        Connect with us
                    </Text>
                    <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                        Whether you are a member, a regular visitor or you are just checking in, sign up to our mail list and stay connected with what is happening at La Cité!
                    </Text>
                </View>
            )}

            <View style={welcomeStyles.featuresContainer}>
                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Subscribe to Our Newsletter</Text>
                    <Text style={welcomeStyles.featureText}>
                        Join our mailing list to receive updates about our services, events, and community news. {'\n\n'}
                    </Text>
                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={handleSubscribe}
                    >
                        <Text style={styles.locationButtonText}>
                            Subscribe Now
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Become a volunteer at La Cité</Text>
                    <Text style={welcomeStyles.featureText}>
                        Want to get involved in the church, connect with others, and serve God with us?  Volunteer with one of our teams! {'\n\n'}
                    </Text>
                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={handleVolunteer}
                    >
                        <Text style={styles.locationButtonText}>
                            Volunteer Now
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Join A Chez Nous</Text>
                    <Text style={welcomeStyles.featureText}>
                        Just as the early church met in homes, our Chez Nous are small groups of usually around 4-12 people that meet 2 or 3 times a month in homes in different parts of Paris.{'\n\n'}
                        These groups enjoy a time of fellowship over a meal, opening the Word of God and praying together.{'\n\n'}
                        As Jesus being the center of these groups, our Chez Nous allow us to grow together in our faith, to have a sense of belonging and to care for one another.{'\n\n'}
                        Want to join a Chez Nous?
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.locationButton, { flex: 1, marginRight: 5 }]}
                            onPress={handleChezNous}
                        >
                            <Text style={styles.locationButtonText}>
                                Join a Chez Nous
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.locationButton, { flex: 1, marginLeft: 5 }]}
                            onPress={handleChezNousDetails}
                        >
                            <Text style={styles.locationButtonText}>
                                View Details
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <Text style={welcomeStyles.featureTitle}>Prayer Request</Text>
                    <Text style={welcomeStyles.featureText}>
                        Do you need prayer or pastoral help?{'\n\n'}
                    </Text>
                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={handlePrayerRequest}
                    >
                        <Text style={styles.locationButtonText}>
                            Submit Prayer Request
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    teamContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 15,
    },
    teamMember: {
        width: (width - 60) / 2,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    teamImage: {
        width: (width - 80) / 2,
        height: (width - 80) / 2,
        borderRadius: 10,
        marginBottom: 8,
    },
    teamName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        textAlign: 'center',
        marginBottom: 4,
    },
    teamRole: {
        fontSize: 12,
        color: '#7F8C8D',
        textAlign: 'center',
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    locationButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'center',
    },
    locationButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    downloadButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 15,
        alignSelf: 'center',
    },
    downloadButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    link: {
        color: '#FF9843',
        textDecorationLine: 'underline',
    },
});