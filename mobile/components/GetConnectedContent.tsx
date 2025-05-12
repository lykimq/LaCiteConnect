import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { getConnectedStyles } from '../styles/GetConnectedContent.styles';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS } from '../config/staticData';

export const GetConnectedContent = () => {
    const handleSubscribe = () => {
        Linking.openURL(STATIC_URLS.subscribe);
    };

    const handleVolunteer = () => {
        Linking.openURL(STATIC_URLS.volunteer);
    };

    const handlePrayerRequest = () => {
        Linking.openURL(STATIC_URLS.prayerRequest);
    };

    const handleChezNous = () => {
        Linking.openURL(STATIC_URLS.chezNous);
    };

    const handleChezNousDetails = () => {
        Linking.openURL(STATIC_URLS.chezNousDetails);
    };

    const handleSocialMedia = (url: string) => {
        Linking.openURL(url);
    };

    const handleEmail = () => {
        Linking.openURL('mailto:salut@egliselacite.com');
    };

    return (
        <View style={getConnectedStyles.container}>
            <ScrollView
                style={getConnectedStyles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={getConnectedStyles.header}>
                    <Text style={getConnectedStyles.title}>
                        Get Connected
                    </Text>
                    <Text style={getConnectedStyles.subtitle}>
                        Join us in fellowship and service
                    </Text>
                </View>

                <View style={getConnectedStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="mail" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={getConnectedStyles.sectionTitle}>Stay Updated</Text>
                    </View>
                    <Text style={getConnectedStyles.paragraph}>
                        Join our mailing list to receive updates about our services, events, and community news.
                    </Text>
                    <TouchableOpacity
                        style={getConnectedStyles.contactButton}
                        onPress={handleSubscribe}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="paper-plane" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={getConnectedStyles.buttonText}>
                                Subscribe Now
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={getConnectedStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="share-social" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={getConnectedStyles.sectionTitle}>Connect On Social Media</Text>
                    </View>
                    <Text style={getConnectedStyles.paragraph}>
                        Follow us on social media to stay connected with La Cité community and see regular updates.
                    </Text>

                    <TouchableOpacity
                        style={getConnectedStyles.contactButton}
                        onPress={handleEmail}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="mail-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={getConnectedStyles.buttonText}>
                                salut@egliselacite.com
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ marginTop: 10 }} />

                    <TouchableOpacity
                        style={getConnectedStyles.contactButton}
                        onPress={() => handleSocialMedia('https://www.instagram.com/laciteparis/')}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="logo-instagram" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={getConnectedStyles.buttonText}>
                                @laciteparis
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ marginTop: 10 }} />

                    <TouchableOpacity
                        style={getConnectedStyles.contactButton}
                        onPress={() => handleSocialMedia('https://www.facebook.com/laciteparis/')}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="logo-facebook" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={getConnectedStyles.buttonText}>
                                La Cité Paris
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ marginTop: 10 }} />

                    <TouchableOpacity
                        style={getConnectedStyles.contactButton}
                        onPress={() => handleSocialMedia('https://www.youtube.com/channel/UC-0imDK8zeP8lEBTEjiCx2A')}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="logo-youtube" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={getConnectedStyles.buttonText}>
                                Eglise La Cité
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ marginTop: 10 }} />

                    <TouchableOpacity
                        style={getConnectedStyles.contactButton}
                        onPress={() => handleSocialMedia('https://soundcloud.com/egliselacite/tracks')}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="cloud" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={getConnectedStyles.buttonText}>
                                Soundcloud
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={getConnectedStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="people" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={getConnectedStyles.sectionTitle}>Get Involved</Text>
                    </View>
                    <Text style={getConnectedStyles.paragraph}>
                        Want to get involved in the church, connect with others, and serve God with us? Volunteer with one of our teams!
                    </Text>
                    <TouchableOpacity
                        style={getConnectedStyles.contactButton}
                        onPress={handleVolunteer}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="hand-left" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={getConnectedStyles.buttonText}>
                                Volunteer Now
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={getConnectedStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="home" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={getConnectedStyles.sectionTitle}>Join A Chez Nous</Text>
                    </View>
                    <Text style={getConnectedStyles.paragraph}>
                        Just as the early church met in homes, our Chez Nous are small groups of usually around 4-12 people that meet 2 or 3 times a month in homes in different parts of Paris.{'\n\n'}
                        These groups enjoy a time of fellowship over a meal, opening the Word of God and praying together.{'\n\n'}
                        As Jesus being the center of these groups, our Chez Nous allow us to grow together in our faith, to have a sense of belonging and to care for one another.
                    </Text>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                        <TouchableOpacity
                            style={[getConnectedStyles.contactButton, { flex: 1, marginRight: 5 }]}
                            onPress={handleChezNous}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="add-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={getConnectedStyles.buttonText}>
                                    Join a Group
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[getConnectedStyles.contactButton, { flex: 1, marginLeft: 5 }]}
                            onPress={handleChezNousDetails}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="information-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={getConnectedStyles.buttonText}>
                                    View Details
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={getConnectedStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="heart" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={getConnectedStyles.sectionTitle}>Prayer Support</Text>
                    </View>
                    <Text style={getConnectedStyles.paragraph}>
                        Do you need prayer or pastoral help? We're here to support you in your journey of faith.
                    </Text>
                    <TouchableOpacity
                        style={getConnectedStyles.contactButton}
                        onPress={handlePrayerRequest}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={getConnectedStyles.buttonText}>
                                Submit Prayer Request
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};