import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Service for handling image uploads and processing
 */
export const uploadService = {
    /**
     * Convert image to base64 data URL format with compression
     * @param uri Local URI of the image file
     * @returns Base64 data URL
     */
    imageToBase64: async (uri: string): Promise<string> => {
        try {
            // For web platform
            if (Platform.OS === 'web') {
                return uri; // Web URIs are already in a format the server can handle
            }

            // Compress the image first to reduce size
            const compressedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 300, height: 300 } }], // Resize to smaller dimensions
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress by 50%
            );

            // For native platforms - use the compressed image
            const fileInfo = await FileSystem.getInfoAsync(compressedImage.uri);
            if (!fileInfo.exists) {
                throw new Error('File does not exist');
            }

            // Read the file as base64
            const base64 = await FileSystem.readAsStringAsync(compressedImage.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Return as data URL with JPEG mime type
            return `data:image/jpeg;base64,${base64}`;
        } catch (error) {
            console.error('Error converting image to base64:', error);
            throw error;
        }
    }
};