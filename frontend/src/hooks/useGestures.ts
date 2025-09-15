import { useRef, useCallback, useEffect, useState } from 'react';

interface GestureState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  velocityX: number;
  velocityY: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
  isActive: boolean;
  startTime: number;
}

interface GestureOptions {
  threshold?: number;
  velocityThreshold?: number;
  preventDefault?: boolean;
  passive?: boolean;
}

interface SwipeOptions extends GestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipe?: (direction: 'left' | 'right' | 'up' | 'down') => void;
}

interface PinchOptions extends GestureOptions {
  onPinch?: (scale: number, centerX: number, centerY: number) => void;
  onPinchStart?: () => void;
  onPinchEnd?: () => void;
}

interface DragOptions extends GestureOptions {
  onDrag?: (deltaX: number, deltaY: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

// Custom hook for swipe gestures
export const useSwipe = (options: SwipeOptions = {}) => {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    preventDefault = true,
    passive = false,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipe,
  } = options;

  const [gestureState, setGestureState] = useState<GestureState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocityX: 0,
    velocityY: 0,
    direction: null,
    isActive: false,
    startTime: 0,
  });

  const lastTouchRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (preventDefault) event.preventDefault();
    
    const touch = event.touches[0];
    const startTime = Date.now();
    
    setGestureState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      velocityX: 0,
      velocityY: 0,
      direction: null,
      isActive: true,
      startTime,
    });

    lastTouchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: startTime,
    };
  }, [preventDefault]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!gestureState.isActive) return;
    if (preventDefault) event.preventDefault();

    const touch = event.touches[0];
    const currentTime = Date.now();
    
    const deltaX = touch.clientX - gestureState.startX;
    const deltaY = touch.clientY - gestureState.startY;
    
    // Calculate velocity
    let velocityX = 0;
    let velocityY = 0;
    
    if (lastTouchRef.current) {
      const timeDelta = currentTime - lastTouchRef.current.time;
      if (timeDelta > 0) {
        velocityX = (touch.clientX - lastTouchRef.current.x) / timeDelta;
        velocityY = (touch.clientY - lastTouchRef.current.y) / timeDelta;
      }
    }

    // Determine direction
    let direction: 'left' | 'right' | 'up' | 'down' | null = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    setGestureState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX,
      deltaY,
      velocityX,
      velocityY,
      direction,
    }));

    lastTouchRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: currentTime,
    };
  }, [gestureState.isActive, gestureState.startX, gestureState.startY, preventDefault]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!gestureState.isActive) return;
    if (preventDefault) event.preventDefault();

    const { deltaX, deltaY, velocityX, velocityY, direction } = gestureState;
    
    // Check if swipe meets threshold requirements
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    
    if (distance >= threshold && velocity >= velocityThreshold && direction) {
      // Trigger appropriate callback
      switch (direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
      onSwipe?.(direction);
    }

    // Reset gesture state
    setGestureState(prev => ({
      ...prev,
      isActive: false,
    }));
  }, [gestureState, threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSwipe, preventDefault]);

  return {
    gestureState,
    bind: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

// Custom hook for pinch gestures
export const usePinch = (options: PinchOptions = {}) => {
  const {
    threshold = 0.1,
    preventDefault = true,
    passive = false,
    onPinch,
    onPinchStart,
    onPinchEnd,
  } = options;

  const [pinchState, setPinchState] = useState({
    scale: 1,
    centerX: 0,
    centerY: 0,
    isActive: false,
    initialDistance: 0,
    initialScale: 1,
  });

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length !== 2) return;
    if (preventDefault) event.preventDefault();

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;

    setPinchState({
      scale: 1,
      centerX,
      centerY,
      isActive: true,
      initialDistance: distance,
      initialScale: 1,
    });

    onPinchStart?.();
  }, [preventDefault, onPinchStart]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!pinchState.isActive || event.touches.length !== 2) return;
    if (preventDefault) event.preventDefault();

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    
    const distance = Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
    
    const centerX = (touch1.clientX + touch2.clientX) / 2;
    const centerY = (touch1.clientY + touch2.clientY) / 2;
    
    const scale = distance / pinchState.initialDistance;
    const scaleDelta = scale - pinchState.initialScale;

    if (Math.abs(scaleDelta) >= threshold) {
      setPinchState(prev => ({
        ...prev,
        scale,
        centerX,
        centerY,
      }));

      onPinch?.(scale, centerX, centerY);
    }
  }, [pinchState.isActive, pinchState.initialDistance, pinchState.initialScale, threshold, preventDefault, onPinch]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!pinchState.isActive) return;
    if (preventDefault) event.preventDefault();

    setPinchState(prev => ({
      ...prev,
      isActive: false,
    }));

    onPinchEnd?.();
  }, [pinchState.isActive, preventDefault, onPinchEnd]);

  return {
    pinchState,
    bind: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

// Custom hook for drag gestures
export const useDrag = (options: DragOptions = {}) => {
  const {
    threshold = 5,
    preventDefault = true,
    passive = false,
    onDrag,
    onDragStart,
    onDragEnd,
  } = options;

  const [dragState, setDragState] = useState({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    isActive: false,
    isDragging: false,
  });

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (preventDefault) event.preventDefault();
    
    const touch = event.touches[0];
    
    setDragState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
      isActive: true,
      isDragging: false,
    });
  }, [preventDefault]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!dragState.isActive) return;
    if (preventDefault) event.preventDefault();

    const touch = event.touches[0];
    const deltaX = touch.clientX - dragState.startX;
    const deltaY = touch.clientY - dragState.startY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const isDragging = distance >= threshold;

    if (!dragState.isDragging && isDragging) {
      onDragStart?.();
    }

    setDragState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX,
      deltaY,
      isDragging,
    }));

    if (isDragging) {
      onDrag?.(deltaX, deltaY);
    }
  }, [dragState.isActive, dragState.startX, dragState.startY, dragState.isDragging, threshold, preventDefault, onDrag, onDragStart]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!dragState.isActive) return;
    if (preventDefault) event.preventDefault();

    if (dragState.isDragging) {
      onDragEnd?.();
    }

    setDragState(prev => ({
      ...prev,
      isActive: false,
      isDragging: false,
    }));
  }, [dragState.isActive, dragState.isDragging, preventDefault, onDragEnd]);

  return {
    dragState,
    bind: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

// Custom hook for mouse gestures (for desktop)
export const useMouseGestures = (options: SwipeOptions = {}) => {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    preventDefault = true,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipe,
  } = options;

  const [gestureState, setGestureState] = useState<GestureState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocityX: 0,
    velocityY: 0,
    direction: null,
    isActive: false,
    startTime: 0,
  });

  const lastMouseRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleMouseDown = useCallback((event: MouseEvent) => {
    if (preventDefault) event.preventDefault();
    
    const startTime = Date.now();
    
    setGestureState({
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      velocityX: 0,
      velocityY: 0,
      direction: null,
      isActive: true,
      startTime,
    });

    lastMouseRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: startTime,
    };
  }, [preventDefault]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!gestureState.isActive) return;
    if (preventDefault) event.preventDefault();

    const currentTime = Date.now();
    
    const deltaX = event.clientX - gestureState.startX;
    const deltaY = event.clientY - gestureState.startY;
    
    // Calculate velocity
    let velocityX = 0;
    let velocityY = 0;
    
    if (lastMouseRef.current) {
      const timeDelta = currentTime - lastMouseRef.current.time;
      if (timeDelta > 0) {
        velocityX = (event.clientX - lastMouseRef.current.x) / timeDelta;
        velocityY = (event.clientY - lastMouseRef.current.y) / timeDelta;
      }
    }

    // Determine direction
    let direction: 'left' | 'right' | 'up' | 'down' | null = null;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    setGestureState(prev => ({
      ...prev,
      currentX: event.clientX,
      currentY: event.clientY,
      deltaX,
      deltaY,
      velocityX,
      velocityY,
      direction,
    }));

    lastMouseRef.current = {
      x: event.clientX,
      y: event.clientY,
      time: currentTime,
    };
  }, [gestureState.isActive, gestureState.startX, gestureState.startY, preventDefault]);

  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (!gestureState.isActive) return;
    if (preventDefault) event.preventDefault();

    const { deltaX, deltaY, velocityX, velocityY, direction } = gestureState;
    
    // Check if swipe meets threshold requirements
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    
    if (distance >= threshold && velocity >= velocityThreshold && direction) {
      // Trigger appropriate callback
      switch (direction) {
        case 'left':
          onSwipeLeft?.();
          break;
        case 'right':
          onSwipeRight?.();
          break;
        case 'up':
          onSwipeUp?.();
          break;
        case 'down':
          onSwipeDown?.();
          break;
      }
      onSwipe?.(direction);
    }

    // Reset gesture state
    setGestureState(prev => ({
      ...prev,
      isActive: false,
    }));
  }, [gestureState, threshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSwipe, preventDefault]);

  return {
    gestureState,
    bind: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
    },
  };
};

export default {
  useSwipe,
  usePinch,
  useDrag,
  useMouseGestures,
};
