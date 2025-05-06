import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
import { authStyles } from './auth.styles';

export const welcomeStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#7F8C8D',
        textAlign: 'center',
    },
    featuresContainer: {
        marginBottom: 40,
    },
    featureCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: '#3498DB',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
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
        borderColor: '#3498DB',
    },
    registerButtonText: {
        color: '#3498DB',
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
    },
    footerText: {
        color: '#95A5A6',
        textAlign: 'center',
        fontSize: 14,
    },
    // New styles for logged-in view
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: '#3498DB',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#E74C3C',
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
});