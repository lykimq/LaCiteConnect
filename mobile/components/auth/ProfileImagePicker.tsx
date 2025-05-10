import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { authStyles } from '../../styles/auth.styles';
import { authService } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { uploadService } from '../../services/uploadService';

interface ProfileImagePickerProps {
    profileImage: string | null;
    setProfileImage: (uri: string | null) => void;
    updateFormState?: (updates: any) => void;
    onImageUpdate?: () => void;
    size?: number;
    showLoading?: boolean;
}

export const ProfileImagePicker: React.FC<ProfileImagePickerProps> = ({
    profileImage,
    setProfileImage,
    updateFormState,
    onImageUpdate,
    size = 120,
    showLoading = false,
}) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0].uri) {
                const newImageUri = result.assets[0].uri;
                setProfileImage(newImageUri);

                // If updateFormState is provided (registration flow), update the form state
                if (updateFormState) {
                    updateFormState({ profilePictureUrl: newImageUri });
                }

                // If onImageUpdate is provided (profile update flow), update the profile picture
                if (onImageUpdate) {
                    try {
                        setIsUpdating(true);
                        // Convert image to base64 before sending
                        const base64Image = await uploadService.imageToBase64(newImageUri);
                        await authService.updateProfilePicture(base64Image);

                        // Update stored user data with new profile picture
                        const userData = await AsyncStorage.getItem('userData');
                        if (userData) {
                            const parsedUserData = JSON.parse(userData);
                            parsedUserData.profilePictureUrl = base64Image;
                            await AsyncStorage.setItem('userData', JSON.stringify(parsedUserData));
                        }

                        onImageUpdate();
                    } catch (error) {
                        console.error('Failed to update profile picture:', error);
                        // Revert the image if update fails
                        setProfileImage(profileImage);
                    } finally {
                        setIsUpdating(false);
                    }
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const containerStyle = {
        ...authStyles.profileImageContainer,
        width: size,
        height: size,
    };

    const imageStyle = {
        ...authStyles.profileImage,
        width: size,
        height: size,
        borderRadius: size / 2,
    };

    const placeholderStyle = {
        ...authStyles.profileImagePlaceholder,
        width: size,
        height: size,
        borderRadius: size / 2,
    };

    return (
        <View style={containerStyle}>
            <TouchableOpacity
                onPress={pickImage}
                style={[authStyles.profileImageButton, { width: size, height: size, borderRadius: size / 2 }]}
                disabled={isUpdating || showLoading}
            >
                {isUpdating || showLoading ? (
                    <View style={placeholderStyle}>
                        <ActivityIndicator size="large" color="#FF9843" />
                    </View>
                ) : profileImage ? (
                    <Image
                        source={{ uri: profileImage }}
                        style={imageStyle}
                    />
                ) : (
                    <View style={placeholderStyle}>
                        <Text style={authStyles.profileImagePlaceholderText}>
                            Add Photo
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};
