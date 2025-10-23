// Orders List Screen - Complete Implementation

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useGetCustomerOrdersQuery } from '../../../api/orders.api';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';
import { Card } from '../../../components/Card';
import type { Order, OrderStatus } from '../../../types';

const STATUS_FILTERS: Array<{ label: string; value: OrderStatus | 'all' }> = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; label: string }> = {
  pending: { color: colors.warning[700], bg: colors.warning[100], label: 'Pending' },
  accepted: { color: colors.info[700], bg: colors.info[100], label: 'Accepted' },
  confirmed: { color: colors.info[700], bg: colors.info[100], label: 'Confirmed' },
  in_progress: { color: colors.primary[700], bg: colors.primary[100], label: 'In Progress' },
  'in-progress': { color: colors.primary[700], bg: colors.primary[100], label: 'In Progress' },
  ready_for_fitting: { color: colors.success[700], bg: colors.success[100], label: 'Ready for Fitting' },
  completed: { color: colors.success[700], bg: colors.success[100], label: 'Completed' },
  cancelled: { color: colors.error[700], bg: colors.error[100], label: 'Cancelled' },
};

export default function OrdersListScreen() {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | 'all'>('all');

  const { data: orders = [], isLoading, error, refetch } = useGetCustomerOrdersQuery();

  // Filter orders based on selected status
  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedFilter || 
        (selectedFilter === 'in_progress' && order.status === 'in-progress'));

  const handleOrderPress = (orderId: string) => {
    (navigation as any).navigate('OrderDetail', { orderId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount.toFixed(2)}`;
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusConfig = STATUS_CONFIG[item.status];

    return (
      <TouchableOpacity
        onPress={() => handleOrderPress(item.id)}
        activeOpacity={0.7}
        style={styles.orderItemContainer}
      >
        <Card variant="outlined">
          <View style={styles.orderHeader}>
            <View style={styles.orderHeaderLeft}>
              <Text style={styles.orderId}>Order #{item.id.slice(0, 8).toUpperCase()}</Text>
              <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

          <View style={styles.orderBody}>
            <Text style={styles.orderItemsText}>
              {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
            </Text>
            
            {item.items[0]?.garmentType && (
              <Text style={styles.garmentType} numberOfLines={1}>
                {item.items[0].garmentType}
                {item.items.length > 1 && ` +${item.items.length - 1} more`}
              </Text>
            )}
          </View>

          <View style={styles.orderFooter}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>{formatCurrency(item.totalAmount)}</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptyText}>
        {selectedFilter === 'all'
          ? "You haven't placed any orders yet. Start browsing tailors to create your first order!"
          : `No ${selectedFilter} orders found.`}
      </Text>
    </View>
  );

  const renderFilterButton = (filter: { label: string; value: OrderStatus | 'all' }) => {
    const isSelected = selectedFilter === filter.value;
    
    return (
      <TouchableOpacity
        key={filter.value}
        style={[styles.filterButton, isSelected && styles.filterButtonActive]}
        onPress={() => setSelectedFilter(filter.value)}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextActive]}>
          {filter.label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Unable to Load Orders</Text>
          <Text style={styles.errorText}>
            Please check your connection and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSubtitle}>{orders.length} total orders</Text>
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          data={STATUS_FILTERS}
          renderItem={({ item }) => renderFilterButton(item)}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + spacing.xs,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 30,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs - 2,
    lineHeight: 18,
  },

  // Filters
  filtersContainer: {
    backgroundColor: colors.background.primary,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  filtersContent: {
    paddingHorizontal: spacing.lg,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.tertiary,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    lineHeight: 18,
  },
  filterButtonTextActive: {
    color: colors.white,
  },

  // List
  listContent: {
    padding: spacing.lg,
  },
  orderItemContainer: {
    marginBottom: spacing.md,
  },

  // Order Item
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs - 2,
    lineHeight: 20,
  },
  orderDate: {
    fontSize: 13,
    color: colors.text.tertiary,
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm + spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    marginLeft: spacing.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },

  orderBody: {
    marginBottom: spacing.md,
  },
  orderItemsText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs - 2,
    lineHeight: 18,
  },
  garmentType: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: 20,
  },

  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  totalLabel: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginBottom: spacing.xs - 2,
    lineHeight: 16,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 24,
  },
  viewButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary[50],
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary[700],
    lineHeight: 18,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 26,
  },
  emptyText: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 15,
    color: colors.text.secondary,
    marginTop: spacing.lg,
    lineHeight: 20,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
    lineHeight: 26,
  },
  errorText: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary[500],
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    lineHeight: 20,
  },
});
