// Order Detail Screen - Comprehensive order tracking and details

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../../../components/IconButton';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { spacing, radius, shadows } from '../../../design-system/spacing';
import { useAppSelector } from '../../../store/hooks';

type RouteParams = {
  OrderDetail: {
    orderId: string;
  };
};

type NavigationProp = StackNavigationProp<any>;

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  description?: string;
};

type TimelineStep = {
  id: string;
  status: string;
  title: string;
  description: string;
  date: string;
  icon: string;
};

type CustomerData = {
  tailorName: string;
  tailorImage: string;
  orderDate: string;
  appointmentDate: string;
  appointmentTime: string;
  totalAmount: number;
  items: OrderItem[];
  timeline: TimelineStep[];
};

type TailorData = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAvatar: string;
  orderDate: string;
  dueDate: string;
  totalAmount: number;
  measurements: Record<string, number>;
  items: OrderItem[];
  specialInstructions: string;
  timeline: TimelineStep[];
};

type OrderData = {
  id: string;
  status: string;
  service: string;
  customerData: CustomerData;
  tailorData: TailorData;
};

// Mock order data - in real app this would come from API
const mockOrderData: OrderData = {
  id: 'ORD-2025-001',
  status: 'in_progress', // 'pending', 'confirmed', 'in_progress', 'ready', 'completed', 'cancelled'
  service: 'Custom Tailoring',
  // Customer view data
  customerData: {
    tailorName: 'Ama Serwaa',
    tailorImage: 'https://via.placeholder.com/80',
    orderDate: '2025-10-15',
    appointmentDate: '2025-10-20',
    appointmentTime: '2:00 PM - 3:00 PM',
    totalAmount: 550,
    items: [
      { name: 'Custom Dress', quantity: 1, price: 450 },
      { name: 'Premium Silk Fabric', quantity: 1, price: 100 },
    ],
    timeline: [
      {
        id: '1',
        status: 'completed',
        title: 'Order Placed',
        description: 'Your order has been received',
        date: '2025-10-15 10:30 AM',
        icon: 'checkmark-circle',
      },
      {
        id: '2',
        status: 'completed',
        title: 'Payment Confirmed',
        description: 'Payment has been processed successfully',
        date: '2025-10-15 10:35 AM',
        icon: 'card-outline',
      },
      {
        id: '3',
        status: 'completed',
        title: 'Appointment Scheduled',
        description: 'Fitting appointment confirmed',
        date: '2025-10-16 2:00 PM',
        icon: 'calendar-outline',
      },
      {
        id: '4',
        status: 'in_progress',
        title: 'Measurements Taken',
        description: 'Tailor is taking your measurements',
        date: '2025-10-20 2:00 PM',
        icon: 'body-outline',
      },
      {
        id: '5',
        status: 'pending',
        title: 'Garment in Production',
        description: 'Your custom garment is being crafted',
        date: 'Expected: 2025-10-25',
        icon: 'construct-outline',
      },
      {
        id: '6',
        status: 'pending',
        title: 'Quality Check',
        description: 'Final inspection and adjustments',
        date: 'Expected: 2025-10-30',
        icon: 'shield-checkmark-outline',
      },
      {
        id: '7',
        status: 'pending',
        title: 'Ready for Pickup',
        description: 'Your order is ready for collection',
        date: 'Expected: 2025-11-01',
        icon: 'bag-check-outline',
      },
    ],
  },
  // Tailor view data
  tailorData: {
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerPhone: '+233 24 123 4567',
    customerAvatar: 'https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=SJ',
    orderDate: '2025-10-15',
    dueDate: '2025-11-15',
    totalAmount: 550,
    measurements: {
      bust: 34,
      waist: 28,
      hips: 36,
      shoulder: 16,
      armLength: 24,
      inseam: 32,
      neck: 14,
    },
    items: [
      { name: 'Custom Wedding Dress', quantity: 1, price: 450, description: 'White lace gown, floor length, with train' },
      { name: 'Premium Silk Fabric', quantity: 1, price: 100, description: 'Ivory silk for lining and accents' },
    ],
    specialInstructions: 'Please ensure the dress fits comfortably for dancing. Customer prefers minimal alterations after fitting.',
    timeline: [
      {
        id: '1',
        status: 'completed',
        title: 'Order Received',
        description: 'New order from Sarah Johnson',
        date: '2025-10-15 10:30 AM',
        icon: 'checkmark-circle',
      },
      {
        id: '2',
        status: 'completed',
        title: 'Payment Received',
        description: 'Payment processed successfully',
        date: '2025-10-15 10:35 AM',
        icon: 'card-outline',
      },
      {
        id: '3',
        status: 'completed',
        title: 'Initial Consultation',
        description: 'Discussed design preferences and requirements',
        date: '2025-10-16 2:00 PM',
        icon: 'chatbubble-outline',
      },
      {
        id: '4',
        status: 'in_progress',
        title: 'Taking Measurements',
        description: 'Customer measurements recorded',
        date: '2025-10-20 2:00 PM',
        icon: 'body-outline',
      },
      {
        id: '5',
        status: 'pending',
        title: 'Pattern Making',
        description: 'Creating custom patterns based on measurements',
        date: 'Expected: 2025-10-22',
        icon: 'construct-outline',
      },
      {
        id: '6',
        status: 'pending',
        title: 'Fabric Cutting',
        description: 'Cutting fabric according to patterns',
        date: 'Expected: 2025-10-25',
        icon: 'cut-outline',
      },
      {
        id: '7',
        status: 'pending',
        title: 'Sewing & Assembly',
        description: 'Main construction of the garment',
        date: 'Expected: 2025-11-01',
        icon: 'hammer-outline',
      },
      {
        id: '8',
        status: 'pending',
        title: 'Fitting Session',
        description: 'First fitting with customer',
        date: 'Expected: 2025-11-05',
        icon: 'person-outline',
      },
      {
        id: '9',
        status: 'pending',
        title: 'Final Adjustments',
        description: 'Making final alterations',
        date: 'Expected: 2025-11-10',
        icon: 'options-outline',
      },
      {
        id: '10',
        status: 'pending',
        title: 'Quality Check',
        description: 'Final inspection and pressing',
        date: 'Expected: 2025-11-12',
        icon: 'shield-checkmark-outline',
      },
      {
        id: '11',
        status: 'pending',
        title: 'Ready for Delivery',
        description: 'Order ready for pickup/delivery',
        date: 'Expected: 2025-11-15',
        icon: 'bag-check-outline',
      },
    ],
  },
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return colors.success.main;
    case 'in_progress':
      return colors.primary[600];
    case 'pending':
      return colors.text.tertiary;
    default:
      return colors.text.tertiary;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Order Placed';
    case 'confirmed':
      return 'Confirmed';
    case 'in_progress':
      return 'In Progress';
    case 'ready':
      return 'Ready for Pickup';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Unknown';
  }
};

export default function OrderDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'OrderDetail'>>();
  const { orderId } = route.params;
  const userRole = useAppSelector((state) => state.auth.user?.role || 'customer');

  // In real app, fetch order data based on orderId
  const orderData = mockOrderData;
  const isTailorView = userRole === 'tailor';
  const displayData = isTailorView ? orderData.tailorData : orderData.customerData;
  const timeline = isTailorView ? orderData.tailorData.timeline : orderData.customerData.timeline;

  const handleContact = () => {
    if (isTailorView) {
      // Tailor contacting customer
      const tailorData = displayData as typeof mockOrderData.tailorData;
      navigation.navigate('Messaging', {
        tailorId: 'current-tailor', // Would be actual tailor ID
        tailorName: tailorData.customerName,
        conversationId: `order-${orderId}`,
      });
    } else {
      // Customer contacting tailor
      const customerData = displayData as typeof mockOrderData.customerData;
      navigation.navigate('Messaging', {
        tailorId: customerData.tailorName,
        tailorName: customerData.tailorName,
        conversationId: `order-${orderId}`,
      });
    }
  };

  const handleCancelOrder = () => {
    // Show confirmation dialog and cancel order
    // TODO: Implement cancel order functionality
  };

  const handleReschedule = () => {
    // Navigate to reschedule screen
    // TODO: Implement reschedule functionality
  };

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
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Order Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusLeft}>
                <Ionicons
                  name="receipt-outline"
                  size={24}
                  color={colors.primary[600]}
                />
                <View>
                  <Text style={styles.orderId}>Order #{orderData.id}</Text>
                  <Text style={styles.orderDate}>{displayData.orderDate}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(orderData.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(orderData.status) }]}>
                  {getStatusText(orderData.status)}
                </Text>
              </View>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isTailorView ? 'Customer Information' : 'Tailor Information'}
            </Text>
            <View style={styles.tailorCard}>
              <View style={styles.tailorInfo}>
                <View style={styles.tailorAvatar}>
                  <Text style={styles.tailorInitial}>
                    {isTailorView
                      ? (displayData as typeof mockOrderData.tailorData).customerName.charAt(0)
                      : (displayData as typeof mockOrderData.customerData).tailorName.charAt(0)
                    }
                  </Text>
                </View>
                <View>
                  <Text style={styles.tailorName}>
                    {isTailorView
                      ? (displayData as typeof mockOrderData.tailorData).customerName
                      : (displayData as typeof mockOrderData.customerData).tailorName
                    }
                  </Text>
                  <Text style={styles.tailorService}>
                    {isTailorView
                      ? `${(displayData as typeof mockOrderData.tailorData).customerEmail}\n${(displayData as typeof mockOrderData.tailorData).customerPhone}`
                      : orderData.service
                    }
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleContact}
                activeOpacity={0.9}
              >
                <Ionicons name="chatbubble-outline" size={20} color={colors.primary[600]} />
                <Text style={styles.contactText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <View style={styles.itemsCard}>
              {displayData.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.description && (
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    )}
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>GH₵{item.price}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>GH₵{displayData.totalAmount}</Text>
              </View>
            </View>
          </View>

          {/* Appointment Details or Measurements */}
          {isTailorView ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Measurements</Text>
              <View style={styles.measurementsCard}>
                {Object.entries((displayData as typeof mockOrderData.tailorData).measurements).map(([key, value]) => (
                  <View key={key} style={styles.measurementRow}>
                    <Text style={styles.measurementLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </Text>
                    <Text style={styles.measurementValue}>{value}"</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Appointment Details</Text>
              <View style={styles.appointmentCard}>
                <View style={styles.appointmentRow}>
                  <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentLabel}>Date</Text>
                    <Text style={styles.appointmentValue}>{(displayData as typeof mockOrderData.customerData).appointmentDate}</Text>
                  </View>
                </View>
                <View style={styles.appointmentRow}>
                  <Ionicons name="time-outline" size={20} color={colors.text.secondary} />
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentLabel}>Time</Text>
                    <Text style={styles.appointmentValue}>{(displayData as typeof mockOrderData.customerData).appointmentTime}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.rescheduleButton}
                  onPress={handleReschedule}
                  activeOpacity={0.9}
                >
                  <Ionicons name="repeat-outline" size={16} color={colors.primary[600]} />
                  <Text style={styles.rescheduleText}>Request Reschedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Order Timeline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Timeline</Text>
            <View style={styles.timelineCard}>
              {timeline.map((step, index) => (
                <View key={step.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: getStatusColor(step.status) }]}>
                      <Ionicons
                        name={step.icon as any}
                        size={16}
                        color="#FFFFFF"
                      />
                    </View>
                    {index < timeline.length - 1 && (
                      <View style={[styles.timelineLine, { backgroundColor: getStatusColor(step.status) }]} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>{step.title}</Text>
                    <Text style={styles.timelineDescription}>{step.description}</Text>
                    <Text style={styles.timelineDate}>{step.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        {orderData.status === 'pending' || orderData.status === 'confirmed' ? (
          <Button
            title="Cancel Order"
            onPress={handleCancelOrder}
            style={styles.cancelButton}
            variant="outline"
          />
        ) : orderData.status === 'ready' ? (
          <Button
            title="Mark as Picked Up"
            onPress={() => {
              // TODO: Implement mark as picked up functionality
            }}
            style={styles.pickupButton}
          />
        ) : (
          <View style={styles.statusMessage}>
            <Ionicons name="information-circle-outline" size={20} color={colors.text.secondary} />
            <Text style={styles.statusMessageText}>
              {orderData.status === 'completed'
                ? 'Order completed successfully'
                : 'Your order is being processed'}
            </Text>
          </View>
        )}
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.text.primary,
  },

  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xxxl,
  },

  // Status Card
  statusCard: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    marginBottom: spacing.xxxl,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.text.primary,
  },
  orderDate: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },

  // Sections
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },

  // Tailor Card
  tailorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
  },
  tailorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  tailorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  tailorInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary[700],
  },
  tailorName: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.text.primary,
  },
  tailorService: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary[600],
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Items Card
  itemsCard: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  itemQuantity: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  itemPrice: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.lg,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.text.primary,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.primary[700],
  },

  // Measurements Card
  measurementsCard: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  measurementLabel: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
  },
  measurementValue: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.primary[700],
    fontWeight: '600',
  },

  // Appointment Card
  appointmentCard: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
  },
  appointmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
  },
  appointmentValue: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primary[50],
  },
  rescheduleText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Timeline
  timelineCard: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    height: 40,
    marginTop: spacing.sm,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  timelineTitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  timelineDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  timelineDate: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.text.tertiary,
  },

  // Bottom Bar
  bottomBar: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 88,
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.lg,
  },
  cancelButton: {
    borderColor: colors.error.main,
  },
  pickupButton: {
    backgroundColor: colors.success.main,
  },
  statusMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  statusMessageText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
});
