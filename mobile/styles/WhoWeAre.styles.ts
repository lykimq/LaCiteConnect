import { StyleSheet } from 'react-native';

export const whoWeAreStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        marginBottom: 20,
        marginTop: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginTop: 20,
    },
    paragraph: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
        marginBottom: 15,
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
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 15,
    },
    leaderCard: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    leaderImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 12,
    },
    leaderInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    leaderName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    leaderRole: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    leaderBio: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    valueItem: {
        marginBottom: 15,
    },
    valueTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    valueDescription: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
});