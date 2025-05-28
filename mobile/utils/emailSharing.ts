import { Platform } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';

interface EmailPhotoShareOptions {
    to?: string[];
    subject?: string;
    body?: string;
    imageUri: string;  // Local file URI of the image
    cc?: string[];
    bcc?: string[];
}

/**
 * Checks if email is available on the device
 * @returns Promise<boolean> indicating whether email is available
 */
export const isEmailAvailable = async (): Promise<boolean> => {
    const isAvailable = await MailComposer.isAvailableAsync();
    return isAvailable;
};

/**
 * Shares a photo via email using the device's mail composer
 * @param options EmailPhotoShareOptions object containing email and image details
 * @returns Promise<boolean> indicating whether the email was sent successfully
 */
export const sharePhotoViaEmail = async (options: EmailPhotoShareOptions): Promise<boolean> => {
    try {
        const {
            to = [],
            subject = '',
            body = '',
            imageUri,
            cc = [],
            bcc = []
        } = options;

        // Check if email is available
        const isAvailable = await isEmailAvailable();
        if (!isAvailable) {
            throw new Error('Email is not available on this device');
        }

        // Verify the image exists
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
            throw new Error('Image file does not exist');
        }

        // Process the image to ensure compatibility
        const processedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [], // no transformations needed
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );

        // Compose and send the email
        const result = await MailComposer.composeAsync({
            recipients: to,
            subject,
            body,
            attachments: [processedImage.uri],
            ccRecipients: cc,
            bccRecipients: bcc,
            isHtml: false
        });

        // Check the result
        return result.status === 'sent';
    } catch (error) {
        console.error('Error sharing photo via email:', error);
        return false;
    }
};
