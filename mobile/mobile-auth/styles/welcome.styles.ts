import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
import { authStyles } from './auth.styles';

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
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    logo: {
        width: width * 0.35,
        height: width * 0.35,
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 8,
        textAlign: 'center',
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
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
    },
    featureText: {
        fontSize: 14,
        color: '#6C757D',
        lineHeight: 20,
    },
    actionContainer: {
        marginBottom: 20,
    },
    // Reusable button styles
    loginButton: {
        ...authStyles.button,
    },
    loginButtonText: {
        ...authStyles.buttonText,
    },
    registerButton: {
        ...authStyles.button,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#3498DB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    registerButtonText: {
        ...authStyles.buttonText,
        color: '#3498DB',
        fontSize: 18,
        fontWeight: '600',
    },
    exploreButton: {
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exploreButtonText: {
        color: '#6C757D',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        marginTop: 'auto',
        paddingVertical: 20,
    },
    footerText: {
        color: '#6C757D',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
});