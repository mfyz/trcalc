import { useState, useEffect, useCallback, useRef } from 'react';

interface UseFocusDetectionOptions {
  onHide?: () => void;
}

export function useFocusDetection(options?: UseFocusDetectionOptions) {
  const [isVisible, setIsVisible] = useState(true);
  const [wasHidden, setWasHidden] = useState(false);
  const wasHiddenRef = useRef(false);
  const onHideRef = useRef(options?.onHide);

  // Keep the callback ref updated
  useEffect(() => {
    onHideRef.current = options?.onHide;
  }, [options?.onHide]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);

      if (!visible) {
        wasHiddenRef.current = true;
        setWasHidden(true);
        // Call onHide callback when app goes to background
        onHideRef.current?.();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const resetWasHidden = useCallback(() => {
    wasHiddenRef.current = false;
    setWasHidden(false);
  }, []);

  return { isVisible, wasHidden, resetWasHidden };
}
