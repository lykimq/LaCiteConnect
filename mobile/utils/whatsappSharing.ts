import * as FileSystem from 'expo-file-system';
import Share, { Social } from 'react-native-share';
import { Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';


/**
 * Downloads and converts an image to Base64
 */
export const downloadImageAsBase64 = async (imageUrl: string): Promise<string | undefined> => {
    try {
        console.log('Downloading image as Base64:', imageUrl);

        // Download to temporary file first
        const filename = imageUrl.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image.jpg';
        const tempUri = `${FileSystem.cacheDirectory}${filename}`;

        console.log('Downloading to temp location:', tempUri);
        const { uri } = await FileSystem.downloadAsync(imageUrl, tempUri);

        // Convert to Base64
        console.log('Converting to Base64...');
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Clean up temp file
        try {
            await FileSystem.deleteAsync(uri, { idempotent: true });
        } catch (cleanupError) {
            console.warn('Failed to cleanup temp file:', cleanupError);
        }

        console.log('Successfully converted to Base64');
        return base64;
    } catch (error) {
        console.error('Base64 conversion error:', error instanceof Error ? error.message : error);
        console.error('Full error:', error);
        Alert.alert('Error', 'Failed to process the image');
        return undefined;
    }
};


/**
 * Saves a Base64 image to the device's photo library
 */
export const saveBase64ToLibrary = async (base64Image: string): Promise<boolean> => {
    try {
        console.log('Requesting media library permissions...');
        const { status } = await MediaLibrary.requestPermissionsAsync();
        console.log('Permission status:', status);

        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow photo access');
            return false;
        }

        // Create temporary file from Base64
        const tempUri = `${FileSystem.cacheDirectory}temp_image.jpg`;
        console.log('Creating temporary file:', tempUri);

        await FileSystem.writeAsStringAsync(tempUri, base64Image, {
            encoding: FileSystem.EncodingType.Base64,
        });

        console.log('Saving to library...');
        const asset = await MediaLibrary.saveToLibraryAsync(tempUri);
        console.log('File saved to library. Asset:', asset);

        // Clean up temp file
        try {
            await FileSystem.deleteAsync(tempUri, { idempotent: true });
        } catch (cleanupError) {
            console.warn('Failed to cleanup temp file:', cleanupError);
        }

        Alert.alert('Saved', 'Image saved to your gallery');
        return true;
    } catch (error) {
        console.error('Save error:', error instanceof Error ? error.message : error);
        console.error('Full error:', error);
        Alert.alert('Error', 'Failed to save image');
        return false;
    }
};

/**
 * Shares a Base64 image via WhatsApp
 */
export const shareBase64ToWhatsApp = async (base64Image: string): Promise<void> => {
    try {
        console.log('Preparing to share via WhatsApp');

        await Share.shareSingle({
            message: 'Check out this image!',
            url: `data:image/jpeg;base64,${base64Image}`,
            type: 'image/jpeg',
            social: Social.Whatsapp,
        });

        console.log('Share request completed');
    } catch (error) {
        console.error('WhatsApp share error:', error instanceof Error ? error.message : error);
        console.error('Full error:', error);
        Alert.alert('Error', 'Could not share to WhatsApp');
    }
};
