// Media Viewer Screen - TikTok/Reels style full-screen viewer (Refactored)

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../../components/IconButton';
import { SCREEN_WIDTH, SCREEN_HEIGHT, DOUBLE_TAP_DELAY } from './constants';
import { useMutePreference } from './hooks/useMutePreference';
import { useMediaPlayback } from './hooks/useMediaPlayback';
import { useMediaInteractions } from './hooks/useMediaInteractions';
import { VideoPlayer } from './components/VideoPlayer';
import { MediaInfo } from './components/MediaInfo';
import { ActionsSidebar } from './components/ActionsSidebar';
import { CommentsModal } from './components/CommentsModal';
import type { MediaItem } from '../../types';

type RouteParams = {
  MediaViewer: {
    items: MediaItem[];
    initialIndex: number;
  };
};

export default function MediaViewerScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'MediaViewer'>>();
  const { items, initialIndex } = route.params;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [localMediaItems, setLocalMediaItems] = useState(items);
  const flatListRef = useRef<FlatList>(null);
  const videoRefs = useRef<{ [key: string]: any }>({});
  const heartAnimation = useRef(new Animated.Value(0)).current;
  const lastTap = useRef<number | null>(null);
  const singleTapTimeout = useRef<NodeJS.Timeout | null>(null);

  const currentItem = useMemo(
    () => localMediaItems[currentIndex],
    [localMediaItems, currentIndex]
  );

  // Custom hooks
  const { isMuted, toggleMute } = useMutePreference(localMediaItems, currentIndex);
  const {
    isBuffering,
    showControls,
    userPausedMapRef,
    progressRef,
    bufferedRef,
    togglePlayPause,
  } = useMediaPlayback(localMediaItems, currentIndex, videoRefs);

  const {
    showComments,
    setShowComments,
    commentText,
    setCommentText,
    handleLike,
    handleBookmark,
    handleComment,
    handleSendComment,
    handleShare,
    formatCount,
  } = useMediaInteractions(localMediaItems, setLocalMediaItems, currentIndex);

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80,
  }).current;

  const animateHeart = useCallback(() => {
    heartAnimation.setValue(0);
    Animated.sequence([
      Animated.spring(heartAnimation, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(heartAnimation, {
        toValue: 0,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heartAnimation]);

  const handleDoubleTap = useCallback(() => {
    if (!currentItem?.isLiked) {
      handleLike();
    }
    animateHeart();
  }, [currentItem, animateHeart, handleLike]);

  const renderMediaItem = useCallback(
    ({ item, index }: { item: MediaItem; index: number }) => {
      const isActive = index === currentIndex;

      // Fixed tap logic: cancel single-tap if double-tap detected
      const handleTap = () => {
        const now = Date.now();
        if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
          // Double tap detected
          if (singleTapTimeout.current) {
            clearTimeout(singleTapTimeout.current);
            singleTapTimeout.current = null;
          }
          lastTap.current = null;
          handleDoubleTap();
          return;
        }
        // Schedule single tap
        lastTap.current = now;
        singleTapTimeout.current = setTimeout(() => {
          togglePlayPause(item.id);
          singleTapTimeout.current = null;
        }, DOUBLE_TAP_DELAY);
      };

      return (
        <Pressable style={styles.mediaContainer} onPress={handleTap}>
          <VideoPlayer
            item={item}
            isActive={isActive}
            isMuted={isMuted}
            isBuffering={isBuffering}
            showControls={showControls}
            userPaused={!!userPausedMapRef.current[item.id]}
            progressPercent={progressRef.current[item.id] || 0}
            bufferedPercent={bufferedRef.current[item.id] || 0}
            videoRef={(ref) => {
              if (ref) videoRefs.current[item.id] = ref;
            }}
            onTogglePlayPause={() => togglePlayPause(item.id)}
          />

          {/* Top Bar */}
          <View style={styles.topBar}>
            <SafeAreaView edges={['top']} style={styles.topSafeArea}>
              <IconButton
                icon="close"
                size={28}
                color="#FFFFFF"
                backgroundColor="rgba(0, 0, 0, 0.5)"
                onPress={() => navigation.goBack()}
              />
            </SafeAreaView>
          </View>

          {/* Mute Button - positioned outside Pressable tap area like close button */}
          {isActive && item.type === 'video' && (
            <View style={styles.muteButtonContainer} pointerEvents="box-none">
              <IconButton
                icon={isMuted ? 'volume-mute' : 'volume-high'}
                size={20}
                color="#FFFFFF"
                backgroundColor="rgba(0, 0, 0, 0.4)"
                onPress={() => toggleMute(item.id)}
              />
            </View>
          )}

          <MediaInfo item={item} />

          <ActionsSidebar
            item={item}
            onLike={handleLike}
            onComment={handleComment}
            onBookmark={handleBookmark}
            onShare={handleShare}
            formatCount={formatCount}
          />

          {/* Double-tap Heart Animation */}
          {isActive && (
            <Animated.View
              style={[
                styles.heartAnimation,
                {
                  opacity: heartAnimation,
                  transform: [
                    {
                      scale: heartAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.2],
                      }),
                    },
                  ],
                },
              ]}
              pointerEvents="none"
            >
              <Ionicons name="heart" size={120} color="#EF4444" />
            </Animated.View>
          )}
        </Pressable>
      );
    },
    [
      currentIndex,
      handleLike,
      handleBookmark,
      handleComment,
      handleShare,
      formatCount,
      heartAnimation,
      navigation,
      handleDoubleTap,
      isMuted,
      isBuffering,
      showControls,
      togglePlayPause,
      toggleMute,
      userPausedMapRef,
      progressRef,
      bufferedRef,
    ]
  );

  const keyExtractor = useCallback((item: MediaItem) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: SCREEN_HEIGHT,
      offset: SCREEN_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={localMediaItems}
        renderItem={renderMediaItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        initialScrollIndex={initialIndex}
        getItemLayout={getItemLayout}
        onScrollToIndexFailed={() => {}}
        removeClippedSubviews
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
      />

      <CommentsModal
        visible={showComments}
        commentCount={currentItem?.comments || 0}
        commentText={commentText}
        onChangeText={setCommentText}
        onClose={() => setShowComments(false)}
        onSend={handleSendComment}
        formatCount={formatCount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  topSafeArea: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  muteButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 100,
  },
  heartAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -60,
    marginLeft: -60,
  },
});
