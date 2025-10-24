// Tailor Gallery Screen - VOGANTA-inspired portfolio display

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGetTailorQuery } from '../api/tailors.api';
import { IconButton } from '../components/IconButton';
import { colors } from '../design-system/colors';
import { spacing, radius, shadows } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = 12;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (SCREEN_WIDTH - GAP * 3) / NUM_COLUMNS;

type RouteParams = {
  TailorGallery: {
    tailorId: string;
    tailorName: string;
  };
};

type NavigationProp = StackNavigationProp<{
  ServiceDetail: { serviceId: string; tailorId: string };
  TailorProfile: { tailorId: string };
}>;

export default function TailorGalleryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'TailorGallery'>>();
  const { tailorId, tailorName } = route.params;

  const { data: tailor, isLoading, error } = useGetTailorQuery(tailorId);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories from portfolio
  const categories = ['All'];
  if (tailor?.portfolio) {
    const uniqueCategories = [...new Set(tailor.portfolio.map(item => item.category))];
    categories.push(...uniqueCategories);
  }

  const filteredPortfolio =
    selectedCategory === 'All'
      ? (tailor?.portfolio || [])
      : (tailor?.portfolio || []).filter((item) => item.category === selectedCategory);

  const handleItemPress = (serviceId: string) => {
    navigation.navigate('ServiceDetail', { serviceId, tailorId });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            size={24}
            color={colors.text.primary}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !tailor) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            size={24}
            color={colors.text.primary}
            onPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load tailor portfolio</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderGridItem = ({ item }: { item: typeof tailor.portfolio[0] }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handleItemPress(item.id)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
      
      {/* Gradient overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gridOverlay}
      >
        <View style={styles.gridInfo}>
          <Text style={styles.gridTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.gridMeta}>
            <Text style={styles.gridPrice}>{item.category}</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Featured badge */}
      {item.type === 'video' && (
        <View style={styles.featuredBadge}>
          <Ionicons name="play-circle" size={12} color="#FFFFFF" />
          <Text style={styles.featuredText}>Video</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderListItem = ({ item }: { item: typeof tailor.portfolio[0] }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => handleItemPress(item.id)}
      activeOpacity={0.95}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.listImage} />
      <View style={styles.listContent}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{item.title}</Text>
          {item.type === 'video' && (
            <View style={styles.listFeaturedBadge}>
              <Ionicons name="play-circle" size={10} color={colors.primary[700]} />
            </View>
          )}
        </View>
        <Text style={styles.listCategory}>{item.category}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          color={colors.text.primary}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{tailorName}</Text>
          <Text style={styles.headerSubtitle}>Portfolio</Text>
        </View>
        <View style={styles.headerRight}>
          <IconButton
            icon={viewMode === 'grid' ? 'list' : 'grid'}
            size={22}
            color={colors.text.primary}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          />
          <IconButton
            icon="heart-outline"
            size={22}
            color={colors.text.primary}
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{tailor.portfolio?.length || 0}</Text>
          <Text style={styles.statLabel}>Works</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{tailor.rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{tailor.reviewCount}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Portfolio Grid/List */}
      <FlatList
        key={viewMode}
        data={filteredPortfolio}
        renderItem={viewMode === 'grid' ? renderGridItem : renderListItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? NUM_COLUMNS : 1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          viewMode === 'grid' ? styles.gridContent : styles.listContent
        }
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('TailorProfile', { tailorId })}
      >
        <Ionicons name="person" size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>View Profile</Text>
      </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorText: {
    fontSize: 15,
    color: colors.error[600],
    lineHeight: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    minHeight: 72,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    lineHeight: 28,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...textStyles.small,
    color: colors.text.tertiary,
    lineHeight: 20,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },

  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xxxl,
    backgroundColor: colors.background.secondary,
    justifyContent: 'space-around',
    minHeight: 100,
  },
  stat: {
    alignItems: 'center',
    minWidth: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary[700],
    lineHeight: 32,
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },

  // Categories
  categoriesScroll: {
    height: 60,
    marginBottom: spacing.lg,
  },
  categoriesContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    height: 60,
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    minHeight: 44,
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  categoryText: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Grid View
  gridContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  gridRow: {
    gap: spacing.lg,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.lg,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.4,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.neutral[200],
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  gridInfo: {
    gap: spacing.sm,
  },
  gridTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 20,
  },
  gridMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  gridPrice: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 22,
  },
  gridLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  gridLikesText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    minHeight: 28,
    ...shadows.md,
  },
  featuredText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 16,
  },

  // List View
  listContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.lg,
    ...shadows.sm,
  },
  listImage: {
    width: 80,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[200],
  },
  listContent: {
    flex: 1,
    gap: spacing.sm,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  listTitle: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  listFeaturedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  listCategory: {
    ...textStyles.small,
    color: colors.text.tertiary,
    marginBottom: spacing.xs,
  },
  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  listPrice: {
    ...textStyles.body,
    color: colors.primary[700],
    fontWeight: '700',
  },
  listLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listLikesText: {
    ...textStyles.small,
    color: colors.text.secondary,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[600],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    ...shadows.lg,
  },
  fabText: {
    ...textStyles.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
