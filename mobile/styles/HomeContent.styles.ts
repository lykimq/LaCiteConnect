import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        marginBottom: 20,
        marginTop: 30,
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#FF9843',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    serviceTime: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        color: '#333',
    },
    serviceDesc: {
        fontSize: 16,
        color: '#555',
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactIcon: {
        width: 24,
        marginRight: 10,
    },
    scrollView: {
        flex: 1,
    }
});