import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export const authStyles = StyleSheet.create({
    // Container styles
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    formContainer: {
        width: isWeb ? Math.min(450, width * 0.9) : '100%',
        maxWidth: 450,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        ...Platform.select({
            web: {
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            },
            default: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 5,
            },
        }),
    },

    // Typography styles
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4285F4',
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },

    // Input styles
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f8f8f8',
    },

    // Button styles
    button: {
        backgroundColor: '#FF9843',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: '#FF9843',
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Google button styles
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4285F4',
        height: 50,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 20,
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
    googleIcon: {
        width: 20,
        height: 20,
        marginRight: 12,
        tintColor: '#FFFFFF',
    },
    googleButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    // Divider styles
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        color: '#666',
        paddingHorizontal: 10,
        fontSize: 14,
    },

    // Error styles
    error: {
        color: '#ff3b30',
        marginBottom: 15,
        textAlign: 'center',
    },

    // Navigation link styles
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#666',
    },
    signUpLink: {
        fontSize: 14,
        color: '#FF9843',
        fontWeight: 'bold',
    },

    // Remember me styles
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#666',
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxInner: {
        width: 12,
        height: 12,
        borderRadius: 2,
    },
    checkboxChecked: {
        backgroundColor: '#FF9843',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#666',
    },
    forgotPassword: {
        fontSize: 14,
        color: '#FF9843',
        textDecorationLine: 'underline',
    },

    // Phone input styles
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 8,
    },
    countryCodeButton: {
        height: 50,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 100,
        maxWidth: 120,
        flexShrink: 0,
    },
    countryCodeText: {
        fontSize: 16,
        color: '#333',
    },
    phoneInput: {
        flex: 1,
        minWidth: 120,
    },

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxWidth: 400,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#666',
    },
    modalButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

    // Profile image styles
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profileImageButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profileImagePlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImagePlaceholderText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },

    // Error styles
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        marginTop: 4,
    },

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    modalClose: {
        fontSize: 20,
        color: '#666',
        padding: 5,
    },
    countryList: {
        width: '100%',
        maxHeight: 300,
    },
    countryItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    countryItemPressed: {
        backgroundColor: '#f5f5f5',
    },
    countryItemText: {
        fontSize: 16,
        color: '#333',
    },

    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        padding: 5,
    },
});