import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, Dimensions, ActivityIndicator } from 'react-native';
import { whoWeAreStyles } from '../styles/WhoWeAre.styles';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS } from '../config/staticData';
import { contentService } from '../services/contentService';

const { width } = Dimensions.get('window');

// Define the who we are content interface
interface WhoWeAreContent {
    header: {
        title: string;
        subtitle: string;
    };
    sections: Array<{
        id: string;
        icon: string;
        title: string;
        content?: string;
        links?: Array<{
            text: string;
            url: string;
        }>;
        values?: string[];
        itemIcon?: string;
        team?: Array<{
            image: string;
            firstName: string;
            lastName: string;
        }>;
        buttonText?: string;
        buttonIcon?: string;
    }>;
}

export const WhoWeAreContent = () => {
    const [content, setContent] = useState<WhoWeAreContent | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        try {
            setLoading(true);
            const response = await contentService.getContent<WhoWeAreContent>('whoWeAre');

            if (response.success && response.data) {
                setContent(response.data);
            } else {
                setError(response.error || 'Failed to load content');
            }
        } catch (err) {
            console.error('Error loading who we are content:', err);
            setError('An error occurred while loading content');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[whoWeAreStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FF9843" />
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={[whoWeAreStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 16, color: '#FF3B30' }}>{error || 'Content not available'}</Text>
                <TouchableOpacity
                    style={{ marginTop: 20, padding: 10, backgroundColor: '#FF9843', borderRadius: 8 }}
                    onPress={loadContent}
                >
                    <Text style={{ color: '#FFFFFF' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderSection = (section: WhoWeAreContent['sections'][0], index: number) => {
        switch (section.id) {
            case 'ourChurch':
                return (
                    <View key={section.id} style={whoWeAreStyles.cardContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={whoWeAreStyles.sectionTitle}>{section.title}</Text>
                        </View>
                        <Text style={whoWeAreStyles.paragraph}>
                            {section.content?.split('(NCMI)').map((part, i) => {
                                if (i === 0) {
                                    return <React.Fragment key={i}>{part}(
                                        <Text
                                            style={{ color: '#FF9843', textDecorationLine: 'underline' }}
                                            onPress={() => Linking.openURL('https://ncmi.net/')}
                                        >
                                            NCMI
                                        </Text>
                                        )</React.Fragment>;
                                }
                                return <React.Fragment key={i}>{part}</React.Fragment>;
                            })}
                        </Text>
                    </View>
                );
            case 'ourCulture':
                return (
                    <View key={section.id} style={whoWeAreStyles.cardContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={whoWeAreStyles.sectionTitle}>{section.title}</Text>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            {section.values?.map((value, i) => (
                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                    <Ionicons name={section.itemIcon as any} size={20} color="#FF9843" style={{ marginRight: 10 }} />
                                    <Text style={{ fontSize: 14, color: '#2C3E50' }}>{value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'ourEldershipTeam':
                return (
                    <View key={section.id} style={whoWeAreStyles.cardContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={whoWeAreStyles.sectionTitle}>{section.title}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 15 }}>
                            {section.team?.map((member, i) => (
                                <View key={i} style={{ width: (width - 60) / 2, alignItems: 'center', marginBottom: 20, marginHorizontal: 5 }}>
                                    <Image
                                        source={getTeamImage(member.image)}
                                        style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
                                        resizeMode="cover"
                                    />
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333', textAlign: 'center' }}>{member.firstName}</Text>
                                    <Text style={{ fontSize: 14, color: '#666', textAlign: 'center' }}>{member.lastName}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            case 'ourStatement':
                return (
                    <View key={section.id} style={whoWeAreStyles.cardContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={whoWeAreStyles.sectionTitle}>{section.title}</Text>
                        </View>
                        <Text style={whoWeAreStyles.paragraph}>
                            {section.content}
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
                            <Ionicons name={section.buttonIcon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
                                {section.buttonText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return (
                    <View key={section.id} style={whoWeAreStyles.cardContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name={section.icon as any} size={24} color="#FF9843" style={{ marginRight: 10 }} />
                            <Text style={whoWeAreStyles.sectionTitle}>{section.title}</Text>
                        </View>
                        <Text style={whoWeAreStyles.paragraph}>
                            {section.content}
                        </Text>
                    </View>
                );
        }
    };

    // Helper function to get team member images
    const getTeamImage = (imageName: string) => {
        switch (imageName) {
            case 'fred-vanessa.png':
                return require('../assets/team/fred-vanessa.png');
            case 'nathanael-camille.png':
                return require('../assets/team/nathanael-camille.png');
            case 'marius-simona.png':
                return require('../assets/team/marius-simona.png');
            case 'louis-rebecca.png':
                return require('../assets/team/louis-rebecca.png');
            default:
                return require('../assets/team/fred-vanessa.png'); // Default fallback
        }
    };

    return (
        <View style={whoWeAreStyles.container}>
            <ScrollView
                style={whoWeAreStyles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <View style={whoWeAreStyles.header}>
                    <Text style={whoWeAreStyles.title}>
                        {content.header.title}
                    </Text>
                    <Text style={whoWeAreStyles.subtitle}>
                        {content.header.subtitle}
                    </Text>
                </View>

                {content.sections.map(renderSection)}
            </ScrollView>
        </View>
    );
};