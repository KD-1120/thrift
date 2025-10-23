import React, { useState, useEffect, useMemo } from 'react';
import { View, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, VideoPlayer as ExpoVideoPlayer } from 'expo-video';
import type { MediaItem } from '../../../types';

interface VideoPlayerProps {
  item: MediaItem;
  isActive: boolean;
  isMuted: boolean;
  isBuffering: boolean;
  showControls: boolean;
  userPaused: boolean;
  progressPercent: number;
  bufferedPercent: number;
  videoRef: (ref: any) => void;
  onTogglePlayPause: () => void;
}

export function VideoPlayer({
  item,
  isActive,
  isMuted,
  isBuffering,
  showControls,
  userPaused,
  progressPercent,
  bufferedPercent,
  videoRef,
  onTogglePlayPause,
}: VideoPlayerProps) {

  // Create VideoPlayer instance
  const player = useMemo(() => {
    if (item.type === 'video' && item.url) {
      return new ExpoVideoPlayer(item.url);
    }
    return null;
  }, [item.url, item.type]);

  // Control player based on props
  useEffect(() => {
    if (player) {
      if (isActive && !userPaused) {
        player.play();
      } else {
        player.pause();
      }
      
      player.muted = isMuted;
      player.loop = true;
    }
  }, [player, isActive, userPaused, isMuted]);

  // Responsive sizing
  const window = Dimensions.get('window');
  const [videoSize, setVideoSize] = useState({ width: window.width, height: window.height });

  useEffect(() => {
    setVideoSize({ width: window.width, height: window.height });
  }, [window.width, window.height]);

  if (item.type === 'image') {
    return (
      <View style={styles.mediaContainer}>
        <Image
          source={{ uri: item.url }}
          style={{ width: videoSize.width, height: videoSize.height }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.mediaContainer}>
      {player && (
        <VideoView
          ref={videoRef}
          player={player}
          style={{ width: videoSize.width, height: videoSize.height }}
          contentFit="contain"
          allowsFullscreen={false}
          allowsPictureInPicture={false}
        />
      )}

      {/* Buffering indicator */}
      {isActive && isBuffering && (
        <View style={styles.bufferingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Subtle play/pause control */}
      {isActive && showControls && (
        <View style={styles.controlsOverlay} pointerEvents="box-none">
          <TouchableOpacity style={styles.playPauseBtnSubtle} onPress={onTogglePlayPause}>
            <Ionicons name={userPaused ? 'play' : 'pause'} size={36} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Progress bar */}
      {item.type === 'video' && (
        <View style={styles.progressContainer} pointerEvents="none">
          <View style={[styles.progressBuffered, { width: `${bufferedPercent * 100}%` }]} />
          <View
            style={[
              styles.progressBar,
              { width: `${progressPercent * 100}%`, position: 'absolute', left: 0, top: 0 },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mediaContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  bufferingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  controlsOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 50,
    pointerEvents: 'box-none',
  },
  playPauseBtnSubtle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    zIndex: 60,
  },
  progressBuffered: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#6366F1',
  },
});
