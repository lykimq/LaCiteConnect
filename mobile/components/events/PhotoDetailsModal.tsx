import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Modal,
    Image,
    TouchableOpacity,
    Animated,
    PanResponder,
    GestureResponderEvent,
    Dimensions,
    Share,
    Platform,
    Alert,
    ScrollView,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createPhotoDetailsModalStyles } from '../../styles/events/PhotoDetailsModal.styles';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50; // Minimum distance to trigger swipe

/**
 * PhotoDetailsModal Component
 * A modal component that displays a full-screen image viewer with sharing capabilities.
 * Features:
 * - Image zoom and pan gestures
 * - Left/right swipe navigation
 * - Social media sharing
 * - Image download functionality
 * - Platform-specific UI adjustments
 */

interface PhotoDetailsModalProps {
    visible: boolean;        // Controls modal visibility
    onClose: () => void;    // Callback when modal is closed
    images: string[];       // Array of image URLs to display
    initialIndex: number;   // Starting index in the images array
}

export const PhotoDetailsModal: React.FC<PhotoDetailsModalProps> = ({
    visible,
    onClose,
    images,
    initialIndex,
}) => {
    // Theme and styles setup
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createPhotoDetailsModalStyles);

    // State management
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [downloadingImage, setDownloadingImage] = useState(false);

    // Animation values for gestures
    const scale = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    // Gesture tracking state
    const [isSwipingHorizontally, setIsSwipingHorizontally] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentScale, setCurrentScale] = useState(1);

    scale.addListener(({ value }) => setCurrentScale(value));

    // Pan responder for handling zoom, pan, and swipe gestures
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            // Allow pan responder to capture the gesture if:
            // 1. We're already handling a gesture, or
            // 2. There's significant movement
            return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
        },
        onPanResponderGrant: (_, gestureState) => {
            setStartX(gestureState.x0);
            setIsSwipingHorizontally(false);
        },
        onPanResponderMove: (_, gestureState) => {
            // Determine if this is a horizontal swipe
            if (!isSwipingHorizontally && Math.abs(gestureState.dx) > 10) {
                const isHorizontal = Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
                setIsSwipingHorizontally(isHorizontal);
            }

            // Handle pinch zoom
            if (gestureState.numberActiveTouches === 2) {
                // Calculate the distance between the two touch points
                const distance = Math.sqrt(
                    Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)
                );

                // Calculate the new scale based on the distance between the touch points
                const newScale = Math.max(1, Math.min(3, 1 + distance / 200));
                scale.setValue(newScale);

                // Update the scale value
                setCurrentScale(newScale);
            } else if (currentScale > 1) {
                // Handle pan when zoomed in
                translateX.setValue(gestureState.dx);
                translateY.setValue(gestureState.dy);
            } else if (isSwipingHorizontally) {
                // Handle horizontal swipe
                translateX.setValue(gestureState.dx);
            }
        },
        // When the gesture is released, reset the scale to 1
        onPanResponderRelease: (_, gestureState) => {
            if (currentScale > 1) {
                // Reset pan position when zoomed
                Animated.parallel([
                    Animated.spring(scale, {
                        toValue: 1,
                        useNativeDriver: true,
                    }),
                    // Reset the pan position
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }),
                    // Reset the pan position
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }),
                ]).start();
            } else if (isSwipingHorizontally) {
                // Handle swipe navigation
                const swipeDistance = gestureState.dx;

                if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
                    if (swipeDistance > 0 && currentIndex > 0) {
                        // Swipe right - go to previous
                        handlePrevious();
                        // Immediately reset position without animation
                        translateX.setValue(0);
                    } else if (swipeDistance < 0 && currentIndex < images.length - 1) {
                        // Swipe left - go to next
                        handleNext();
                        // Immediately reset position without animation
                        translateX.setValue(0);
                    } else {
                        // If we can't navigate (at the end), reset position immediately
                        translateX.setValue(0);
                    }
                } else {
                    // If swipe didn't meet threshold, reset position immediately
                    translateX.setValue(0);
                }
            }
        },
        // Reset position immediately if gesture is terminated
        onPanResponderTerminate: () => {
            // Reset position immediately if gesture is terminated
            translateX.setValue(0);
        },
    });

    // Clean up the scale listener when component unmounts
    useEffect(() => {
        const scaleListener = scale.addListener(() => { });
        return () => {
            scale.removeListener(scaleListener);
        };
    }, []);

    // Handle previous image
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Handle background press
    const handleBackgroundPress = (event: GestureResponderEvent) => {
        // Only close if the press is directly on the background
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    /**
     * Platform-specific sharing implementation
     * Handles sharing to different social media platforms using deep linking
     * Falls back to web sharing if apps are not installed
     * @param platform - The target platform to share to
     */
    const handleShare = async (platform: string) => {
        const imageUrl = images[currentIndex];

        try {
            switch (platform) {
                case 'facebook':
                    // Open Facebook share dialog
                    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
                    await Linking.openURL(fbUrl);
                    break;

                case 'instagram':
                    // Instagram sharing requires saving to camera roll first
                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    if (status === 'granted') {
                        const filename = imageUrl.split('/').pop();
                        const localUri = `${FileSystem.cacheDirectory}${filename}`;
                        await FileSystem.downloadAsync(imageUrl, localUri);
                        await MediaLibrary.saveToLibraryAsync(localUri);
                        // Open Instagram with the saved image
                        await Linking.openURL('instagram://library?AssetPath=' + localUri);
                    } else {
                        Alert.alert('Permission Required', 'Please grant permission to access photos');
                    }
                    break;

                case 'pinterest':
                    // Try native Pinterest app first, fall back to web
                    const pinUrl = `pinterest://pin/create/link/?url=${encodeURIComponent(imageUrl)}`;
                    try {
                        await Linking.openURL(pinUrl);
                    } catch {
                        await Linking.openURL(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(imageUrl)}`);
                    }
                    break;

                case 'whatsapp':
                    // Share via WhatsApp
                    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(imageUrl)}`;
                    await Linking.openURL(whatsappUrl);
                    break;

                case 'email':
                    // Open email client with pre-filled content
                    const emailUrl = `mailto:?subject=Check out this image&body=${encodeURIComponent(imageUrl)}`;
                    await Linking.openURL(emailUrl);
                    break;

                case 'twitter':
                    // Open Twitter share intent
                    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}`;
                    await Linking.openURL(twitterUrl);
                    break;

                default:
                    // Fallback to system share sheet
                    await Share.share({
                        url: imageUrl,
                        title: 'Share Image',
                        message: 'Check out this image!',
                    });
            }
        } catch (error) {
            Alert.alert('Error', `Failed to share to ${platform}`);
        }
    };

    /**
     * Image download handler
     * Saves the current image to the device's photo library
     * Handles permissions and shows appropriate feedback
     */
    const handleDownload = async () => {
        try {
            setDownloadingImage(true);

            // Request permissions for saving to photo library
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant permission to save photos');
                return;
            }

            // Download and save the image
            const imageUrl = images[currentIndex];
            const filename = imageUrl.split('/').pop();
            const localUri = `${FileSystem.cacheDirectory}${filename}`;
            const { uri } = await FileSystem.downloadAsync(imageUrl, localUri);
            await MediaLibrary.saveToLibraryAsync(uri);

            Alert.alert('Success', 'Image saved to your photos');
        } catch (error) {
            Alert.alert('Error', 'Failed to download the image');
        } finally {
            setDownloadingImage(false);
        }
    };

    // Render the modal
    if (!visible || images.length === 0) return null;

    // Render the modal
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View
                style={styles.modalOverlay}
                onStartShouldSetResponder={() => true}
                onResponderRelease={handleBackgroundPress}
            >
                {/* Close button */}
                <TouchableOpacity
                    style={styles.closeButtonContainer}
                    onPress={onClose}
                >
                    <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Navigation buttons */}
                {currentIndex > 0 && (
                    <TouchableOpacity
                        style={[styles.navigationButton, styles.leftButton]}
                        onPress={handlePrevious}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {/* Navigation buttons */}
                {currentIndex < images.length - 1 && (
                    <TouchableOpacity
                        style={[styles.navigationButton, styles.rightButton]}
                        onPress={handleNext}
                    >
                        <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                )}

                {/* Photo container with zoom, pan, and swipe capabilities */}
                <Animated.View
                    style={[
                        styles.photoContainer,
                        {
                            transform: [
                                { scale },
                                { translateX },
                                { translateY },
                            ],
                        },
                    ]}
                    {...panResponder.panHandlers}
                >
                    {/* Photo */}
                    <Image
                        source={{ uri: images[currentIndex] }}
                        style={styles.photo}
                    />
                </Animated.View>

                {/* Pagination dots */}
                <View style={styles.paginationContainer}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                currentIndex === index && styles.activePaginationDot,
                            ]}
                        />
                    ))}
                </View>

                {/* Social Media Sharing Buttons */}
                <View style={styles.actionButtonsContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.actionButtonsScroll}
                        contentInset={{ left: 20, right: 20 }}
                        contentOffset={{ x: -20, y: 0 }} // Compensate for left inset
                    >
                        {/* Facebook Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#3b5998' }]}
                            onPress={() => handleShare('facebook')}
                        >
                            <Ionicons name="logo-facebook" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Instagram Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#C13584' }]}
                            onPress={() => handleShare('instagram')}
                        >
                            <Ionicons name="logo-instagram" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Pinterest Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#E60023' }]}
                            onPress={() => handleShare('pinterest')}
                        >
                            <Ionicons name="logo-pinterest" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* WhatsApp Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#25D366' }]}
                            onPress={() => handleShare('whatsapp')}
                        >
                            <Ionicons name="logo-whatsapp" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Twitter Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#1DA1F2' }]}
                            onPress={() => handleShare('twitter')}
                        >
                            <Ionicons name="logo-twitter" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Email Share Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#DB4437' }]}
                            onPress={() => handleShare('email')}
                        >
                            <Ionicons name="mail" size={24} color="#FFFFFF" />
                        </TouchableOpacity>

                        {/* Download Button */}
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#4285F4' }]}
                            onPress={handleDownload}
                            disabled={downloadingImage}
                        >
                            <Ionicons
                                name={downloadingImage ? "cloud-download-outline" : "download"}
                                size={24}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};