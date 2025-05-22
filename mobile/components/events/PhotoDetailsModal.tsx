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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createPhotoDetailsModalStyles } from '../../styles/events/PhotoDetailsModal.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50; // Minimum distance to trigger swipe

interface PhotoDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    images: string[];
    initialIndex: number;
}

export const PhotoDetailsModal: React.FC<PhotoDetailsModalProps> = ({
    visible,
    onClose,
    images,
    initialIndex,
}) => {
    const { themeColors } = useTheme();
    const styles = useThemedStyles(createPhotoDetailsModalStyles);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Use refs for animated values to access their current value
    const scale = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    // Track swipe gesture state
    const [isSwipingHorizontally, setIsSwipingHorizontally] = useState(false);
    const [startX, setStartX] = useState(0);

    // Store current scale value
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

            if (gestureState.numberActiveTouches === 2) {
                // Handle pinch zoom
                const distance = Math.sqrt(
                    Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)
                );
                const newScale = Math.max(1, Math.min(3, 1 + distance / 200));
                scale.setValue(newScale);
            } else if (currentScale > 1) {
                // Handle pan when zoomed in
                translateX.setValue(gestureState.dx);
                translateY.setValue(gestureState.dy);
            } else if (isSwipingHorizontally) {
                // Handle horizontal swipe
                translateX.setValue(gestureState.dx);
            }
        },
        onPanResponderRelease: (_, gestureState) => {
            if (currentScale > 1) {
                // Reset pan position when zoomed
                Animated.parallel([
                    Animated.spring(scale, {
                        toValue: 1,
                        useNativeDriver: true,
                    }),
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }),
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

    const handleBackgroundPress = (event: GestureResponderEvent) => {
        // Only close if the press is directly on the background
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    if (!visible || images.length === 0) return null;

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
            </View>
        </Modal>
    );
};