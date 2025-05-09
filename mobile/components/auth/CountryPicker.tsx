import { countryCodes } from '../../utils/countries';
import React from 'react'
import { Platform, TouchableOpacity, Text, Modal, Pressable, View, ScrollView } from 'react-native';
import { authStyles } from '../../styles/auth.styles';


const CountryPicker = ({ selectedCountry, setSelectedCountry, updateFormState }: any) => {
    const [showPicker, setShowPicker] = React.useState(false);

    const handleCountrySelect = (country: typeof countryCodes[0]) => {
        setSelectedCountry(country);
        setShowPicker(false);
        updateFormState({ phoneRegion: country.code });
    };

    if (Platform.OS === 'web') {
        return (
            <select
                value={selectedCountry.code}
                onChange={(e) => {
                    const country = countryCodes.find(c => c.code === e.target.value);
                    if (country) handleCountrySelect(country);
                }}
                style={{
                    height: '50px',
                    padding: '0 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    backgroundColor: '#f8f8f8',
                    marginRight: '8px',
                    fontSize: '16px',
                    color: '#333',
                    cursor: 'pointer',
                    outline: 'none',
                }}
            >
                {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                        {country.flag} {country.name} ({country.code})
                    </option>
                ))}
            </select>
        );
    }

    return (
        <>
            <TouchableOpacity
                style={authStyles.countryCodeButton}
                onPress={() => setShowPicker(true)}
            >
                <Text style={authStyles.countryCodeText}>
                    {selectedCountry.flag} {selectedCountry.code}
                </Text>
            </TouchableOpacity>
            <Modal
                visible={showPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <Pressable
                    style={authStyles.modalOverlay}
                    onPress={() => setShowPicker(false)}
                >
                    <View style={authStyles.modalContent}>
                        <View style={authStyles.modalHeader}>
                            <Text style={authStyles.modalTitle}>Select Country</Text>
                            <TouchableOpacity onPress={() => setShowPicker(false)}>
                                <Text style={authStyles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={authStyles.countryList}>
                            {countryCodes.map((country) => (
                                <Pressable
                                    key={country.code}
                                    style={({ pressed }) => [
                                        authStyles.countryItem,
                                        pressed && authStyles.countryItemPressed
                                    ]}
                                    onPress={() => handleCountrySelect(country)}
                                >
                                    <Text style={authStyles.countryItemText}>
                                        {country.flag} {country.name} ({country.code})
                                    </Text>
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

export default CountryPicker;