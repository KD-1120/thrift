// Home Screen - Main Landing

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { useGetTailorsQuery } from '../api/tailors.api';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { IconButton } from '../components/IconButton';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { markAllRead } from '../features/notifications/notificationsSlice';
import { colors } from '../design-system/colors';
import { spacing, radius } from '../design-system/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 3) / 2;

type MainStackParamList = {
  TailorProfile: { tailorId: string };
  TailorGallery: { tailorId: string; tailorName: string };
  CategoryBrowse: { category: string };
  Search: undefined;
  Favorites: undefined;
  Orders: undefined;
  Profile: undefined;
};

// Mock hero slides
const HERO_SLIDES = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8744?w=800',
    title: 'New Collection',
    subtitle: 'Step into the season in style curated for bold statements and everyday elegance.',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    title: 'Summer Essentials',
    subtitle: 'Discover lightweight fabrics perfect for Accra\'s warm weather.',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    title: 'Custom Tailoring',
    subtitle: 'Work with expert tailors to create your perfect fit.',
  },
];

// Mock categories with images
const CATEGORIES = [
  { id: '1', name: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400' },
  { id: '2', name: 'Tops', image: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400' },
  { id: '3', name: 'Bottoms', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400' },
  { id: '4', name: 'Traditional', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400' },
];

// Mock recent work
const RECENT_WORK = [
  { id: '1', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', tailor: 'Ama\'s Designs' },
  { id: '2', image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400', tailor: 'Kofi Couture' },
  { id: '3', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400', tailor: 'Efua Fashion' },
];

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList & { Notifications: undefined }>>();
  const unreadCount = useAppSelector(state => state.notifications.unreadCount);
  const dispatch = useAppDispatch();
  const { data: tailorsData, isLoading } = useGetTailorsQuery({ page: 1, pageSize: 10 });
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Generate hero slides from real tailor data
  const heroSlides = React.useMemo(() => {
    if (!tailorsData?.data || tailorsData.data.length === 0) return HERO_SLIDES;
    
    const featuredTailors = tailorsData.data.slice(0, 3);
    return featuredTailors.map((tailor, index) => ({
      id: tailor.id,
      image: tailor.portfolio[0]?.imageUrl || HERO_SLIDES[index % HERO_SLIDES.length].image,
      title: tailor.businessName,
      subtitle: tailor.description.substring(0, 80) + '...',
    }));
  }, [tailorsData]);

  // Generate categories from real specialties
  const categories = React.useMemo(() => {
    if (!tailorsData?.data || tailorsData.data.length === 0) return CATEGORIES;
    
    const specialtiesMap: Record<string, string> = {};
    tailorsData.data.forEach(tailor => {
      tailor.specialties.forEach(specialty => {
        if (!specialtiesMap[specialty] && tailor.portfolio.length > 0) {
          specialtiesMap[specialty] = tailor.portfolio[0].imageUrl;
        }
      });
    });

    const uniqueCategories = Object.entries(specialtiesMap).slice(0, 6).map(([name, image], index) => ({
      id: `cat_${index}`,
      name,
      image,
    }));

    return uniqueCategories.length > 0 ? uniqueCategories : CATEGORIES;
  }, [tailorsData]);

  // Generate recent work from real portfolio items
  const recentWork = React.useMemo(() => {
    if (!tailorsData?.data || tailorsData.data.length === 0) return RECENT_WORK;
    
    const portfolioItems: typeof RECENT_WORK = [];
    tailorsData.data.forEach(tailor => {
      tailor.portfolio.slice(0, 2).forEach(item => {
        portfolioItems.push({
          id: item.id,
          image: item.imageUrl,
          tailor: tailor.businessName,
        });
      });
    });

    return portfolioItems.slice(0, 6);
  }, [tailorsData]);

  const renderCategoryCard = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => navigation.navigate('CategoryBrowse', { category: item.name })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay}>
        <Text style={styles.categoryText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderWorkCard = ({ item }: { item: typeof RECENT_WORK[0] }) => (
    <TouchableOpacity 
      style={styles.workCard}
      onPress={() => navigation.navigate('TailorGallery', { 
        tailorId: item.id, 
        tailorName: item.tailor 
      })}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.workImage} />
      <View style={styles.workOverlay}>
        <Text style={styles.workTailor}>{item.tailor}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="menu"
          size={24}
          color={colors.text.primary}
          onPress={() => {}}
        />
        <Text style={styles.logo}>Thrift</Text>
        <IconButton
          icon="notifications-outline"
          size={24}
          color={colors.text.primary}
          onPress={() => {
            dispatch(markAllRead());
          }}
          badge={unreadCount}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tailors, styles, or fabrics"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Carousel */}
        <View style={styles.heroSection}>
          <Carousel
            loop
            width={HERO_WIDTH}
            height={240}
            autoPlay={true}
            autoPlayInterval={4000}
            data={heroSlides}
            scrollAnimationDuration={800}
            onSnapToItem={(index) => setActiveHeroIndex(index)}
            style={styles.carousel}
            renderItem={({ item }) => (
              <View style={styles.heroSlide}>
                <Image source={{ uri: item.image }} style={styles.heroImage} />
                <View style={styles.heroTextContainer}>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <Text style={styles.heroSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            )}
          />
          
          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {heroSlides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeHeroIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>200+</Text>
            <Text style={styles.statLabel}>Verified Tailors</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5,000+</Text>
            <Text style={styles.statLabel}>Happy Customers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>15k+</Text>
            <Text style={styles.statLabel}>Orders Completed</Text>
          </View>
        </View>

        {/* Shop by Style */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Style</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CategoryBrowse', { category: 'All' })}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderCategoryCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Tailors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Tailors</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <Text style={styles.loading}>Loading tailors...</Text>
          ) : (
            <View style={styles.tailorsGrid}>
              {(tailorsData?.data || []).slice(0, 4).map((tailor) => (
                <TouchableOpacity
                  key={tailor.id}
                  style={styles.tailorGridCard}
                  onPress={() => navigation.navigate('TailorProfile', { tailorId: tailor.id })}
                >
                  <Card variant="elevated" padding="sm">
                    <Avatar uri={tailor.avatar || undefined} name={tailor.businessName} size={CARD_WIDTH - 32} />
                    <View style={styles.tailorGridInfo}>
                      <Text style={styles.tailorGridName} numberOfLines={1}>
                        {tailor.businessName}
                      </Text>
                      <View style={styles.tailorGridRating}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <Text style={styles.tailorGridRatingText}>{tailor.rating.toFixed(1)}</Text>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Recent Work */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Work</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TailorGallery', { 
              tailorId: 'featured', 
              tailorName: 'Featured Work' 
            })}>
              <Text style={styles.seeAll}>View Gallery</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recentWork}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderWorkCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.workList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.text.primary,
  },

  // Search
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + spacing.xs,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 20,
  },

  scrollContent: {
    paddingBottom: spacing.xxl,
  },

  // Hero Section
  heroSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  carousel: {
    width: HERO_WIDTH,
  },
  heroSlide: {
    width: HERO_WIDTH,
    height: 240,
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.primary[50],
  },
  heroImage: {
    width: '40%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroTextContainer: {
    position: 'absolute',
    right: spacing.lg,
    top: 0,
    bottom: 0,
    width: '55%',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 34,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: colors.text.primary,
  },
  dotInactive: {
    backgroundColor: colors.border.light,
  },

  // Stats Section
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary[700],
    lineHeight: 26,
    marginBottom: spacing.xs - 2,
  },
  statLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 26,
  },
  seeAll: {
    fontSize: 15,
    color: colors.text.secondary,
    fontWeight: '500',
    lineHeight: 20,
  },

  // Categories
  categoriesList: {
    gap: spacing.md,
  },
  categoryCard: {
    width: 160,
    height: 220,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.md,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Tailors Grid
  loading: {
    fontSize: 15,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: spacing.xl,
    lineHeight: 20,
  },
  tailorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tailorGridCard: {
    width: CARD_WIDTH,
  },
  tailorGridInfo: {
    marginTop: spacing.sm,
  },
  tailorGridName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs - 2,
    lineHeight: 20,
  },
  tailorGridRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs - 2,
  },
  tailorGridRatingText: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
    lineHeight: 18,
  },

  // Recent Work
  workList: {
    gap: spacing.md,
  },
  workCard: {
    width: 200,
    height: 280,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  workImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  workOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: spacing.md,
  },
  workTailor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 18,
  },
});