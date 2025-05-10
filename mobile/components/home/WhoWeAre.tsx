import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { welcomeStyles } from '../../styles/welcome.styles';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type HomeContentProps = {
    showProfileSection?: boolean;
    userData?: {
        firstName: string;
        lastName: string;
    };
};

export const WhoWeAreContent = ({ showProfileSection, userData }: HomeContentProps) => {
    const { colors } = useTheme();

    return (
        <ScrollView
            contentContainerStyle={welcomeStyles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={[welcomeStyles.header, { marginTop: 40 }]}>
                <Text style={[welcomeStyles.title, { color: colors.text }]}>
                    Who We Are
                </Text>
                <Text style={[welcomeStyles.subtitle, { color: colors.textSecondary }]}>
                    To know Jesus and make Him known in Paris
                </Text>
            </View>

            <View style={welcomeStyles.featuresContainer}>
                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="home" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Our Church</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        We are a Christian church based in Paris, in partnership with New Covenant Ministries International (
                        <Text
                            style={styles.link}
                            onPress={() => Linking.openURL('https://ncmi.net/')}
                        >
                            NCMI
                        </Text>
                        ). Our church is a community of Parisians from all over the world and of all ages, with a heart for Paris and for France.
                    </Text>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="eye" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Our Vision</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        To be a church that knows Jesus and makes Him known in Paris and from Paris for His glory.
                    </Text>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="book" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Our Story</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        In April 2009, Fred and Vanessa together with their two sons at the time; Daniel (6) and Joel (3), left Dubai and the church they had been serving as full-time elders in for over 5 years, after feeling called by God to plant a church in Paris. Soon after arriving, they started to hold church meetings in their lounge every Sunday. Little by little, the church put down roots and God has added to our number those who are now part of La Cité.
                    </Text>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="heart" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Our Heart</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        Our desire and passion is to see the Kingdom of God increasingly established here in Paris. To see His City (the church), His Ways and His Reign established. This includes seeing the captives set free, physical, emotional, and spiritual healing, people realizing their unique identity and calling, as well as many other things, on Earth, in Paris, as it is in Heaven.
                    </Text>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="people" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Our Culture</Text>
                    </View>
                    <View style={styles.cultureContainer}>
                        <View style={styles.cultureItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={styles.cultureIcon} />
                            <Text style={styles.cultureText}>Authenticity</Text>
                        </View>
                        <View style={styles.cultureItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={styles.cultureIcon} />
                            <Text style={styles.cultureText}>Family values</Text>
                        </View>
                        <View style={styles.cultureItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={styles.cultureIcon} />
                            <Text style={styles.cultureText}>Apostolic vision</Text>
                        </View>
                        <View style={styles.cultureItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={styles.cultureIcon} />
                            <Text style={styles.cultureText}>Humility</Text>
                        </View>
                        <View style={styles.cultureItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={styles.cultureIcon} />
                            <Text style={styles.cultureText}>Love</Text>
                        </View>
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="people-circle" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Our Eldership Team</Text>
                    </View>
                    <View style={styles.teamContainer}>
                        <View style={styles.teamMember}>
                            <Image
                                source={require('../../assets/team/fred-vanessa.png')}
                                style={styles.teamImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.teamName}>Fred and Vanessa</Text>
                            <Text style={styles.teamRole}>DALAIS</Text>
                        </View>
                        <View style={styles.teamMember}>
                            <Image
                                source={require('../../assets/team/nathanael-camille.png')}
                                style={styles.teamImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.teamName}>Nathanaël and Camille</Text>
                            <Text style={styles.teamRole}>WESTPHAL</Text>
                        </View>
                        <View style={styles.teamMember}>
                            <Image
                                source={require('../../assets/team/marius-simona.png')}
                                style={styles.teamImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.teamName}>Marius and Simona</Text>
                            <Text style={styles.teamRole}>VILCU</Text>
                        </View>
                        <View style={styles.teamMember}>
                            <Image
                                source={require('../../assets/team/louis-rebecca.png')}
                                style={styles.teamImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.teamName}>Louis and Rebecca</Text>
                            <Text style={styles.teamRole}>BONICEL</Text>
                        </View>
                    </View>
                </View>

                <View style={welcomeStyles.featureCard}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="document-text" size={24} color="#FF9843" style={styles.cardIcon} />
                        <Text style={welcomeStyles.featureTitle}>Our Statement of Faith</Text>
                    </View>
                    <Text style={welcomeStyles.featureText}>
                        Want to know more about us and our statement of faith?
                    </Text>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => Linking.openURL('https://www.egliselacite.com/_files/ugd/40e9ff_1b54e943b1e8425794c30475cfbe1de3.pdf')}
                    >
                        <Ionicons name="download" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>Download Statement of Faith</Text>
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
    cultureContainer: {
        marginTop: 10,
    },
    cultureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    cultureIcon: {
        marginRight: 10,
    },
    cultureText: {
        fontSize: 14,
        color: '#2C3E50',
    },
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
    actionButton: {
        backgroundColor: '#FF9843',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
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
    link: {
        color: '#FF9843',
        textDecorationLine: 'underline',
    },
});