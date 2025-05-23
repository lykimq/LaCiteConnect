import { PanResponder, PanResponderGestureState, Animated } from 'react-native';

interface PanGestureConfig {
    scale: Animated.Value;
    translateX: Animated.Value;
    translateY: Animated.Value;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    canSwipeLeft?: boolean;
    canSwipeRight?: boolean;
}

interface GestureState {
    isSwipingHorizontally: boolean;
    currentScale: number;
}

const SWIPE_THRESHOLD = 50; // Minimum distance to trigger swipe

/**
 * Creates a pan responder for handling image gestures including:
 * - Pinch to zoom
 * - Pan when zoomed
 * - Horizontal swipe navigation
 */
export const createImagePanResponder = ({
    scale,
    translateX,
    translateY,
    onSwipeLeft,
    onSwipeRight,
    canSwipeLeft = true,
    canSwipeRight = true,
}: PanGestureConfig) => {
    let gestureState: GestureState = {
        isSwipingHorizontally: false,
        currentScale: 1,
    };

    // Add scale listener
    scale.addListener(({ value }) => {
        gestureState.currentScale = value;
    });

    return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            // Allow pan responder to capture the gesture if:
            // 1. We're already handling a gesture, or
            // 2. There's significant movement
            return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
        },
        onPanResponderGrant: () => {
            gestureState.isSwipingHorizontally = false;
        },
        onPanResponderMove: (_, currentGesture) => {
            // Determine if this is a horizontal swipe
            if (!gestureState.isSwipingHorizontally && Math.abs(currentGesture.dx) > 10) {
                const isHorizontal = Math.abs(currentGesture.dx) > Math.abs(currentGesture.dy);
                gestureState.isSwipingHorizontally = isHorizontal;
            }

            // Handle pinch zoom
            if (currentGesture.numberActiveTouches === 2) {
                handlePinchZoom(currentGesture, scale);
            } else if (gestureState.currentScale > 1) {
                // Handle pan when zoomed in
                handlePanWhenZoomed(currentGesture, translateX, translateY);
            } else if (gestureState.isSwipingHorizontally) {
                // Handle horizontal swipe
                handleHorizontalSwipe(currentGesture, translateX);
            }
        },
        onPanResponderRelease: (_, currentGesture) => {
            if (gestureState.currentScale > 1) {
                // Reset zoom and pan
                resetZoomAndPan(scale, translateX, translateY);
            } else if (gestureState.isSwipingHorizontally) {
                // Handle swipe navigation
                handleSwipeNavigation(
                    currentGesture,
                    translateX,
                    onSwipeLeft,
                    onSwipeRight,
                    canSwipeLeft,
                    canSwipeRight
                );
            }
        },
        onPanResponderTerminate: () => {
            // Reset position immediately if gesture is terminated
            translateX.setValue(0);
        },
    });
};

// Helper functions for gesture handling
const handlePinchZoom = (
    gestureState: PanResponderGestureState,
    scale: Animated.Value
) => {
    // Calculate the distance between the two touch points
    const distance = Math.sqrt(
        Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)
    );

    // Calculate the new scale based on the distance between the touch points
    const newScale = Math.max(1, Math.min(3, 1 + distance / 200));
    scale.setValue(newScale);
};

const handlePanWhenZoomed = (
    gestureState: PanResponderGestureState,
    translateX: Animated.Value,
    translateY: Animated.Value
) => {
    translateX.setValue(gestureState.dx);
    translateY.setValue(gestureState.dy);
};

const handleHorizontalSwipe = (
    gestureState: PanResponderGestureState,
    translateX: Animated.Value
) => {
    translateX.setValue(gestureState.dx);
};

const resetZoomAndPan = (
    scale: Animated.Value,
    translateX: Animated.Value,
    translateY: Animated.Value
) => {
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
};

const handleSwipeNavigation = (
    gestureState: PanResponderGestureState,
    translateX: Animated.Value,
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    canSwipeLeft?: boolean,
    canSwipeRight?: boolean
) => {
    const swipeDistance = gestureState.dx;

    if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
        if (swipeDistance > 0 && canSwipeRight && onSwipeRight) {
            // Swipe right
            onSwipeRight();
        } else if (swipeDistance < 0 && canSwipeLeft && onSwipeLeft) {
            // Swipe left
            onSwipeLeft();
        }
    }
    // Reset position
    translateX.setValue(0);
};