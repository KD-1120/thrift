// Portfolio Analytics Screen - Detailed portfolio performance metrics

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';
import { useAppSelector } from '../../../store/hooks';
import { useGetTailorQuery } from '../../../api/tailors.api';
import { Alert } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<any>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<any>;

// Mock portfolio analytics data
const MOCK_PORTFOLIO_ANALYTICS = {
  overview: {
    totalItems: 47,
    publishedItems: 42,
    featuredItems: 8,
    totalLikes: 2847,
    totalComments: 156,
    totalShares: 89,
    totalViews: 12543,
  },
  topPerforming: [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
      title: 'Elegant Evening Dress',
      category: 'Dresses',
      likes: 234,
      comments: 12,
      shares: 5,
      views: 892,
      engagement: 28.7,
      createdAt: '2024-01-10',
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
      title: 'Modern Kente Design',
      category: 'Traditional',
      likes: 189,
      comments: 8,
      shares: 3,
      views: 654,
      engagement: 30.1,
      createdAt: '2024-01-08',
    },
    {
      id: '3',
      imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea3c8744?w=400',
      title: 'Summer Collection Preview',
      category: 'Casual',
      likes: 156,
      comments: 6,
      shares: 2,
      views: 543,
      engagement: 30.8,
      createdAt: '2024-01-05',
    },
  ],
  categoryPerformance: [
    { category: 'Dresses', items: 12, likes: 1245, comments: 67, shares: 34, avgEngagement: 28.5 },
    { category: 'Traditional', items: 8, likes: 892, comments: 45, shares: 23, avgEngagement: 32.1 },
    { category: 'Formal', items: 6, likes: 678, comments: 29, shares: 15, avgEngagement: 25.3 },
    { category: 'Casual', items: 10, likes: 567, comments: 21, shares: 12, avgEngagement: 22.7 },
    { category: 'Accessories', items: 4, likes: 234, comments: 12, shares: 5, avgEngagement: 18.9 },
  ],
  engagementTrends: [
    { date: '2024-01-01', likes: 45, comments: 3, shares: 1 },
    { date: '2024-01-08', likes: 67, comments: 5, shares: 2 },
    { date: '2024-01-15', likes: 89, comments: 7, shares: 3 },
    { date: '2024-01-22', likes: 123, comments: 9, shares: 4 },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'like',
      user: 'Akua Mensah',
      item: 'Elegant Evening Dress',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'comment',
      user: 'Kofi Asante',
      item: 'Modern Kente Design',
      timestamp: '4 hours ago',
      comment: 'Beautiful craftsmanship!',
    },
    {
      id: '3',
      type: 'share',
      user: 'Adwoa Osei',
      item: 'Summer Collection Preview',
      timestamp: '6 hours ago',
    },
  ],
};

export default function PortfolioAnalyticsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector((state) => state.auth.user);
  const { data: tailorProfile, isLoading: isLoadingProfile } = useGetTailorQuery(user?.id || '', {
    skip: !user?.id,
  });
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Check if user is a tailor
  useEffect(() => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to access this feature.');
      navigation.goBack();
      return;
    }

    if (user.role !== 'tailor') {
      Alert.alert('Access Denied', 'This feature is only available for tailors.');
      navigation.goBack();
      return;
    }
  }, [user, navigation]);

  // Show loading
  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state - no analytics data available yet
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Portfolio Analytics</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <Ionicons name="analytics-outline" size={80} color={colors.text.secondary} />
          <Text style={styles.emptyTitle}>No Analytics Yet</Text>
          <Text style={styles.emptySubtitle}>
            Analytics will be available once you have portfolio items and customer interactions.
            Start by adding items to your portfolio to track performance.
          </Text>
          <Button
            title="Add Portfolio Items"
            onPress={() => navigation.navigate('PortfolioManagement')}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
  },
  headerRight: {
    width: 40,
  },

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.huge,
  },
  emptyTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Time Range
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  timeRangeButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  timeRangeText: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  timeRangeTextActive: {
    color: colors.background.primary,
  },

  // Metrics Grid
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    gap: spacing.md,
  },
  metricCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: spacing.md,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  trendPositive: {
    backgroundColor: colors.success.light,
  },
  trendNegative: {
    backgroundColor: colors.error.light,
  },
  trendText: {
    ...textStyles.small,
    fontWeight: '600',
  },
  trendTextPositive: {
    color: colors.success.main,
  },
  trendTextNegative: {
    color: colors.error.main,
  },
  metricValue: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    fontSize: 24,
    fontWeight: '700',
  },
  metricTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  metricSubtitle: {
    ...textStyles.small,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Sections
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },

  // Top Performing Items
  topItemCard: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  topItemImage: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    marginRight: spacing.lg,
  },
  topItemContent: {
    flex: 1,
  },
  topItemTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  topItemCategory: {
    ...textStyles.small,
    color: colors.primary[600],
    marginBottom: spacing.sm,
  },
  topItemStats: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    ...textStyles.small,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  engagementBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  engagementText: {
    ...textStyles.small,
    color: colors.primary[700],
    fontWeight: '600',
  },

  // Category Performance
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  categoryStats: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  categoryMetrics: {
    alignItems: 'flex-end',
  },
  categoryEngagement: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  categoryBar: {
    width: 80,
    height: 4,
    backgroundColor: colors.border.light,
    borderRadius: 2,
  },
  categoryBarFill: {
    height: '100%',
    backgroundColor: colors.primary[600],
    borderRadius: 2,
  },

  // Recent Activity
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    ...textStyles.body,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  activityUser: {
    fontWeight: '600',
  },
  activityItemName: {
    fontStyle: 'italic',
  },
  activityComment: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  activityTime: {
    ...textStyles.small,
    color: colors.text.tertiary,
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.huge,
  },
  actionButton: {
    flex: 1,
  },
});