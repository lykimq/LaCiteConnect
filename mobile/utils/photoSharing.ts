import Share, { Social } from 'react-native-share';
import { Alert } from 'react-native';
import { downloadImageAsBase64, shareBase64ToWhatsApp, saveBase64ToLibrary } from './whatsappSharing';
import { shareToPinterest } from './pinterestSharing';
import { shareToFacebook } from './facebookSharing';
export { Social };  // Re-export Social type

/**
 * Combined action: Download → Save to gallery → Share to WhatsApp using Base64
 */
export const handleDownloadSaveAndShare = async (imageUrl: string): Promise<void> => {
    console.log('Starting combined download, save, and share process...');
    console.log('Image URL:', imageUrl);

    const base64Image = await downloadImageAsBase64(imageUrl);
    if (!base64Image) {
        console.error('Failed to download and convert image');
        return;
    }

    console.log('Successfully converted to Base64');
    const saved = await saveBase64ToLibrary(base64Image);

    if (saved) {
        console.log('Successfully saved to library, proceeding to share');
        await shareBase64ToWhatsApp(base64Image);
    } else {
        console.error('Failed to save to library');
    }
};

/**
 * Generic share function that supports multiple platforms
 */
export const sharePhoto = async (platform: 'facebook' | 'pinterest' | 'whatsapp' | 'generic', imageUrl: string): Promise<void> => {
    try {
        console.log('=== Share Photo Debug ===');
        console.log('Platform:', platform);
        console.log('Image URL:', imageUrl);

        if (!imageUrl) {
            throw new Error('No image URL provided');
        }

        if (platform === 'pinterest') {
            console.log('Initiating Pinterest sharing...');
            await shareToPinterest(imageUrl);
            return;
        }

        if (platform === 'facebook') {
            console.log('Initiating Facebook sharing...');
            await shareToFacebook(imageUrl);
            return;
        }

        if (platform === Social.Whatsapp) {
            console.log('Initiating WhatsApp sharing...');
            const base64Image = await downloadImageAsBase64(imageUrl);
            if (!base64Image) {
                throw new Error('Failed to convert image to Base64');
            }
            await shareBase64ToWhatsApp(base64Image);
            return;
        }

        // For other platforms, use generic share
        console.log('Using generic share...');
        await Share.open({
            url: imageUrl,
            type: 'image/jpeg',
            title: 'Share Image',
        });

    } catch (error) {
        console.error('=== Share Photo Error ===');
        console.error('Platform:', platform);
        console.error('Error type:', error instanceof Error ? 'Error object' : typeof error);
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        console.error('Full error:', error);
        Alert.alert('Error', `Failed to share to ${platform}`);
    }
};