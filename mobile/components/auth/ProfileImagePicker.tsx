import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { authStyles } from '../../styles/auth.styles';

export const ProfileImagePicker = ({
    profileImage,
    setProfileImage,
    updateFormState,
}: any) => {

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0].uri) {
            setProfileImage(result.assets[0].uri);
            updateFormState({ profilePictureUrl: result.assets[0].uri });
        }
    };

    return (
        <View style={authStyles.profileImageContainer}>
            <TouchableOpacity onPress={pickImage} style={authStyles.profileImageButton}>
                {profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={authStyles.profileImage}
                    />
                ) : (
                    <View style={authStyles.profileImagePlaceholder}>
                        <Text style={authStyles.profileImagePlaceholderText}>
                            Add Photo
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};
