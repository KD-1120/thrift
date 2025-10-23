import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MUTE_PREF_PREFIX, sessionMuteMap } from '../constants';
import type { MediaItem } from '../../../types';

export function useMutePreference(
  localMediaItems: MediaItem[],
  currentIndex: number
) {
  const [isMuted, setIsMuted] = useState(true);

  // Load persisted mute prefs once when items are available
  useEffect(() => {
    let mounted = true;
    const loadedFlag = { done: false };

    const loadPrefs = async () => {
      if (loadedFlag.done) return;
      try {
        for (const item of localMediaItems) {
          const key = MUTE_PREF_PREFIX + item.id;
          let val: string | null = null;
          try {
            if (SecureStore && SecureStore.getItemAsync) {
              val = await SecureStore.getItemAsync(key);
            }
          } catch (e) {
            // ignore secure store error
          }
          if ((val === null || val === undefined) && AsyncStorage) {
            try {
              val = await AsyncStorage.getItem(key);
            } catch (e) {}
          }
          if (val !== null && val !== undefined) {
            sessionMuteMap.set(item.id, val === '1');
          }
        }
        loadedFlag.done = true;
        if (mounted) {
          const id = localMediaItems[currentIndex]?.id;
          if (id) {
            const pref = sessionMuteMap.get(id);
            if (pref !== undefined) setIsMuted(pref);
          }
        }
      } catch (e) {
        // ignore storage errors
      }
    };

    if (localMediaItems && localMediaItems.length > 0) loadPrefs();
    return () => {
      mounted = false;
    };
  }, [localMediaItems, currentIndex]);

  // When current item changes, restore per-session mute preference
  useEffect(() => {
    const id = localMediaItems[currentIndex]?.id;
    if (id) {
      const pref = sessionMuteMap.get(id);
      if (pref !== undefined) setIsMuted(pref);
      else setIsMuted(true); // default mute
    }
  }, [currentIndex, localMediaItems]);

  const toggleMute = useCallback(
    async (id: string) => {
      try {
        const current = sessionMuteMap.get(id);
        const next = !(current === undefined ? isMuted : current);
        sessionMuteMap.set(id, next);
        setIsMuted(next);
        const key = MUTE_PREF_PREFIX + id;
        try {
          if (SecureStore && SecureStore.setItemAsync) {
            await SecureStore.setItemAsync(key, next ? '1' : '0');
          } else {
            await AsyncStorage.setItem(key, next ? '1' : '0');
          }
        } catch (e) {
          // ignore storage errors
        }
      } catch (e) {
        // ignore
      }
    },
    [isMuted]
  );

  return { isMuted, setIsMuted, toggleMute };
}
