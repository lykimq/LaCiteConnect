import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const welcomeStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    featuresContainer: {
        marginBottom: 40,
        gap: 20,
    },
    featureCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
            },
        }),
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 10,
    },
    featureText: {
        fontSize: 16,
        color: '#7F8C8D',
        lineHeight: 24,
    },
    actionContainer: {
        marginTop: 20,
    },
    loginButton: {
        backgroundColor: '#FF9843',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
            },
        }),
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#FF9843',
    },
    registerButtonText: {
        color: '#FF9843',
        fontSize: 18,
        fontWeight: '600',
    },
    exploreButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    exploreButtonText: {
        color: '#7F8C8D',
        fontSize: 18,
        fontWeight: '600',
    },
    footer: {
        marginTop: 'auto',
        marginBottom: 20,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    footerText: {
        color: '#95A5A6',
        textAlign: 'center',
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: '#FF9843',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
            },
        }),
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#ff3b30',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    // Profile styles
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
        paddingTop: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
        marginBottom: 5,
    },
    emailText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    profileSection: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    infoItem: {
        marginBottom: 15,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});