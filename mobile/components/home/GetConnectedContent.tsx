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
        Linking.openURL('https://egliselacite.us15.list-manage.com/subscribe?u=b7c8a90c7c939a0dbcc276d14&id=03e223e5ce');
    };

    const handleVolunteer = () => {
        Linking.openURL('https://www.egliselacite.com/about-1-1');
    };

    const handlePrayerRequest = () => {
        Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSfWI6SAJJI3CCqc1Fb3coe-fQoFPdUdmvbSPuMWLU5y3A7_Vw/viewform');
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
                        Join our mailing list to receive updates about our services, events, and community news.
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
                        Want to get involved in the church, connect with others, and serve God with us?  Volunteer with one of our teams!
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
                    <Text style={welcomeStyles.featureTitle}>Prayer Request</Text>
                    <Text style={welcomeStyles.featureText}>
                        Do you need prayer or pastoral help?


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
        </ScrollView>
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
    locationButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 15,
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