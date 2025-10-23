// Category Browse Screen - Browse tailors and services by category/style

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useGetTailorsQuery } from '../api/tailors.api';
import { IconButton } from '../components/IconButton';
import { colors } from '../design-system/colors';
import { spacing, radius, shadows } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';
import type { Tailor } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.lg * 2;

type RouteParams = {
  CategoryBrowse: {
    category: string;
  };
};

type NavigationProp = StackNavigationProp<{
  TailorGallery: { tailorId: string; tailorName: string };
  ServiceDetail: { serviceId: string; tailorId: string };
}>;

// Filters
const SORT_OPTIONS = ['Popular', 'Highest Rated', 'Price: Low to High', 'Price: High to Low', 'Newest'];
const PRICE_RANGES = ['Under GH₵100', 'GH₵100 - GH₵300', 'GH₵300 - GH₵500', 'Over GH₵500'];
const SUB_CATEGORIES = ['All', 'Casual', 'Formal', 'Traditional', 'Modern', 'Vintage'];

export default function CategoryBrowseScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'CategoryBrowse'>>();
  const { category } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('Popular');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Fetch tailors from backend
  const { data: tailorsData, isLoading, error, refetch } = useGetTailorsQuery({
    page: 1,
    pageSize: 20,
    search: searchQuery,
    sortBy: selectedSort,
    specialties: selectedSubCategory === 'All' ? [] : [selectedSubCategory],
  });

  const tailors = tailorsData?.data || [];

  const toggleFavorite = (tailorId: string) => {
    setFavorites((prev) => ({ ...prev, [tailorId]: !prev[tailorId] }));
  };

  const handleTailorPress = (tailorId: string) => {
    navigation.navigate('TailorGallery', { tailorId, tailorName: '' });
  };

  const renderTailorCard = ({ item }: { item: Tailor }) => {
    const portfolioImage = item.portfolio?.[0]?.imageUrl || 'https://via.placeholder.com/400x240/4ECDC4/FFFFFF?text=No+Image';
    
    return (
      <TouchableOpacity
        style={styles.tailorCard}
        onPress={() => handleTailorPress(item.id)}
        activeOpacity={0.95}
      >
        {/* Portfolio Preview */}
        <View style={styles.portfolioContainer}>
          <Image source={{ uri: portfolioImage }} style={styles.portfolioImage as any} />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={favorites[item.id] ? 'heart' : 'heart-outline'}
              size={22}
              color={favorites[item.id] ? colors.error.main : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Tailor Info */}
        <View style={styles.tailorInfo}>
          <View style={styles.tailorHeader}>
            <Image source={{ uri: item.avatar || 'https://via.placeholder.com/56/FF6B6B/FFFFFF?text=T' }} style={styles.tailorAvatar as any} />
            <View style={styles.tailorMain}>
              <View style={styles.tailorNameRow}>
                <Text style={styles.tailorName} numberOfLines={2}>
                  {item.businessName}
                </Text>
                {item.verified && (
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={18}
                    color={colors.primary[600]}
                    style={styles.verifiedBadge}
                  />
                )}
              </View>
              <Text style={styles.tailorSpecialty} numberOfLines={2}>
                {item.specialties.join(', ')}
              </Text>
            </View>
          </View>

          <View style={styles.tailorMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color={colors.warning.main} />
              <Text style={styles.metaText}>
                {item.rating.toFixed(1)}
              </Text>
              <Text style={styles.metaLight}>({item.reviewCount})</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="location" size={16} color={colors.text.tertiary} />
              <Text style={styles.metaText}>{item.location.city}</Text>
            </View>
          </View>

          <View style={styles.tailorFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceRange}>
                GH₵{item.priceRange.min} - GH₵{item.priceRange.max}
              </Text>
            </View>
            <View style={styles.responseTime}>
              <Ionicons name="time-outline" size={14} color={colors.success.main} />
              <Text style={styles.responseTimeText}>{item.turnaroundTime}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading tailors...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || tailors.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-back"
            size={24}
            color={colors.text.primary}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{category}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.emptyTitle}>No Tailors Found</Text>
          <Text style={styles.emptyMessage}>
            {error ? 'Unable to load tailors. Please try again.' : 'No tailors match your criteria.'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.headerTitle}>{category}</Text>
          <Text style={styles.headerSubtitle}>{tailors.length} tailors</Text>
        </View>
        <IconButton
          icon={showFilters ? 'close' : 'options-outline'}
          size={24}
          color={colors.text.primary}
          onPress={() => setShowFilters(!showFilters)}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tailors..."
          placeholderTextColor={colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sub-categories (wrapped so it sits above scrollable content) */}
      <View style={[
        styles.subCategoriesWrap,
        Platform.OS === 'web' ? ({ position: 'sticky' as any, top: 0 } as any) : {},
      ]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subCategoriesContent}
        >
          {SUB_CATEGORIES.map((subCat) => (
            <TouchableOpacity
              key={subCat}
              style={[
                styles.subCategoryChip,
                selectedSubCategory === subCat && styles.subCategoryChipActive,
              ]}
              onPress={() => setSelectedSubCategory(subCat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subCategoryText,
                  selectedSubCategory === subCat && styles.subCategoryTextActive,
                ]}
              >
                {subCat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Sort By</Text>
              <View style={styles.filterOptions}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.filterOption}
                    onPress={() => setSelectedSort(option)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        selectedSort === option && styles.filterOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                    {selectedSort === option && (
                      <Ionicons name="checkmark" size={22} color={colors.primary[600]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Price Range</Text>
              <View style={styles.filterOptions}>
                {PRICE_RANGES.map((range) => (
                  <TouchableOpacity key={range} style={styles.filterOption} activeOpacity={0.7}>
                    <Text style={styles.filterOptionText}>{range}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Additional Filters */}
            <View style={[styles.filterSection, styles.filterSectionLast]}>
              <Text style={styles.filterTitle}>Additional Filters</Text>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterOption} activeOpacity={0.7}>
                  <Text style={styles.filterOptionText}>Verified Only</Text>
                  <Ionicons name="toggle" size={36} color={colors.primary[600]} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} activeOpacity={0.7}>
                  <Text style={styles.filterOptionText}>Fast Response</Text>
                  <Ionicons name="toggle-outline" size={36} color={colors.neutral[400]} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View style={styles.filterFooter}>
            <TouchableOpacity 
              style={styles.applyButton} 
              activeOpacity={0.9}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tailors List */}
      <FlatList
        data={tailors}
        renderItem={renderTailorCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Loading & Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  loadingText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
  },
  emptyTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  emptyMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  headerCenter: {
    // Keep the center header from shrinking when side icons are present
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    flexShrink: 0,
    // Reserve height so title/subtitle have space to stack on small screens
    minHeight: 44,
    // Use relative positioning; we'll ensure the center content doesn't get squeezed
    justifyContent: 'center',
  },
  headerTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
  },
  headerSubtitle: {
    ...textStyles.small,
    color: colors.text.tertiary,
    marginTop: spacing.xxl,
    flexShrink: 0,
    textAlign: 'center',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...textStyles.body,
    color: colors.text.primary,
    padding: 0,
    minHeight: 20,
  },

  // Sub-categories
  subCategoriesContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    minHeight: 70,
  },
  subCategoriesWrap: {
    // Ensure the subcategory bar sits above scrollable content
    zIndex: 20,
    backgroundColor: colors.background.primary,
    // default to relative positioning; web-only sticky applied inline to avoid invalid type
    position: 'relative',
  },
  subCategoryChip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    minHeight: 44,
    justifyContent: 'center',
  },
  subCategoryChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  subCategoryText: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
  },
  subCategoryTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Filters Panel
  filtersPanel: {
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    maxHeight: '65%',
  },
  filterSection: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filterSectionLast: {
    borderBottomWidth: 0,
    paddingBottom: spacing.xl,
  },
  filterTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  filterOptions: {
    gap: spacing.sm,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  filterOptionText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  filterOptionTextActive: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  filterFooter: {
    padding: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.card,
  },
  applyButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    minHeight: 52,
    ...shadows.sm,
  },
  applyButtonText: {
    ...textStyles.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // List
  listContent: {
    padding: spacing.lg,
    gap: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxxl,
  },

  // Tailor Card
  tailorCard: {
    backgroundColor: colors.background.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  portfolioContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 0.6,
    backgroundColor: colors.neutral[200],
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },

  // Tailor Info
  tailorInfo: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  tailorHeader: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  tailorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutral[200],
  },
  tailorMain: {
    flex: 1,
    gap: spacing.sm,
  },
  tailorNameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  tailorName: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  verifiedBadge: {
    marginTop: 2,
  },
  tailorSpecialty: {
    ...textStyles.small,
    color: colors.text.tertiary,
    lineHeight: 18,
  },

  // Meta
  tailorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    ...textStyles.small,
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  metaLight: {
    ...textStyles.small,
    fontWeight: '400',
    color: colors.text.secondary,
    fontSize: 14,
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border.light,
  },

  // Footer
  tailorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    gap: spacing.md,
  },
  priceContainer: {
    flex: 1,
  },
  priceRange: {
    ...textStyles.body,
    color: colors.primary[700],
    fontWeight: '700',
    fontSize: 15,
  },
  responseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.success.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    minHeight: 32,
  },
  responseTimeText: {
    ...textStyles.small,
    color: colors.success.dark,
    fontWeight: '600',
    fontSize: 13,
  },
});