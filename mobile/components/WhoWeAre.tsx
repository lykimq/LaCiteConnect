import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { whoWeAreStyles } from '../styles/WhoWeAre.styles';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS } from '../config/staticData';

const { width } = Dimensions.get('window');

export const WhoWeAreContent = () => {
    return (
        <View style={whoWeAreStyles.container}>
            <ScrollView
                style={whoWeAreStyles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={whoWeAreStyles.header}>
                    <Text style={whoWeAreStyles.title}>
                        Who We Are
                    </Text>
                    <Text style={whoWeAreStyles.subtitle}>
                        To know Jesus and make Him known in Paris
                    </Text>
                </View>

                <View style={whoWeAreStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="home" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={whoWeAreStyles.sectionTitle}>Our Church</Text>
                    </View>
                    <Text style={whoWeAreStyles.paragraph}>
                        We are a Christian church based in Paris, in partnership with New Covenant Ministries International (
                        <Text
                            style={{ color: '#FF9843', textDecorationLine: 'underline' }}
                            onPress={() => Linking.openURL('https://ncmi.net/')}
                        >
                            NCMI
                        </Text>
                        ). Our church is a community of Parisians from all over the world and of all ages, with a heart for Paris and for France.
                    </Text>
                </View>

                <View style={whoWeAreStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="eye" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={whoWeAreStyles.sectionTitle}>Our Vision</Text>
                    </View>
                    <Text style={whoWeAreStyles.paragraph}>
                        To be a church that knows Jesus and makes Him known in Paris and from Paris for His glory.
                    </Text>
                </View>

                <View style={whoWeAreStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="book" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={whoWeAreStyles.sectionTitle}>Our Story</Text>
                    </View>
                    <Text style={whoWeAreStyles.paragraph}>
                        In April 2009, Fred and Vanessa together with their two sons at the time; Daniel (6) and Joel (3), left Dubai and the church they had been serving as full-time elders in for over 5 years, after feeling called by God to plant a church in Paris. Soon after arriving, they started to hold church meetings in their lounge every Sunday. Little by little, the church put down roots and God has added to our number those who are now part of La Cité.
                    </Text>
                </View>

                <View style={whoWeAreStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="heart" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={whoWeAreStyles.sectionTitle}>Our Heart</Text>
                    </View>
                    <Text style={whoWeAreStyles.paragraph}>
                        Our desire and passion is to see the Kingdom of God increasingly established here in Paris. To see His City (the church), His Ways and His Reign established. This includes seeing the captives set free, physical, emotional, and spiritual healing, people realizing their unique identity and calling, as well as many other things, on Earth, in Paris, as it is in Heaven.
                    </Text>
                </View>

                <View style={whoWeAreStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="people" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={whoWeAreStyles.sectionTitle}>Our Culture</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 14, color: '#2C3E50' }}>Authenticity</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 14, color: '#2C3E50' }}>Family values</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 14, color: '#2C3E50' }}>Apostolic vision</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 14, color: '#2C3E50' }}>Humility</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <Ionicons name="checkmark-circle" size={20} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 14, color: '#2C3E50' }}>Love</Text>
                        </View>
                    </View>
                </View>

                <View style={whoWeAreStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="people-circle" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={whoWeAreStyles.sectionTitle}>Our Eldership Team</Text>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 15 }}>
                        <View style={{ width: (width - 60) / 2, alignItems: 'center', marginBottom: 20, marginHorizontal: 5 }}>
                            <Image
                                source={require('../assets/team/fred-vanessa.png')}
                                style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
                                resizeMode="cover"
                            />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Fred and Vanessa</Text>
                            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>DALAIS</Text>
                        </View>
                        <View style={{ width: (width - 60) / 2, alignItems: 'center', marginBottom: 20, marginHorizontal: 5 }}>
                            <Image
                                source={require('../assets/team/nathanael-camille.png')}
                                style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
                                resizeMode="cover"
                            />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Nathanaël and Camille</Text>
                            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>WESTPHAL</Text>
                        </View>
                        <View style={{ width: (width - 60) / 2, alignItems: 'center', marginBottom: 20, marginHorizontal: 5 }}>
                            <Image
                                source={require('../assets/team/marius-simona.png')}
                                style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
                                resizeMode="cover"
                            />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Marius and Simona</Text>
                            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>VILCU</Text>
                        </View>
                        <View style={{ width: (width - 60) / 2, alignItems: 'center', marginBottom: 20, marginHorizontal: 5 }}>
                            <Image
                                source={require('../assets/team/louis-rebecca.png')}
                                style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
                                resizeMode="cover"
                            />
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>Louis and Rebecca</Text>
                            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>BONICEL</Text>
                        </View>
                    </View>
                </View>

                <View style={whoWeAreStyles.cardContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="document-text" size={24} color="#FF9843" style={{ marginRight: 10 }} />
                        <Text style={whoWeAreStyles.sectionTitle}>Our Statement of Faith</Text>
                    </View>
                    <Text style={whoWeAreStyles.paragraph}>
                        Want to know more about us and our statement of faith?
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#FF9843',
                            paddingVertical: 12,
                            paddingHorizontal: 15,
                            borderRadius: 8,
                            marginTop: 15,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                        }}
                        onPress={() => Linking.openURL(STATIC_URLS.statements)}
                    >
                        <Ionicons name="download" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
                            Download Statement of Faith
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};