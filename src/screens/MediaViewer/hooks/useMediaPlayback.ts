import { useRef, useEffect, useState, useCallback } from 'react';
import { CONTROLS_HIDE_DELAY } from '../constants';
import type { MediaItem } from '../../../types';

export function useMediaPlayback(
  localMediaItems: MediaItem[],
  currentIndex: number,
  videoRefs: React.MutableRefObject<{ [key: string]: any }>
) {
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const bufferingRef = useRef<Record<string, boolean>>({});
  const userPausedMapRef = useRef<Record<string, boolean>>({});
  const progressRef = useRef<Record<string, number>>({});
  const bufferedRef = useRef<Record<string, number>>({});

  // Play/pause videos based on which item is currently visible
  useEffect(() => {
    try {
      Object.keys(videoRefs.current).forEach((id) => {
        const ref = videoRefs.current[id];
        if (!ref) return;
        const isCurrent = localMediaItems[currentIndex]?.id === id;
        if (isCurrent) {
          if (typeof ref.play === 'function') ref.play().catch(() => {});
        } else {
          if (typeof ref.pause === 'function') ref.pause().catch(() => {});
        }
      });
    } catch (e) {
      // swallow - best-effort
    }
    const currentId = localMediaItems[currentIndex]?.id;
    setIsBuffering(Boolean(bufferingRef.current[currentId]));
  }, [currentIndex, localMediaItems, videoRefs]);

  // Preload adjacent videos - expo-video handles this automatically
  useEffect(() => {
    // No need to manually preload with expo-video
  }, [currentIndex, localMediaItems, videoRefs]);

  const togglePlayPause = useCallback(
    async (id?: string) => {
      const curId = id || localMediaItems[currentIndex]?.id;
      if (!curId) return;
      const ref = videoRefs.current[curId];
      const paused = !!userPausedMapRef.current[curId];
      try {
        if (paused) {
          if (ref && typeof ref.play === 'function') await ref.play();
          userPausedMapRef.current[curId] = false;
        } else {
          if (ref && typeof ref.pause === 'function') await ref.pause();
          userPausedMapRef.current[curId] = true;
        }
        setShowControls(true);
        setTimeout(() => setShowControls(false), CONTROLS_HIDE_DELAY);
      } catch (e) {
        // ignore
      }
    },
    [currentIndex, localMediaItems, videoRefs]
  );

  const handlePlaybackStatusUpdate = useCallback(
    (_itemId: string, _status: any) => {
      // Simplified status handling for expo-video
      // expo-video handles buffering and progress internally
    },
    []
  );

  return {
    isBuffering,
    showControls,
    userPausedMapRef,
    progressRef,
    bufferedRef,
    togglePlayPause,
    handlePlaybackStatusUpdate,
  };
}
