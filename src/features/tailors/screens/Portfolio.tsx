// Complete Portfolio Screen with Gallery

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';
import { useAppSelector } from '../../../store/hooks';
import { useGetTailorQuery } from '../../../api/tailors.api';
import type { PortfolioItem } from '../../../types';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - spacing.xl * 2 - spacing.md) / 2;

export default function PortfolioScreen() {
  const navigation = useNavigation();
  const user = useAppSelector((state) => state.auth.user);
  
  const [selectedImage, setSelectedImage] = useState<PortfolioItem | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Fetch tailor's portfolio from API
  const { data: tailorProfile, isLoading } = useGetTailorQuery(
    user?.id || '',
    { skip: !user?.id || user?.role !== 'tailor' }
  );

  // Get portfolio items from tailor profile
  const portfolioItems = useMemo(() => {
    return tailorProfile?.portfolio || [];
  }, [tailorProfile]);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'traditional', label: 'Traditional' },
    { id: 'formal', label: 'Formal' },
    { id: 'casual', label: 'Casual' },
    { id: 'wedding', label: 'Wedding' },
  ];

  const filteredItems =
    selectedFilter === 'all'
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === selectedFilter);

  const handleItemPress = (item: PortfolioItem) => {
    // Navigate to CreatorMediaViewer (tailor-facing portfolio viewer)
    (navigation as any).navigate('CreatorMediaViewer', {
      items: portfolioItems.map(p => ({
        id: p.id,
        type: p.type || 'image',
        url: p.imageUrl || p.videoUrl || '',
        thumbnailUrl: p.imageUrl || '',
        aspectRatio: 0.8,
        author: {
          id: user?.id || '',
          name: tailorProfile?.businessName || user?.name || 'Tailor',
          avatar: tailorProfile?.avatar || '',
        },
        caption: p.title,
        likes: p.likes || 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: p.createdAt?.toString() || new Date().toISOString(),
      })),
      initialIndex: portfolioItems.findIndex(p => p.id === item.id),
    });
  };

  const renderPortfolioItem = ({ item }: { item: PortfolioItem }) => (
    <TouchableOpacity
      style={styles.portfolioItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            {item.type === 'video' ? '🎥' : '📷'}
          </Text>
        </View>
        {item.type === 'video' && (
          <View style={styles.videoBadge}>
            <Ionicons name="play-circle" size={32} color="#fff" />
          </View>
        )}
        <View style={styles.overlay}>
          <View style={styles.likesContainer}>
            <Text style={styles.likesText}>❤️ {item.likes || 0}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.itemTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading portfolio...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Portfolio</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => (navigation as any).navigate('PortfolioManagement')}
        >
          <Ionicons name="add-circle-outline" size={28} color={colors.primary[600]} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterChip,
                selectedFilter === category.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(category.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedFilter === category.id && styles.filterChipTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Portfolio Grid */}
        <View style={styles.grid}>
          <FlatList
            data={filteredItems}
            renderItem={renderPortfolioItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.row}
          />
        </View>

        {filteredItems.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎨</Text>
            <Text style={styles.emptyText}>No items in this category yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Image Detail Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setSelectedImage(null)}
          />
          {selectedImage && (
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedImage(null)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
              
              <View style={styles.modalImage}>
                <View style={styles.modalImagePlaceholder}>
                  <Text style={styles.modalImagePlaceholderText}>📷</Text>
                </View>
              </View>
              
              <View style={styles.modalDetails}>
                <Text style={styles.modalTitle}>{selectedImage.title}</Text>
                <Text style={styles.modalDescription}>
                  {selectedImage.description}
                </Text>
                <View style={styles.modalStats}>
                  <Text style={styles.modalLikes}>❤️ {selectedImage.likes} likes</Text>
                  <Text style={styles.modalCategory}>
                    {selectedImage.category}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonText: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  headerTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterChipText: {
    ...textStyles.small,
    color: colors.text.secondary,
  },
  filterChipTextActive: {
    ...textStyles.smallMedium,
    color: colors.background.card,
  },
  grid: {
    paddingHorizontal: spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  portfolioItem: {
    width: ITEM_SIZE,
    marginBottom: spacing.sm,
  },
  imageContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE * 1.25,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 32,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'flex-end',
    padding: spacing.sm,
  },
  likesContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  likesText: {
    ...textStyles.small,
    color: '#fff',
  },
  itemTitle: {
    ...textStyles.small,
    color: colors.text.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    width: width - spacing.xl * 2,
    maxHeight: '80%',
    backgroundColor: colors.background.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    ...textStyles.h2,
    color: '#fff',
  },
  modalImage: {
    width: '100%',
    height: width - spacing.xl * 2,
    backgroundColor: colors.neutral[200],
  },
  modalImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImagePlaceholderText: {
    fontSize: 64,
  },
  modalDetails: {
    padding: spacing.lg,
  },
  modalTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  modalDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalLikes: {
    ...textStyles.small,
    color: colors.text.tertiary,
  },
  modalCategory: {
    ...textStyles.small,
    color: colors.primary[500],
    textTransform: 'capitalize',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },
  addButton: {
    padding: spacing.xs,
  },
  videoBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    zIndex: 2,
  },
});
