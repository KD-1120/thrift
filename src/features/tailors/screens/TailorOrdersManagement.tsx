// Tailor Orders Management Screen - Manage incoming orders and update status

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Avatar } from '../../../components/Avatar';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';
import { useGetTailorOrdersQuery, useUpdateOrderStatusMutation } from '../../../api/orders.api';
import type { Order, OrderStatus } from '../../../types';

type NavigationProp = StackNavigationProp<any>;

export default function TailorOrdersManagementScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Fetch real orders from API
  const { data: allOrders = [], isLoading, refetch } = useGetTailorOrdersQuery(undefined);
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active' | 'completed'>('all');

  // Filter orders based on active tab
  const filteredOrders = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return allOrders.filter((o) => o.status === 'pending');
      case 'active':
        return allOrders.filter(
          (o) => o.status === 'in_progress' || o.status === 'in-progress' || o.status === 'confirmed' || o.status === 'accepted'
        );
      case 'completed':
        return allOrders.filter((o) => o.status === 'completed');
      default:
        return allOrders;
    }
  }, [allOrders, activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning.main;
      case 'accepted': return colors.info.main;
      case 'in_progress': return colors.primary[600];
      case 'ready_for_fitting': return colors.info.main;
      case 'completed': return colors.success.main;
      case 'cancelled': return colors.error.main;
      default: return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'ready_for_fitting': return 'Ready for Fitting';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      Alert.alert('Success', `Order ${newStatus} successfully!`);
      refetch();
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      Alert.alert('Error', error?.data?.message || 'Failed to update order status');
    }
  };

  const handleOrderAction = (order: Order, action: 'accept' | 'start' | 'complete' | 'cancel') => {
    switch (action) {
      case 'accept':
        handleUpdateOrderStatus(order.id, 'accepted');
        break;
      case 'start':
        handleUpdateOrderStatus(order.id, 'in_progress');
        break;
      case 'complete':
        handleUpdateOrderStatus(order.id, 'completed');
        break;
      case 'cancel':
        Alert.alert(
          'Cancel Order',
          'Are you sure you want to cancel this order?',
          [
            { text: 'No', style: 'cancel' },
            {
              text: 'Yes',
              style: 'destructive',
              onPress: () => {
                handleUpdateOrderStatus(order.id, 'cancelled');
              },
            },
          ]
        );
        break;
    }
  };

  const renderOrderItem = ({ item: order }: { item: Order }) => {
    const itemName = order.items?.[0]?.garmentType || order.items?.[0]?.name || 'Custom Order';
    const customerIdShort = order.customerId.slice(0, 8);

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
        activeOpacity={0.8}
      >
        <Card variant="elevated" padding="lg" style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View style={styles.customerInfo}>
              <Avatar
                name={`Order ${customerIdShort}`}
                size={40}
              />
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>Order #{order.id.slice(0, 8)}</Text>
                <Text style={styles.orderItem}>{itemName}</Text>
              </View>
            </View>
            <View style={styles.orderMeta}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
              <Text style={styles.orderAmount}>GH₵{order.totalAmount || 0}</Text>
            </View>
          </View>

          {order.specialInstructions && (
            <Text style={styles.orderDescription}>{order.specialInstructions}</Text>
          )}

          <View style={styles.orderFooter}>
            <Text style={styles.dueDate}>
              Created: {new Date(order.createdAt).toLocaleDateString()}
            </Text>
            <View style={styles.actionButtons}>
              {order.status === 'pending' && (
              <>
                <Button
                  title="Accept"
                  onPress={() => handleOrderAction(order, 'accept')}
                  variant="outline"
                  size="small"
                  style={styles.actionButton}
                />
                <Button
                  title="Decline"
                  onPress={() => handleOrderAction(order, 'cancel')}
                  variant="outline"
                  size="small"
                  style={styles.declineButton}
                />
              </>
            )}
            {order.status === 'accepted' && (
              <Button
                title="Start Work"
                onPress={() => handleOrderAction(order, 'start')}
                size="small"
                style={styles.actionButton}
              />
            )}
            {(order.status === 'in_progress' || order.status === 'in-progress') && (
              <Button
                title="Mark Complete"
                onPress={() => handleOrderAction(order, 'complete')}
                size="small"
                style={styles.actionButton}
              />
            )}
            {order.status === 'ready_for_fitting' && (
              <Text style={styles.readyText}>Ready for customer fitting</Text>
            )}
            {order.status === 'completed' && (
              <Text style={styles.completedText}>✓ Completed</Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No orders found</Text>
      <Text style={styles.emptyMessage}>
        {activeTab === 'all'
          ? 'You haven\'t received any orders yet'
          : `No ${activeTab} orders at the moment`
        }
      </Text>
    </View>
  );

  const tabStats = {
    all: allOrders.length,
    pending: allOrders.filter(o => o.status === 'pending').length,
    active: allOrders.filter(o => ['accepted', 'in_progress', 'in-progress', 'ready_for_fitting', 'confirmed'].includes(o.status)).length,
    completed: allOrders.filter(o => o.status === 'completed').length,
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Orders</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <Card variant="elevated" padding="md" style={styles.statCard}>
          <Text style={styles.statNumber}>{tabStats.pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card variant="elevated" padding="md" style={styles.statCard}>
          <Text style={styles.statNumber}>{tabStats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </Card>
        <Card variant="elevated" padding="md" style={styles.statCard}>
          <Text style={styles.statNumber}>{tabStats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </Card>
        <Card variant="elevated" padding="md" style={styles.statCard}>
          <Text style={styles.statNumber}>
            {allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)}
          </Text>
          <Text style={styles.statLabel}>Total (GH₵)</Text>
        </Card>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: 'all', label: 'All', count: tabStats.all },
          { key: 'pending', label: 'Pending', count: tabStats.pending },
          { key: 'active', label: 'Active', count: tabStats.active },
          { key: 'completed', label: 'Completed', count: tabStats.completed },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key as any)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredOrders.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary[600],
  },
  tabText: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
    fontSize: 12,
  },
  tabTextActive: {
    color: colors.primary[600],
    fontWeight: '600',
  },

  // List
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  emptyList: {
    flex: 1,
  },
  separator: {
    height: spacing.md,
  },

  // Order Cards
  orderCard: {
    marginBottom: spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  customerName: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    fontSize: 15,
  },
  orderItem: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    fontSize: 13,
    lineHeight: 18,
  },
  orderMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
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
  },
  orderDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 22,
    fontSize: 14,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    ...textStyles.small,
    color: colors.text.tertiary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    minWidth: 80,
  },
  declineButton: {
    minWidth: 80,
    borderColor: colors.error.main,
  },
  readyText: {
    ...textStyles.bodyMedium,
    color: colors.info.main,
    fontWeight: '600',
  },
  completedText: {
    ...textStyles.bodyMedium,
    color: colors.success.main,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  emptyTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
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
});