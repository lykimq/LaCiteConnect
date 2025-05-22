import React, { useState } from 'react';
import {
    View,
    Modal,
    Image,
    TouchableOpacity,
    Animated,
    PanResponder,
    GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createPhotoDetailsModalStyles } from '../../styles/events/PhotoDetailsModal.styles';

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
    const [scale] = useState(new Animated.Value(1));
    const [translateX] = useState(new Animated.Value(0));
    const [translateY] = useState(new Animated.Value(0));

    // Pan responder for handling zoom and pan gestures
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (gestureState.numberActiveTouches === 2) {
                // Handle pinch zoom
                const distance = Math.sqrt(
                    Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)
                );
                const newScale = Math.max(1, Math.min(3, 1 + distance / 200));
                scale.setValue(newScale);
            } else {
                // Handle pan
                translateX.setValue(gestureState.dx);
                translateY.setValue(gestureState.dy);
            }
        },
        onPanResponderRelease: () => {
            // Reset to original position and scale
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
        },
    });

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

                {/* Photo container with zoom and pan capabilities */}
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