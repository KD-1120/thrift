// Service Detail Screen - Individual garment/service detail view

import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetTailorQuery } from '../api/tailors.api';
import { IconButton } from '../components/IconButton';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { colors } from '../design-system/colors';
import { spacing, radius, shadows } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RouteParams = {
  ServiceDetail: {
    serviceId: string;
    tailorId: string;
  };
};

type NavigationProp = StackNavigationProp<{
  BookingFlow: { serviceId: string; tailorId: string };
  TailorProfile: { tailorId: string };
  TailorGallery: { tailorId: string; tailorName: string };
}>;

export default function ServiceDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'ServiceDetail'>>();
  const { serviceId, tailorId } = route.params;

  // Fetch tailor data to get portfolio item
  const { data: tailor, isLoading, error } = useGetTailorQuery(tailorId);

  // Find the specific portfolio item
  const portfolioItem = useMemo(() => {
    return tailor?.portfolio?.find(item => item.id === serviceId);
  }, [tailor, serviceId]);

  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Create images array - for now just the main image, can be expanded
  const images = useMemo(() => {
    if (!portfolioItem) return [];
    return [portfolioItem.imageUrl];
  }, [portfolioItem]);

  const handleBookNow = () => {
    navigation.navigate('BookingFlow', { serviceId, tailorId });
  };

  const handleTailorPress = () => {
    navigation.navigate('TailorProfile', { tailorId });
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.loadingContainer}>
          <View style={styles.header}>
            <IconButton
              icon="arrow-back"
              size={24}
              color={colors.text.primary}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colors.primary[600]} />
            <Text style={styles.loadingText}>Loading details...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Error or not found state
  if (error || !tailor || !portfolioItem) {
    return (
      <View style={styles.container}>
        <SafeAreaView edges={['top']} style={styles.loadingContainer}>
          <View style={styles.header}>
            <IconButton
              icon="arrow-back"
              size={24}
              color={colors.text.primary}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.centerContent}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.error[500]} />
            <Text style={styles.errorText}>Service not found</Text>
            <Button
              title="Go Back"
              onPress={() => navigation.goBack()}
              variant="primary"
              style={styles.errorButton}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const renderImageItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.heroImage} />
  );

  return (
    <View style={styles.container}>
      {/* Hero Image Carousel */}
      <View style={styles.heroContainer}>
        <Animated.FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
            listener: (event: any) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveImageIndex(index);
            },
          })}
          scrollEventThrottle={16}
        />

        {/* Hero caption: title, price and likes over image for better contrast */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.heroCaptionGradient}
        >
          <View style={styles.heroCaption}>
            <Text style={styles.heroCaptionTitle} numberOfLines={1}>
              {portfolioItem.title}
            </Text>
            <View style={styles.heroCaptionRow}>
              <Text style={styles.heroCaptionPrice}>
                {portfolioItem.price ? `GH₵${portfolioItem.price}` : portfolioItem.category}
              </Text>
              <View style={styles.heroCaptionLikes}>
                <Text style={styles.likeIcon}>♥</Text>
                <Text style={styles.heroCaptionLikesCount}>{portfolioItem.likes || 0}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Header Overlay */}
        <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.headerOverlay}>
          <SafeAreaView edges={['top']} style={styles.headerSafe}>
            <View style={styles.header}>
              <IconButton
                icon="arrow-back"
                size={24}
                color="#FFFFFF"
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
              />
              <View style={styles.headerRight}>
                <IconButton
                  icon="share-social-outline"
                  size={22}
                  color="#FFFFFF"
                  onPress={() => {}}
                  style={styles.headerButton}
                />
                <IconButton
                  icon={isLiked ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isLiked ? colors.error.main : '#FFFFFF'}
                  onPress={() => setIsLiked(!isLiked)}
                  style={styles.headerButton}
                />
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Image Indicators */}
        {images.length > 1 && (
          <View style={styles.indicators}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[styles.indicator, index === activeImageIndex && styles.indicatorActive]}
              />
            ))}
          </View>
        )}

        {/* Video Badge */}
        {portfolioItem.type === 'video' && (
          <View style={styles.featuredBadge}>
            <Ionicons name="play-circle" size={14} color="#FFFFFF" />
            <Text style={styles.featuredText}>Video</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title & Category */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{portfolioItem.title}</Text>
          
          <View style={styles.titleMeta}>
            <TouchableOpacity style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{portfolioItem.category}</Text>
            </TouchableOpacity>
            <Text style={styles.likesText}>{portfolioItem.likes || 0} likes</Text>
          </View>

          {portfolioItem.price && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Starting from</Text>
              <Text style={styles.price}>GH₵{portfolioItem.price}</Text>
            </View>
          )}
        </View>

        {/* Tailor Info Card */}
        <TouchableOpacity style={styles.tailorCard} onPress={handleTailorPress} activeOpacity={0.9}>
          <Avatar uri={tailor.avatar || undefined} size={56} />
          <View style={styles.tailorInfo}>
            <View style={styles.tailorHeader}>
              <Text style={styles.tailorName}>{tailor.businessName}</Text>
              {tailor.verified && (
                <MaterialCommunityIcons name="check-decagram" size={18} color={colors.primary[600]} />
              )}
            </View>

            {/* Numeric stats row with clear hierarchy */}
            <View style={styles.tailorMetaRow}>
              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{tailor.rating.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>

              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{tailor.portfolio?.length || 0}</Text>
                <Text style={styles.statLabel}>Works</Text>
              </View>

              <View style={styles.statBlock}>
                <Text style={styles.statNumber}>{tailor.reviewCount}</Text>
                <Text style={styles.statLabel}>Reviews</Text>
              </View>
            </View>

            <View style={styles.tailorStats}>
              <View style={styles.tailorStat}>
                <Ionicons name="location-outline" size={14} color={colors.text.tertiary} />
                <Text style={styles.tailorStatText}>{tailor.location.city}</Text>
              </View>
              <View style={styles.tailorStat}>
                <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
                <Text style={styles.tailorStatText}>{tailor.turnaroundTime}</Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        {/* Description */}
        {portfolioItem.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{portfolioItem.description}</Text>
          </View>
        )}

        {/* Tailor Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Tailor</Text>
          <Text style={styles.description}>{tailor.description}</Text>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.featuresList}>
            {tailor.specialties.map((specialty, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success.main} />
                <Text style={styles.featureText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews Section - Placeholder */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews ({tailor.reviewCount})</Text>
            <TouchableOpacity onPress={handleTailorPress}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.reviewsPlaceholder}>
            View all reviews on the tailor's profile
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>
            {portfolioItem.price ? 'Starting from' : 'Price Range'}
          </Text>
          <Text style={styles.bottomPrice}>
            {portfolioItem.price 
              ? `GH₵${portfolioItem.price}` 
              : `GH₵${tailor.priceRange.min}-${tailor.priceRange.max}`}
          </Text>
        </View>
        <Button title="Book Now" onPress={handleBookNow} style={styles.bookButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  loadingText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 20,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: colors.error[600],
    lineHeight: 22,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: spacing.lg,
  },
  reviewsPlaceholder: {
    fontSize: 14,
    color: colors.text.tertiary,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: spacing.lg,
  },

  // Hero Section
  heroContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
    backgroundColor: colors.neutral[200],
    position: 'relative',
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2,
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerSafe: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  headerButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: radius.full,
    width: 40,
    height: 40,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  indicators: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    width: 20,
    backgroundColor: '#FFFFFF',
  },
  featuredBadge: {
    position: 'absolute',
    top: 72,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    ...shadows.md,
  },
  featuredText: {
    ...textStyles.small,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Hero caption overlay
  heroCaptionGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  heroCaption: {
    paddingVertical: spacing.lg,
    backgroundColor: 'transparent',
  },
  heroCaptionTitle: {
    ...textStyles.h3,
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 40,
    flexShrink: 0,
    marginBottom: spacing.md,
  },
  heroCaptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 28,
  },
  heroCaptionPrice: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 24,
  },
  heroCaptionLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  likeIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 20,
  },
  heroCaptionLikesCount: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },

  // Content
  content: {
    flex: 1,
  },
  
  // Title Section
  titleSection: {
    padding: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    ...textStyles.h3,
    color: colors.text.primary,
    lineHeight: 40,
    marginBottom: spacing.lg,
  },
  titleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  categoryBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    minHeight: 32,
    justifyContent: 'center',
  },
  categoryText: {
    ...textStyles.small,
    color: colors.primary[700],
    fontWeight: '600',
    lineHeight: 20,
  },
  likesText: {
    ...textStyles.small,
    color: colors.text.secondary,
    fontWeight: '500',
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  priceLabel: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  price: {
    ...textStyles.h3,
    color: colors.primary[700],
    fontWeight: '700',
    lineHeight: 36,
  },

  // Tailor Card
  tailorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    gap: spacing.lg,
  },
  tailorInfo: {
    flex: 1,
  },
  tailorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tailorName: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
  },
  tailorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tailorRating: {
    ...textStyles.small,
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  tailorReviews: {
    ...textStyles.small,
    color: colors.text.secondary,
    fontSize: 14,
  },
  tailorDot: {
    ...textStyles.small,
    color: colors.text.tertiary,
  },
  tailorOrders: {
    ...textStyles.small,
    color: colors.text.secondary,
    fontSize: 14,
  },
  tailorStats: {
    flexDirection: 'row',
    gap: spacing.xl,
    flexWrap: 'wrap',
  },
  tailorStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 24,
  },
  tailorStatText: {
    ...textStyles.small,
    color: colors.text.tertiary,
    fontSize: 14,
    lineHeight: 20,
  },

  // Sections
  section: {
    padding: spacing.xxl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.xl,
    lineHeight: 28,
  },
  seeAllLink: {
    ...textStyles.body,
    color: colors.primary[600],
    fontWeight: '600',
    lineHeight: 24,
  },
  description: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 26,
  },

  // Features
  featuresList: {
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    minHeight: 32,
  },
  featureText: {
    ...textStyles.body,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 24,
  },

  // Reviews
  reviewsList: {
    gap: spacing.xxl,
  },
  reviewCard: {
    gap: spacing.lg,
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  reviewUser: {
    flex: 1,
    gap: spacing.sm,
  },
  reviewUserName: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    lineHeight: 22,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  reviewDate: {
    ...textStyles.small,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
  // Tailor numeric stats
  tailorMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.xl,
  },
  statBlock: {
    alignItems: 'center',
    minWidth: 60,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  reviewComment: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 26,
  },
  reviewImagesScroll: {
    marginTop: spacing.md,
  },
  reviewImages: {
    gap: spacing.md,
  },
  reviewImage: {
    width: 88,
    height: 110,
    borderRadius: radius.lg,
  },

  // Bottom
  bottomSpacer: {
    height: spacing.huge + spacing.xxxl,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
    minHeight: 80,
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.xl,
  },
  bottomLeft: {
    gap: spacing.sm,
  },
  bottomLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  bottomPrice: {
    ...textStyles.h4,
    color: colors.primary[700],
    fontWeight: '700',
    lineHeight: 28,
  },
  bookButton: {
    paddingHorizontal: spacing.xxxl,
    minHeight: 48,
  },
});