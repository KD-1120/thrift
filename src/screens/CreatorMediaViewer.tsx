// TikTok-Style Media Viewer for Content Creators
// Features: Swipeable carousel, engagement metrics, creator controls, analytics

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, VideoPlayer as ExpoVideoPlayer } from 'expo-video';
import { colors } from '../design-system/colors';
import { spacing, radius } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';
import type { MediaItem } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RouteParams {
  items: MediaItem[];
  initialIndex?: number;
}

export default function CreatorMediaViewerScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { items = [], initialIndex = 0 } = (route.params as RouteParams) || {};
  
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showStats, setShowStats] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const videoRefs = useRef<{ [key: string]: VideoView }>({});
  const playersRef = useRef<{ [key: string]: ExpoVideoPlayer }>({});
  const statsCloseButtonRef = useRef<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Create VideoPlayer instances for video items
  const players = useMemo(() => {
    const newPlayers: { [key: string]: ExpoVideoPlayer } = {};
    items.forEach((item) => {
      if (item.type === 'video' && item.url && !playersRef.current[item.id]) {
        newPlayers[item.id] = new ExpoVideoPlayer(item.url);
        newPlayers[item.id].loop = true;
        newPlayers[item.id].muted = false;
      }
    });
    return newPlayers;
  }, [items]);

  // Store players in ref
  useEffect(() => {
    Object.assign(playersRef.current, players);
  }, [players]);

  // Control video playback based on current index
  useEffect(() => {
    const currentItem = items[currentIndex];
    if (currentItem?.type === 'video' && currentItem.url) {
      const currentPlayer = playersRef.current[currentItem.id];
      if (currentPlayer) {
        currentPlayer.play();
      }
    }

    // Pause other videos
    Object.entries(playersRef.current).forEach(([id, player]) => {
      if (id !== currentItem?.id) {
        player.pause();
      }
    });
  }, [currentIndex, items]);

  // Handle scroll to update current index (TikTok-style vertical paging)
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / SCREEN_HEIGHT);
    if (index !== currentIndex && index >= 0 && index < items.length) {
      setCurrentIndex(index);
    }
  };

  const currentItem = items[currentIndex] || null;

  // Toggle stats panel
  const toggleStats = useCallback(() => {
    const willOpen = !showStats;

    // On web, if an element is focused and the UI will set aria-hidden on
    // an ancestor, blur the focused element first to avoid accessibility
    // warnings like "ancestor has aria-hidden while descendant retained focus".
    if (willOpen && Platform.OS === 'web' && typeof (globalThis as any).document !== 'undefined') {
      try {
        const active = (globalThis as any).document.activeElement as HTMLElement | null;
        if (active && typeof (active as any).blur === 'function') {
          (active as any).blur();
        }
      } catch (e) {
        // ignore
      }
    }

    const toValue = willOpen ? 1 : 0;
    setShowStats(willOpen);
    Animated.spring(fadeAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start(() => {
      // After opening, focus the close button in the stats panel for keyboard users
      if (willOpen && statsCloseButtonRef.current && typeof statsCloseButtonRef.current.focus === 'function') {
        try {
          statsCloseButtonRef.current.focus();
        } catch (e) {
          // ignore
        }
      }
    });
  }, [showStats, fadeAnim]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateEngagementRate = (item: MediaItem): string => {
    const total = item.likes + item.comments + item.shares;
    // Assuming views would be ~10x engagement
    const estimatedViews = total * 10;
    const rate = estimatedViews > 0 ? (total / estimatedViews) * 100 : 0;
    return rate.toFixed(1);
  };

  if (!items || items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <TouchableOpacity 
            style={styles.errorBackButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.errorText}>No media to display</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <TouchableOpacity 
            style={styles.errorBackButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.errorText}>Media not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Media Content Area - TikTok-style Vertical Scroll */}
      <ScrollView
        ref={scrollViewRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
      >
        {items.map((item, _index) => (
          <View key={item.id} style={styles.mediaContainer}>
            {/* Actual Media Display */}
            {item.type === 'video' && item.url ? (
              <VideoView
                ref={(ref) => {
                  if (ref) videoRefs.current[item.id] = ref;
                }}
                player={playersRef.current[item.id]}
                style={styles.media}
                contentFit="contain"
                allowsFullscreen={false}
                allowsPictureInPicture={false}
              />
            ) : (
              <Image 
                source={{ uri: item.thumbnailUrl || item.url }} 
                style={styles.media}
                resizeMode="contain"
              />
            )}

            {/* Caption Overlay */}
            {item.caption && (
              <View style={styles.captionOverlay}>
                <Text style={styles.captionText}>{item.caption}</Text>
              </View>
            )}

            {/* Type Indicator */}
            {item.type === 'video' && (
              <View style={styles.typeBadge}>
                <Ionicons name="videocam" size={16} color="#fff" />
                <Text style={styles.typeBadgeText}>VIDEO</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Top Bar - Creator Controls */}
      <SafeAreaView style={styles.topBar} edges={['top']}>
        <View style={styles.topBarContent}>
          <TouchableOpacity 
            style={styles.topBarButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <View style={styles.topBarCenter}>
            <Text style={styles.topBarTitle}>My Portfolio</Text>
            <Text style={styles.topBarSubtitle}>
              {currentIndex + 1} of {items.length}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.topBarButton}
            onPress={() => {/* Edit functionality */}}
          >
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Right Side Panel - TikTok Style Actions */}
      <View style={styles.rightPanel}>
        {/* Stats Toggle */}
        <TouchableOpacity style={styles.actionButton} onPress={toggleStats}>
          <View style={styles.actionIconContainer}>
            <Ionicons 
              name={showStats ? "analytics" : "analytics-outline"} 
              size={28} 
              color="#fff" 
            />
          </View>
          <Text style={styles.actionLabel}>Stats</Text>
        </TouchableOpacity>

        {/* Likes */}
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="heart" size={28} color={colors.error.main} />
          </View>
          <Text style={styles.actionValue}>{formatNumber(currentItem.likes)}</Text>
        </TouchableOpacity>

        {/* Comments */}
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="chatbubble" size={26} color="#fff" />
          </View>
          <Text style={styles.actionValue}>{formatNumber(currentItem.comments)}</Text>
        </TouchableOpacity>

        {/* Shares */}
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="arrow-redo" size={26} color="#fff" />
          </View>
          <Text style={styles.actionValue}>{formatNumber(currentItem.shares)}</Text>
        </TouchableOpacity>

        {/* More Options */}
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="ellipsis-horizontal" size={26} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Info Panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.authorInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {currentItem.author.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{currentItem.author.name}</Text>
            <Text style={styles.itemCaption} numberOfLines={2}>
              {currentItem.caption}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Overlay Panel */}
      {showStats && (
        <Animated.View 
          accessible
          accessibilityViewIsModal={true}
          accessibilityLabel="Performance insights panel"
          style={[
            styles.statsPanel,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            },
          ]}
        >
          <View style={styles.statsPanelHeader}>
            <Text style={styles.statsPanelTitle}>Performance Insights</Text>
            <TouchableOpacity onPress={toggleStats} ref={statsCloseButtonRef} accessibilityLabel="Close insights panel">
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.statsContent}>
            {/* Engagement Rate */}
            <View style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <Ionicons name="trending-up" size={24} color={colors.primary[600]} />
                <Text style={styles.statCardTitle}>Engagement Rate</Text>
              </View>
              <Text style={styles.statCardValue}>{calculateEngagementRate(currentItem)}%</Text>
              <Text style={styles.statCardSubtext}>
                Based on likes, comments, and shares
              </Text>
            </View>

            {/* Total Interactions */}
            <View style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <Ionicons name="flame" size={24} color={colors.semantic.warning} />
                <Text style={styles.statCardTitle}>Total Interactions</Text>
              </View>
              <Text style={styles.statCardValue}>
                {formatNumber(currentItem.likes + currentItem.comments + currentItem.shares)}
              </Text>
              <View style={styles.statBreakdown}>
                <View style={styles.statBreakdownItem}>
                  <Ionicons name="heart" size={16} color={colors.error.main} />
                  <Text style={styles.statBreakdownText}>{formatNumber(currentItem.likes)}</Text>
                </View>
                <View style={styles.statBreakdownItem}>
                  <Ionicons name="chatbubble" size={16} color={colors.info.main} />
                  <Text style={styles.statBreakdownText}>{formatNumber(currentItem.comments)}</Text>
                </View>
                <View style={styles.statBreakdownItem}>
                  <Ionicons name="arrow-redo" size={16} color={colors.success.main} />
                  <Text style={styles.statBreakdownText}>{formatNumber(currentItem.shares)}</Text>
                </View>
              </View>
            </View>

            {/* Created Date */}
            <View style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <Ionicons name="calendar-outline" size={24} color={colors.text.secondary} />
                <Text style={styles.statCardTitle}>Published</Text>
              </View>
              <Text style={styles.statCardSubtext}>
                {new Date(currentItem.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>

            {/* Actions */}
            <View style={styles.actionsCard}>
              <TouchableOpacity style={styles.actionCardButton}>
                <Ionicons name="share-social-outline" size={22} color={colors.primary[600]} />
                <Text style={styles.actionCardButtonText}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCardButton}>
                <Ionicons name="download-outline" size={22} color={colors.primary[600]} />
                <Text style={styles.actionCardButtonText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionCardButton, styles.deleteButton]}>
                <Ionicons name="trash-outline" size={22} color={colors.error.main} />
                <Text style={[styles.actionCardButtonText, styles.deleteButtonText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexDirection: 'column',
  },
  mediaContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 120,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: spacing.md,
    borderRadius: radius.md,
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  mediaPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  mediaPlaceholderText: {
    fontSize: 80,
    marginBottom: spacing.xl,
  },
  mediaCaption: {
    ...textStyles.h3,
    color: '#fff',
    textAlign: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: 100,
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  typeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Top Bar
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  topBarButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topBarTitle: {
    ...textStyles.bodyMedium,
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  topBarSubtitle: {
    ...textStyles.small,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginTop: 2,
  },

  // Right Panel - TikTok Style
  rightPanel: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 120,
    gap: spacing.xl,
    zIndex: 10,
  },
  actionButton: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    ...textStyles.small,
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  actionValue: {
    ...textStyles.small,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  // Bottom Panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 5,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    ...textStyles.bodyMedium,
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    ...textStyles.bodyMedium,
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  itemCaption: {
    ...textStyles.body,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },

  // Stats Panel
  statsPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.7,
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
    zIndex: 20,
  },
  statsPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  statsPanelTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  statsContent: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCardTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  statCardValue: {
    ...textStyles.h2,
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  statCardSubtext: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontSize: 14,
  },
  statBreakdown: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  statBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statBreakdownText: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  actionsCard: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },
  actionCardButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary[50],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  actionCardButtonText: {
    ...textStyles.bodyMedium,
    color: colors.primary[700],
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.error[50],
    borderColor: colors.error[200],
  },
  deleteButtonText: {
    color: colors.error[700],
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorBackButton: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...textStyles.body,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
