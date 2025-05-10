import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth.types';
import { API_BASE_URL } from '../config/api';
import { uploadService } from './uploadService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    async register(userData: RegisterCredentials): Promise<AuthResponse> {
        try {
            // If profile picture URL is provided, try to convert it to base64
            let profileImageTooLarge = false;
            const originalProfilePicUrl = userData.profilePictureUrl;

            if (userData.profilePictureUrl) {
                try {
                    // Convert the profile image to base64 data URL
                    const base64Image = await uploadService.imageToBase64(userData.profilePictureUrl);

                    // Update the userData with the base64 data URL
                    userData.profilePictureUrl = base64Image;
                } catch (imageError) {
                    console.error('Failed to process profile image:', imageError);
                    // Continue with registration without the profile picture
                    delete userData.profilePictureUrl;
                    profileImageTooLarge = true;
                }
            }

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                // If we get a "request entity too large" error and we have an image
                if (response.status === 413 && originalProfilePicUrl) {
                    console.log('Image too large for single request. Trying two-step registration...');
                    profileImageTooLarge = true;

                    // Try again without the profile picture
                    delete userData.profilePictureUrl;

                    const retryResponse = await fetch(`${API_BASE_URL}/auth/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });

                    if (!retryResponse.ok) {
                        const error = await retryResponse.json();
                        console.error('Registration retry error:', error);
                        throw new Error(error.message || 'Registration failed');
                    }

                    // Registration successful, now we'll handle the profile picture separately
                    const result = await retryResponse.json();

                    // Store the token for authenticated requests
                    if (result.accessToken) {
                        await AsyncStorage.setItem('token', result.accessToken);
                    }

                    // Update profile picture separately if we have one
                    if (originalProfilePicUrl) {
                        try {
                            console.log('Updating profile picture separately after registration...');
                            await this.updateProfilePicture(originalProfilePicUrl);
                            console.log('Profile picture updated successfully');
                        } catch (error) {
                            console.error('Failed to update profile picture after registration:', error);
                            // Don't throw the error since registration was successful
                            // The user can update their profile picture later
                        }
                    }

                    return result;
                } else {
                    // Some other error occurred
                    const error = await response.json();
                    console.error('Registration error:', error);
                    throw new Error(error.message || 'Registration failed');
                }
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // New method to update profile picture
    async updateProfilePicture(imageUri: string): Promise<any> {
        try {
            // Get the auth token
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('Not authenticated');
            }

            // Send request to update profile picture
            const response = await fetch(`${API_BASE_URL}/auth/profile-picture`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ profilePictureUrl: imageUri })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update profile picture');
            }

            const result = await response.json();

            // Update stored user data with new profile picture
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsedUserData = JSON.parse(userData);
                parsedUserData.profilePictureUrl = result.profilePictureUrl;
                await AsyncStorage.setItem('userData', JSON.stringify(parsedUserData));
            }

            return result;
        } catch (error) {
            console.error('Error updating profile picture:', error);
            throw error;
        }
    }
}