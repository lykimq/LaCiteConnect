import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATIC_URLS } from '../config/staticData';
import { contentService } from '../services/contentService';
import { useTheme } from '../contexts/ThemeContext';
import { useThemedStyles } from '../hooks/useThemedStyles';
import { createWhoWeAreStyles } from '../styles/ThemedStyles';
import { openUrlWithCorrectDomain, openGenericUrl } from '../utils/urlUtils';
import { useLanguage } from '../contexts/LanguageContext';

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
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createWhoWeAreStyles);
    const { currentLanguage } = useLanguage();

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

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={themeColors.primary} />
            </View>
        );
    }

    if (error || !content) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="alert-circle" size={48} color={themeColors.error} style={{ marginBottom: 16 }} />
                <Text style={{ fontSize: 16, color: themeColors.error }}>{error || 'Content not available'}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={loadContent}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderChurchSection = (section: WhoWeAreContent['sections'][0]) => (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                    <Ionicons name={section.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
                <Text style={styles.paragraph}>
                    {section.content?.split('(NCMI)').map((part, i) => {
                        if (i === 0) {
                            return <React.Fragment key={i}>{part}(
                                <Text
                                    style={styles.link}
                                    onPress={() => openGenericUrl('https://ncmi.net/')}
                                >
                                    NCMI
                                </Text>
                                )</React.Fragment>;
                        }
                        return <React.Fragment key={i}>{part}</React.Fragment>;
                    })}
                </Text>
            </View>
        </View>
    );

    const renderCultureSection = (section: WhoWeAreContent['sections'][0]) => (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                    <Ionicons name={section.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
                {section.values?.map((value, i) => (
                    <View key={i} style={styles.valueItem}>
                        <Ionicons name={section.itemIcon as any} size={22} color={themeColors.primary} style={styles.valueIcon} />
                        <Text style={styles.valueText}>{value}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderTeamSection = (section: WhoWeAreContent['sections'][0]) => (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                    <Ionicons name={section.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.teamGrid}>
                {section.team?.map((member, i) => (
                    <View key={i} style={styles.teamMemberCard}>
                        <Image
                            source={getTeamImage(member.image)}
                            style={styles.teamMemberImage}
                            resizeMode="cover"
                        />
                        <View style={styles.teamMemberInfo}>
                            <Text style={styles.teamMemberName}>{member.firstName}</Text>
                            <Text style={styles.teamMemberLastName}>{member.lastName}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );

    const renderStatementSection = (section: WhoWeAreContent['sections'][0]) => (
        <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                    <Ionicons name={section.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <View style={styles.sectionContent}>
                <Text style={styles.paragraph}>{section.content}</Text>
                <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => openUrlWithCorrectDomain(STATIC_URLS.statements, currentLanguage)}
                >
                    <Ionicons name={section.buttonIcon as any} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.downloadButtonText}>{section.buttonText}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.heroSection}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>{content.header.title}</Text>
                        <Text style={styles.heroSubtitle}>{content.header.subtitle}</Text>
                    </View>
                </View>

                <View style={styles.sectionsContainer}>
                    {content.sections.map((section) => {
                        switch (section.id) {
                            case 'ourChurch':
                                return renderChurchSection(section);
                            case 'ourCulture':
                                return renderCultureSection(section);
                            case 'ourEldershipTeam':
                                return renderTeamSection(section);
                            case 'ourStatement':
                                return renderStatementSection(section);
                            default:
                                return null;
                        }
                    })}
                </View>
            </ScrollView>
        </View>
    );
};