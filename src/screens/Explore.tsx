// Explore Screen - Instagram-style Grid

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useGetTailorsQuery } from '../api/tailors.api';
import { IconButton } from '../components/IconButton';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';
import type { MediaItem } from '../types';
import { SAMPLE_VIDEO_URLS } from '../utils/video';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = 3;
const NUM_COLUMNS = 3;
const ITEM_SIZE = (SCREEN_WIDTH - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

type NavigationProp = StackNavigationProp<{
  MediaViewer: { items: MediaItem[]; initialIndex: number };
  Search: undefined;
}>;

// Kept for fallback/reference - can be removed in production
const FALLBACK_MEDIA: MediaItem[] = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    aspectRatio: 1,
    author: { id: 'u1', name: 'Ama\'s Designs', avatar: 'https://i.pravatar.cc/150?img=1' },
    caption: 'Beautiful custom dress for a special occasion 🌟',
    likes: 234,
    comments: 12,
    shares: 5,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
    tags: ['dress', 'custom', 'wedding'],
  },
  {
    id: '2',
    type: 'video',
    url: SAMPLE_VIDEO_URLS.bigBuckBunny,
    thumbnailUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400',
    aspectRatio: 1,
    author: { id: 'u2', name: 'Kofi Couture', avatar: 'https://i.pravatar.cc/150?img=2' },
    caption: 'Quick transformation: From fabric to fashion',
    likes: 567,
    comments: 34,
    shares: 12,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
    duration: 30,
    tags: ['process', 'timelapse'],
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
    aspectRatio: 1,
    author: { id: 'u3', name: 'Efua Fashion', avatar: 'https://i.pravatar.cc/150?img=3' },
    caption: 'Modern Kente designs',
    likes: 892,
    comments: 45,
    shares: 23,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date().toISOString(),
    tags: ['kente', 'traditional'],
  },
  {
    id: '4',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8744?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8744?w=400',
    aspectRatio: 1,
    author: { id: 'u4', name: 'Kwame Styles', avatar: 'https://i.pravatar.cc/150?img=4' },
    caption: 'Summer collection preview',
    likes: 445,
    comments: 18,
    shares: 8,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    type: 'video',
    url: SAMPLE_VIDEO_URLS.forBiggerBlazes,
    thumbnailUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    aspectRatio: 1,
    author: { id: 'u5', name: 'Abena Fabrics', avatar: 'https://i.pravatar.cc/150?img=5' },
    caption: 'How we select the perfect fabric',
    likes: 1023,
    comments: 67,
    shares: 34,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date().toISOString(),
    duration: 45,
  },
  {
    id: '6',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
    aspectRatio: 1,
    author: { id: 'u1', name: 'Ama\'s Designs', avatar: 'https://i.pravatar.cc/150?img=1' },
    caption: 'Behind the scenes at our studio',
    likes: 334,
    comments: 21,
    shares: 6,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400',
    aspectRatio: 1,
    author: { id: 'u6', name: 'Yaw Designs', avatar: 'https://i.pravatar.cc/150?img=6' },
    caption: 'Traditional meets contemporary',
    likes: 678,
    comments: 29,
    shares: 15,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    type: 'video',
    url: SAMPLE_VIDEO_URLS.elephantsDream,
    thumbnailUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
    aspectRatio: 1,
    author: { id: 'u2', name: 'Kofi Couture', avatar: 'https://i.pravatar.cc/150?img=2' },
    caption: 'Watch me create this masterpiece',
    likes: 1245,
    comments: 89,
    shares: 45,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
    duration: 60,
  },
  {
    id: '9',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400',
    aspectRatio: 1,
    author: { id: 'u3', name: 'Efua Fashion', avatar: 'https://i.pravatar.cc/150?img=3' },
    caption: 'Elegant evening wear',
    likes: 556,
    comments: 24,
    shares: 10,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    aspectRatio: 1,
    author: { id: 'u7', name: 'Akua Textiles', avatar: 'https://i.pravatar.cc/150?img=7' },
    caption: 'Fresh summer styles',
    likes: 423,
    comments: 16,
    shares: 7,
    isLiked: false,
    isBookmarked: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    type: 'video',
    url: SAMPLE_VIDEO_URLS.forBiggerFun,
    thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    aspectRatio: 1,
    author: { id: 'u4', name: 'Kwame Styles', avatar: 'https://i.pravatar.cc/150?img=4' },
    caption: 'Tutorial: Perfect hem technique',
    likes: 892,
    comments: 52,
    shares: 28,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
    duration: 90,
  },
  {
    id: '12',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
    thumbnailUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400',
    aspectRatio: 1,
    author: { id: 'u5', name: 'Abena Fabrics', avatar: 'https://i.pravatar.cc/150?img=5' },
    caption: 'Our fabric collection',
    likes: 667,
    comments: 31,
    shares: 14,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date().toISOString(),
  },
];

export default function ExploreScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos'>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all tailors to aggregate their portfolio items
  const { data: tailorsData, isLoading, refetch } = useGetTailorsQuery({ page: 1, pageSize: 50 });

  // Convert portfolio items to MediaItem format
  const mediaItems: MediaItem[] = useMemo(() => {
    if (!tailorsData?.data) return FALLBACK_MEDIA; // Use fallback if no API data
    
    const items: MediaItem[] = [];
    tailorsData.data.forEach((tailor) => {
      tailor.portfolio?.forEach((portfolioItem) => {
        // Only add items with valid URLs
        const url = portfolioItem.type === 'video' 
          ? portfolioItem.videoUrl 
          : portfolioItem.imageUrl;
        
        if (url) {
          items.push({
            id: portfolioItem.id,
            type: portfolioItem.type || 'image',
            url,
            thumbnailUrl: portfolioItem.imageUrl || url,
            aspectRatio: 1,
            author: {
              id: tailor.id,
              name: tailor.businessName,
              avatar: tailor.avatar || '',
            },
            caption: `${portfolioItem.title} - ${portfolioItem.category}`,
            likes: portfolioItem.likes || Math.floor(Math.random() * 1000),
            comments: Math.floor(Math.random() * 50),
            shares: Math.floor(Math.random() * 20),
            isLiked: false,
            isBookmarked: false,
            createdAt: new Date().toISOString(),
            duration: portfolioItem.type === 'video' ? 30 : undefined,
            tags: [portfolioItem.category],
          });
        }
      });
    });
    
    // If no valid items from API, return fallback
    return items.length > 0 ? items : FALLBACK_MEDIA;
  }, [tailorsData]);

  const filteredMedia =
    activeTab === 'all'
      ? mediaItems
      : mediaItems.filter((item) => item.type === (activeTab === 'images' ? 'image' : 'video'));

  const handleMediaPress = (index: number) => {
    navigation.navigate('MediaViewer', {
      items: filteredMedia,
      initialIndex: index,
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatLikes = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const renderMediaItem = ({ item, index }: { item: MediaItem; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => handleMediaPress(index)}
        activeOpacity={0.95}
      >
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        
        {/* Video indicator */}
        {item.type === 'video' && (
          <View style={styles.videoOverlay}>
            <View style={styles.playButton}>
              <Ionicons name="play" size={16} color="#FFFFFF" />
            </View>
            {item.duration && (
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>
                  {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Stats overlay on hover/press */}
        <View style={styles.statsOverlay}>
          <View style={styles.stat}>
            <Ionicons name="heart" size={16} color="#FFFFFF" />
            <Text style={styles.statText}>{formatLikes(item.likes)}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
            <Text style={styles.statText}>{formatLikes(item.comments)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <IconButton
          icon="search"
          size={22}
          color={colors.text.primary}
          onPress={() => navigation.navigate('Search')}
        />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'images' && styles.tabActive]}
            onPress={() => setActiveTab('images')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'images' && styles.tabTextActive]}>
              Photos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'videos' && styles.tabActive]}
            onPress={() => setActiveTab('videos')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'videos' && styles.tabTextActive]}>
              Videos
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading portfolio...</Text>
        </View>
      ) : filteredMedia.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyText}>No portfolio items found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMedia}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary[500]}
            />
          }
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  loadingText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
    lineHeight: 34,
  },

  // Tabs
  tabsContainer: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: colors.primary[600],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    lineHeight: 18,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },

  // Grid
  gridContent: {
    paddingTop: GAP,
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    gap: GAP,
    paddingHorizontal: GAP,
    marginBottom: GAP,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: colors.neutral[200],
    position: 'relative',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },

  // Video Overlay
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },

  // Stats Overlay
  statsOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs - 2,
    gap: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
});