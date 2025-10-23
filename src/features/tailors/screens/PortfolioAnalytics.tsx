// Portfolio Analytics Screen - Detailed portfolio performance metrics

import React, { useState } from 'react';
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
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const renderMetricCard = (
    title: string,
    value: string | number,
    subtitle: string | undefined,
    icon: string,
    trend: { value: number; isPositive: boolean } | undefined
  ) => (
    <Card variant="elevated" padding="lg" style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <View style={styles.metricIcon}>
          <Ionicons name={icon as any} size={20} color={colors.primary[600]} />
        </View>
        {trend && (
          <View style={[styles.trendBadge, trend.isPositive ? styles.trendPositive : styles.trendNegative]}>
            <Ionicons
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={12}
              color={trend.isPositive ? colors.success.main : colors.error.main}
            />
            <Text style={[styles.trendText, trend.isPositive ? styles.trendTextPositive : styles.trendTextNegative]}>
              {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </Card>
  );

  const renderTopPerformingItem = (item: typeof MOCK_PORTFOLIO_ANALYTICS.topPerforming[0]) => (
    <TouchableOpacity
      key={item.id}
      style={styles.topItemCard}
      onPress={() => navigation.navigate('PortfolioManagement')}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.topItemImage} />
      <View style={styles.topItemContent}>
        <Text style={styles.topItemTitle}>{item.title}</Text>
        <Text style={styles.topItemCategory}>{item.category}</Text>
        <View style={styles.topItemStats}>
          <View style={styles.stat}>
            <Ionicons name="heart" size={14} color={colors.error.main} />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble" size={14} color={colors.text.secondary} />
            <Text style={styles.statText}>{item.comments}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="share" size={14} color={colors.text.secondary} />
            <Text style={styles.statText}>{item.shares}</Text>
          </View>
        </View>
        <View style={styles.engagementBadge}>
          <Text style={styles.engagementText}>{item.engagement}% engagement</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryPerformance = () => (
    <Card variant="elevated" padding="xl" style={styles.section}>
      <Text style={styles.sectionTitle}>Category Performance</Text>
      <Text style={styles.sectionSubtitle}>Which categories drive the most engagement?</Text>

      {MOCK_PORTFOLIO_ANALYTICS.categoryPerformance.map((category) => (
        <View key={category.category} style={styles.categoryRow}>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{category.category}</Text>
            <Text style={styles.categoryStats}>
              {category.items} items • {category.likes} likes • {category.comments} comments
            </Text>
          </View>
          <View style={styles.categoryMetrics}>
            <Text style={styles.categoryEngagement}>{category.avgEngagement}% avg</Text>
            <View style={styles.categoryBar}>
              <View
                style={[
                  styles.categoryBarFill,
                  { width: `${(category.avgEngagement / 35) * 100}%` }
                ]}
              />
            </View>
          </View>
        </View>
      ))}
    </Card>
  );

  const renderRecentActivity = () => (
    <Card variant="elevated" padding="xl" style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <Text style={styles.sectionSubtitle}>Latest interactions with your portfolio</Text>

      {MOCK_PORTFOLIO_ANALYTICS.recentActivity.map((activity) => (
        <View key={activity.id} style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons
              name={
                activity.type === 'like' ? 'heart' :
                activity.type === 'comment' ? 'chatbubble' : 'share'
              }
              size={16}
              color={
                activity.type === 'like' ? colors.error.main :
                activity.type === 'comment' ? colors.primary[600] : colors.success.main
              }
            />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>
              <Text style={styles.activityUser}>{activity.user}</Text>
              {' '}
              {activity.type === 'like' ? 'liked' :
               activity.type === 'comment' ? 'commented on' : 'shared'}
              {' '}
              <Text style={styles.activityItem}>{activity.item}</Text>
            </Text>
            {activity.comment && (
              <Text style={styles.activityComment}>"{activity.comment}"</Text>
            )}
            <Text style={styles.activityTime}>{activity.timestamp}</Text>
          </View>
        </View>
      ))}
    </Card>
  );

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

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonActive]}
              onPress={() => setTimeRange(range)}
              activeOpacity={0.7}
            >
              <Text style={[styles.timeRangeText, timeRange === range && styles.timeRangeTextActive]}>
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overview Metrics */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Total Views',
            MOCK_PORTFOLIO_ANALYTICS.overview.totalViews.toLocaleString(),
            'Portfolio impressions',
            'eye',
            { value: 15.3, isPositive: true }
          )}
          {renderMetricCard(
            'Total Likes',
            MOCK_PORTFOLIO_ANALYTICS.overview.totalLikes.toLocaleString(),
            'Customer engagement',
            'heart',
            { value: 8.7, isPositive: true }
          )}
          {renderMetricCard(
            'Comments',
            MOCK_PORTFOLIO_ANALYTICS.overview.totalComments,
            'Conversations started',
            'chatbubble',
            { value: 12.1, isPositive: true }
          )}
          {renderMetricCard(
            'Shares',
            MOCK_PORTFOLIO_ANALYTICS.overview.totalShares,
            'Social reach',
            'share',
            { value: -2.3, isPositive: false }
          )}
        </View>

        {/* Top Performing Items */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Items</Text>
          <Text style={styles.sectionSubtitle}>Your most engaging portfolio pieces</Text>

          {MOCK_PORTFOLIO_ANALYTICS.topPerforming.map((item) => renderTopPerformingItem(item))}
        </Card>

        {/* Category Performance */}
        {renderCategoryPerformance()}

        {/* Recent Activity */}
        {renderRecentActivity()}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Optimize Portfolio"
            onPress={() => navigation.navigate('PortfolioManagement')}
            style={styles.actionButton}
            variant="outline"
          />
          <Button
            title="Create New Item"
            onPress={() => navigation.navigate('PortfolioManagement')}
            style={styles.actionButton}
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