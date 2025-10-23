// Tailor Analytics Dashboard - Key metrics and performance insights

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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

// Mock analytics data
const MOCK_ANALYTICS = {
  rating: 4.9,
  reviewCount: 156,
  completedOrders: 342,
  responseTime: '~1 hour',
  responseTimeMinutes: 45,
  verificationStatus: 'verified',
  monthlyStats: {
    orders: 28,
    revenue: 8500,
    newCustomers: 12,
    avgRating: 4.8,
  },
  portfolioStats: {
    totalItems: 47,
    publishedItems: 42,
    featuredItems: 8,
    totalLikes: 2847,
    totalComments: 156,
    totalShares: 89,
  },
  categoryPerformance: [
    { category: 'Dresses', orders: 45, revenue: 18000, rating: 4.9 },
    { category: 'Traditional', orders: 32, revenue: 15600, rating: 4.8 },
    { category: 'Formal', orders: 28, revenue: 22400, rating: 4.7 },
    { category: 'Casual', orders: 21, revenue: 7350, rating: 4.6 },
  ],
  recentReviews: [
    {
      id: '1',
      customerName: 'Akua Mensah',
      rating: 5,
      comment: 'Absolutely loved my custom dress! Ama was so professional and the quality is outstanding.',
      date: '2024-01-15',
      orderType: 'Evening Dress',
      hasResponse: false,
    },
    {
      id: '2',
      customerName: 'Kofi Asante',
      rating: 4,
      comment: 'Great work on my suit. Only minor adjustments needed. Will definitely recommend!',
      date: '2024-01-12',
      orderType: 'Formal Suit',
      hasResponse: true,
    },
  ],
};

export default function TailorAnalyticsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const renderMetricCard = (
    title: string,
    value: string | number,
    subtitle: string | undefined,
    icon: string,
    trend: { value: number; isPositive: boolean } | undefined,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.metricCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={styles.metricHeader}>
        <View style={styles.metricIcon}>
          <Ionicons name={icon as any} size={24} color={colors.primary[600]} />
        </View>
        {trend && (
          <View style={[styles.trendBadge, trend.isPositive ? styles.trendPositive : styles.trendNegative]}>
            <Ionicons
              name={trend.isPositive ? 'trending-up' : 'trending-down'}
              size={14}
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
    </TouchableOpacity>
  );

  const renderCategoryPerformance = () => (
    <Card variant="elevated" padding="xl" style={styles.section}>
      <Text style={styles.sectionTitle}>Category Performance</Text>
      <Text style={styles.sectionSubtitle}>Your best performing categories this month</Text>

      {MOCK_ANALYTICS.categoryPerformance.map((category) => (
        <View key={category.category} style={styles.categoryRow}>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{category.category}</Text>
            <Text style={styles.categoryStats}>
              {category.orders} orders • GH₵{category.revenue.toLocaleString()}
            </Text>
          </View>
          <View style={styles.categoryRating}>
            <Ionicons name="star" size={14} color={colors.warning.main} />
            <Text style={styles.ratingText}>{category.rating}</Text>
          </View>
        </View>
      ))}
    </Card>
  );

  const renderRecentReviews = () => (
    <Card variant="elevated" padding="xl" style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ReviewManagement')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {MOCK_ANALYTICS.recentReviews.map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <Text style={styles.customerName}>{review.customerName}</Text>
            <View style={styles.reviewMeta}>
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={12}
                    color={i < review.rating ? colors.warning.main : colors.border.light}
                  />
                ))}
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          </View>
          <Text style={styles.reviewOrderType}>{review.orderType}</Text>
          <Text style={styles.reviewComment}>{review.comment}</Text>
          {!review.hasResponse && (
            <TouchableOpacity style={styles.respondButton}>
              <Text style={styles.respondButtonText}>Respond</Text>
            </TouchableOpacity>
          )}
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
          <Text style={styles.headerTitle}>Analytics</Text>
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

        {/* Key Metrics Grid */}
        <View style={styles.metricsGrid}>
          {renderMetricCard(
            'Rating',
            MOCK_ANALYTICS.rating,
            `${MOCK_ANALYTICS.reviewCount} reviews`,
            'star',
            { value: 2.1, isPositive: true },
            () => navigation.navigate('ReviewManagement')
          )}
          {renderMetricCard(
            'Completed Orders',
            MOCK_ANALYTICS.completedOrders,
            'Total completed',
            'checkmark-circle',
            { value: 15.3, isPositive: true }
          )}
          {renderMetricCard(
            'Response Time',
            MOCK_ANALYTICS.responseTime,
            'Average response',
            'time',
            { value: -5.2, isPositive: false },
            () => navigation.navigate('ResponseTimeSettings')
          )}
          {renderMetricCard(
            'Verification',
            MOCK_ANALYTICS.verificationStatus,
            'Trusted status',
            'shield-checkmark',
            undefined,
                        () => navigation.navigate('VerificationStatus')
          )}
        </View>

        {/* Monthly Summary */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.monthlyStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{MOCK_ANALYTICS.monthlyStats.orders}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>GH₵{MOCK_ANALYTICS.monthlyStats.revenue.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Revenue</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{MOCK_ANALYTICS.monthlyStats.newCustomers}</Text>
              <Text style={styles.statLabel}>New Customers</Text>
            </View>
          </View>
        </Card>

        {/* Portfolio Performance */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Performance</Text>
          <View style={styles.portfolioStats}>
            <View style={styles.portfolioStat}>
              <Text style={styles.portfolioStatValue}>{MOCK_ANALYTICS.portfolioStats.totalLikes.toLocaleString()}</Text>
              <Text style={styles.portfolioStatLabel}>Likes</Text>
            </View>
            <View style={styles.portfolioStat}>
              <Text style={styles.portfolioStatValue}>{MOCK_ANALYTICS.portfolioStats.totalComments}</Text>
              <Text style={styles.portfolioStatLabel}>Comments</Text>
            </View>
            <View style={styles.portfolioStat}>
              <Text style={styles.portfolioStatValue}>{MOCK_ANALYTICS.portfolioStats.totalShares}</Text>
              <Text style={styles.portfolioStatLabel}>Shares</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewPortfolioButton}
            onPress={() => navigation.navigate('PortfolioAnalytics')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewPortfolioText}>View Portfolio Analytics</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary[600]} />
          </TouchableOpacity>
        </Card>

        {/* Category Performance */}
        {renderCategoryPerformance()}

        {/* Recent Reviews */}
        {renderRecentReviews()}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Improve Rating"
            onPress={() => navigation.navigate('ReviewManagement')}
            style={styles.actionButton}
            variant="outline"
          />
          <Button
            title="Boost Visibility"
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
    backgroundColor: colors.background.primary,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
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
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  metricTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  metricSubtitle: {
    ...textStyles.small,
    color: colors.text.secondary,
  },

  // Sections
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
  },
  sectionSubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  viewAllText: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Monthly Stats
  monthlyStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...textStyles.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },

  // Portfolio Stats
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xl,
  },
  portfolioStat: {
    alignItems: 'center',
  },
  portfolioStatValue: {
    ...textStyles.h4,
    color: colors.text.primary,
    fontWeight: '700',
  },
  portfolioStatLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  viewPortfolioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  viewPortfolioText: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Category Performance
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.lg,
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
    marginTop: spacing.md,
  },
  categoryRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  ratingText: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
  },

  // Reviews
  reviewItem: {
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  customerName: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  reviewMeta: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  reviewDate: {
    ...textStyles.small,
    color: colors.text.secondary,
  },
  reviewOrderType: {
    ...textStyles.small,
    color: colors.primary[600],
    fontWeight: '500',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  reviewComment: {
    ...textStyles.body,
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  respondButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  respondButtonText: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  actionButton: {
    flex: 1,
  },
});