// Tailor Dashboard Screen - Main dashboard for tailors

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Avatar } from '../../../components/Avatar';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';
import { useAppSelector } from '../../../store/hooks';
import { useGetTailorQuery } from '../../../api/tailors.api';
import { useGetTailorOrdersQuery } from '../../../api/orders.api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<any>;

export default function TailorDashboardScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector((state) => state.auth.user);

  // Fetch tailor profile
  const { data: tailorProfile, isLoading: isLoadingProfile } = useGetTailorQuery(
    user?.id || '',
    { skip: !user?.id || user?.role !== 'tailor' }
  );

  // Fetch all tailor orders
  const { data: allOrders = [], isLoading: isLoadingOrders } = useGetTailorOrdersQuery(undefined, {
    skip: !user?.id || user?.role !== 'tailor',
  });

  // Calculate stats from real data
  const stats = useMemo(() => {
    const activeOrders = allOrders.filter(
      (o) => o.status === 'in_progress' || o.status === 'in-progress' || o.status === 'confirmed'
    ).length;
    const completedOrders = allOrders.filter((o) => o.status === 'completed').length;
    const pendingOrders = allOrders.filter((o) => o.status === 'pending').length;
    const totalEarnings = allOrders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      activeOrders,
      completedOrders,
      totalEarnings: Math.round(totalEarnings),
      pendingOrders,
    };
  }, [allOrders]);

  // Get recent orders (last 5)
  const recentOrders = useMemo(() => {
    return [...allOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [allOrders]);

  const quickActions = [
    {
      id: 'analytics',
      title: 'View Analytics',
      subtitle: 'Track your performance',
      icon: 'stats-chart-outline',
      screen: 'TailorAnalytics',
    },
    {
      id: 'profile',
      title: 'Update Profile',
      subtitle: 'Manage your business info',
      icon: 'person-outline',
      screen: 'TailorProfileManagement',
    },
    {
      id: 'portfolio',
      title: 'Build Portfolio',
      subtitle: 'Add your latest work',
      icon: 'images-outline',
      screen: 'PortfolioManagement',
    },
    {
      id: 'orders',
      title: 'Manage Orders',
      subtitle: 'View and update orders',
      icon: 'receipt-outline',
      screen: 'TailorOrdersManagement',
    },
    {
      id: 'verification',
      title: 'Get Verified',
      subtitle: 'Increase credibility',
      icon: 'shield-checkmark-outline',
      screen: 'VerificationSubmission',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning.main;
      case 'in_progress': return colors.primary[600];
      case 'completed': return colors.success.main;
      default: return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const isLoading = isLoadingProfile || isLoadingOrders;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Avatar
              uri={tailorProfile?.avatar || undefined}
              name={tailorProfile?.businessName || user?.name || 'Tailor'}
              size={64}
            />
            <View style={styles.headerText}>
              <Text style={styles.welcomeText}>Welcome back!</Text>
              <Text style={styles.businessName}>
                {tailorProfile?.businessName || user?.name || 'Your Business'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={26} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card variant="elevated" padding="xl" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="receipt" size={32} color={colors.primary[600]} />
            </View>
            <Text style={styles.statNumber}>{stats.activeOrders}</Text>
            <Text style={styles.statLabel}>Active Orders</Text>
          </Card>

          <Card variant="elevated" padding="xl" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle" size={32} color={colors.success.main} />
            </View>
            <Text style={styles.statNumber}>{stats.completedOrders}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Card>

          <Card variant="elevated" padding="xl" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="cash" size={32} color={colors.semantic.success} />
            </View>
            <Text style={styles.statNumber}>GH₵{stats.totalEarnings}</Text>
            <Text style={styles.statLabel}>Total Earnings</Text>
          </Card>

          <Card variant="elevated" padding="xl" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Ionicons name="time" size={32} color={colors.warning.main} />
            </View>
            <Text style={styles.statNumber}>{stats.pendingOrders}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => navigation.navigate(action.screen)}
                activeOpacity={0.8}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon as any} size={36} color={colors.primary[600]} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Recent Orders */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TailorOrdersManagement')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyStateText}>No orders yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Orders from customers will appear here
              </Text>
            </View>
          ) : (
            recentOrders.map((order, index) => {
              const itemName = order.items?.[0]?.garmentType || order.items?.[0]?.name || 'Custom Order';
              const customerInitials = 'C';

              return (
                <TouchableOpacity
                  key={order.id}
                  style={[
                    styles.orderItem,
                    index === recentOrders.length - 1 && styles.orderItemLast
                  ]}
                  onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                  activeOpacity={0.7}
                >
                  <View style={styles.orderLeft}>
                    <View style={styles.orderAvatar}>
                      <Text style={styles.orderInitial}>
                        {customerInitials}
                      </Text>
                    </View>
                    <View style={styles.orderInfo}>
                      <Text style={styles.orderCustomer}>Order #{order.id.slice(0, 8)}</Text>
                      <Text style={styles.orderItemName}>{itemName}</Text>
                    </View>
                  </View>

                  <View style={styles.orderRight}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                    <Text style={styles.orderAmount}>GH₵{order.totalAmount || 0}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },
  scrollContent: {
    paddingBottom: spacing.huge,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background.primary,
    marginBottom: spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: spacing.md,
  },
  headerText: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  welcomeText: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    fontSize: 14,
  },
  businessName: {
    ...textStyles.h4,
    color: colors.text.primary,
    fontSize: 17,
    lineHeight: 22,
  },
  notificationButton: {
    padding: spacing.md,
  },

  // Stats - Grid Layout
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
    alignItems: 'center',
    minHeight: 150,
  },
  statIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statNumber: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontSize: 26,
    fontWeight: '700',
  },
  statLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: spacing.xs,
  },

  // Sections
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
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
    marginBottom: spacing.lg,
  },
  seeAllText: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Quick Actions - Grid Layout
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  actionCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.xl * 2 - spacing.lg) / 2,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  actionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  actionTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.sm,
    fontSize: 15,
  },
  actionSubtitle: {
    ...textStyles.small,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 12,
  },

  // Orders
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  orderItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  orderInitial: {
    ...textStyles.bodyMedium,
    color: colors.primary[700],
    fontWeight: '600',
    fontSize: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderCustomer: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    fontSize: 15,
  },
  orderItemName: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
  },
  orderRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  statusText: {
    ...textStyles.small,
    fontWeight: '600',
    fontSize: 11,
  },
  orderAmount: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 15,
  },

  // Loading
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

  // Empty State
  emptyState: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
    marginTop: spacing.lg,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    ...textStyles.body,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: 14,
  },
});