import { PanResponder, PanResponderGestureState, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PanGestureConfig {
    scale: Animated.Value;
    translateX: Animated.Value;
    translateY: Animated.Value;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    canSwipeLeft?: boolean;
    canSwipeRight?: boolean;
    /**
     * The minimum distance (in pixels) required to trigger a swipe action.
     * Mathematical calculation:
     * - Default = min(max(screenWidth * 0.15, 50), screenWidth * 0.4)
     * - 15% of screen width, but no less than 50px and no more than 40% of screen width
     * - This adaptive threshold ensures consistent feel across different device sizes
     */
    swipeThreshold?: number;
}

interface GestureState {
    isSwipingHorizontally: boolean;
    currentScale: number;
}

// Calculate default swipe threshold based on screen width
// Uses min-max normalization to keep threshold within reasonable bounds:
// - Minimum: 50px (prevents accidental swipes)
// - Default: 15% of screen width
// - Maximum: 40% of screen width
const DEFAULT_SWIPE_THRESHOLD = Math.min(
    Math.max(SCREEN_WIDTH * 0.15, 50),
    SCREEN_WIDTH * 0.4
);

/**
 * Creates a pan responder for handling image gestures including:
 * - Pinch to zoom: Uses Pythagorean theorem to calculate touch distance
 * - Pan when zoomed: Direct mapping of gesture movement to translation
 * - Horizontal swipe: Compares dx vs dy to determine swipe direction
 *
 * Mathematical concepts used:
 * 1. Vector magnitude (distance): sqrt(dx² + dy²)
 * 2. Directional comparison: |dx| > |dy| for horizontal detection
 * 3. Scale normalization: Bounded between 1.0 and 3.0
 * 4. Threshold detection: Using absolute values for bidirectional movement
 */
export const createImagePanResponder = ({
    scale,
    translateX,
    translateY,
    onSwipeLeft,
    onSwipeRight,
    canSwipeLeft = true,
    canSwipeRight = true,
    swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
}: PanGestureConfig) => {
    let gestureState: GestureState = {
        isSwipingHorizontally: false,
        currentScale: 1,
    };

    // Track scale changes for zoom state
    scale.addListener(({ value }) => {
        gestureState.currentScale = value;
    });

    return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            // Detect significant movement using vector magnitude comparison
            // |movement| > 2 in either direction (dx or dy)
            return Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2;
        },
        onPanResponderGrant: () => {
            gestureState.isSwipingHorizontally = false;
        },
        onPanResponderMove: (_, currentGesture) => {
            // Determine swipe direction using vector component comparison
            // Horizontal if: |dx| > |dy| and |dx| > 10px minimum threshold
            if (!gestureState.isSwipingHorizontally && Math.abs(currentGesture.dx) > 10) {
                const isHorizontal = Math.abs(currentGesture.dx) > Math.abs(currentGesture.dy);
                gestureState.isSwipingHorizontally = isHorizontal;
            }

            // Handle different gesture types based on touch count and scale
            if (currentGesture.numberActiveTouches === 2) {
                handlePinchZoom(currentGesture, scale);
            } else if (gestureState.currentScale > 1) {
                // Direct 1:1 mapping of gesture movement to translation
                handlePanWhenZoomed(currentGesture, translateX, translateY);
            } else if (gestureState.isSwipingHorizontally) {
                // Direct mapping of horizontal movement
                handleHorizontalSwipe(currentGesture, translateX);
            }
        },
        onPanResponderRelease: (_, currentGesture) => {
            if (gestureState.currentScale > 1) {
                resetZoomAndPan(scale, translateX, translateY);
            } else if (gestureState.isSwipingHorizontally) {
                handleSwipeNavigation(
                    currentGesture,
                    translateX,
                    onSwipeLeft,
                    onSwipeRight,
                    canSwipeLeft,
                    canSwipeRight,
                    swipeThreshold
                );
            }
        },
        onPanResponderTerminate: () => {
            translateX.setValue(0);
        },
    });
};

/**
 * Calculates and applies zoom scale based on touch distance
 * Mathematical formula:
 * 1. Distance = sqrt(dx² + dy²) [Pythagorean theorem]
 * 2. Scale = 1 + (distance / 200) [Linear mapping]
 * 3. Bounded scale = max(1, min(3, scale)) [Normalization]
 */
const handlePinchZoom = (
    gestureState: PanResponderGestureState,
    scale: Animated.Value
) => {
    // Calculate distance between touch points using Pythagorean theorem
    const distance = Math.sqrt(
        Math.pow(gestureState.dx, 2) + Math.pow(gestureState.dy, 2)
    );

    // Map distance to scale factor (1.0 to 3.0)
    const newScale = Math.max(1, Math.min(3, 1 + distance / 200));
    scale.setValue(newScale);
};

/**
 * Handles panning when image is zoomed
 * Uses 1:1 mapping of gesture movement to translation
 * dx → translateX, dy → translateY
 */
const handlePanWhenZoomed = (
    gestureState: PanResponderGestureState,
    translateX: Animated.Value,
    translateY: Animated.Value
) => {
    translateX.setValue(gestureState.dx);
    translateY.setValue(gestureState.dy);
};

/**
 * Handles horizontal swipe movement
 * Direct 1:1 mapping of horizontal gesture movement (dx)
 */
const handleHorizontalSwipe = (
    gestureState: PanResponderGestureState,
    translateX: Animated.Value
) => {
    translateX.setValue(gestureState.dx);
};

/**
 * Resets zoom and pan with spring animation
 * Uses parallel animations to reset all transformations:
 * - scale → 1.0 (original size)
 * - translateX → 0 (horizontal center)
 * - translateY → 0 (vertical center)
 */
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

/**
 * Handles swipe navigation based on gesture distance
 * Mathematical checks:
 * 1. |swipeDistance| > threshold [Magnitude comparison]
 * 2. swipeDistance > 0 [Right swipe]
 * 3. swipeDistance < 0 [Left swipe]
 */
const handleSwipeNavigation = (
    gestureState: PanResponderGestureState,
    translateX: Animated.Value,
    onSwipeLeft?: () => void,
    onSwipeRight?: () => void,
    canSwipeLeft?: boolean,
    canSwipeRight?: boolean,
    swipeThreshold: number = DEFAULT_SWIPE_THRESHOLD
) => {
    const swipeDistance = gestureState.dx;

    // Check if swipe distance exceeds threshold
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && canSwipeRight && onSwipeRight) {
            // Positive distance = right swipe
            onSwipeRight();
        } else if (swipeDistance < 0 && canSwipeLeft && onSwipeLeft) {
            // Negative distance = left swipe
            onSwipeLeft();
        }
    }
    // Reset translation
    translateX.setValue(0);
};