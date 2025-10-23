// Booking Review Screen - Final review and confirmation of booking details

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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton } from '../components/IconButton';
import { Button } from '../components/Button';
import { colors } from '../design-system/colors';
import { spacing, radius, shadows } from '../design-system/spacing';

type RouteParams = {
  BookingReview: {
    bookingData: any;
  };
};

type NavigationProp = StackNavigationProp<any>;

export default function BookingReviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'BookingReview'>>();
  const { bookingData } = route.params;

  const handleConfirmBooking = () => {
    // Submit booking and navigate to success/order detail
    console.log('Booking confirmed:', bookingData);
    navigation.navigate('OrderDetail', { orderId: 'new-order-id' });
  };

  const handleEdit = (step: string) => {
    // Navigate back to specific step for editing
    switch (step) {
      case 'details':
        navigation.navigate('BookingFlow', { serviceId: bookingData.serviceId, tailorId: bookingData.tailorId });
        break;
      case 'measurements':
        navigation.navigate('MeasurementsInput', { bookingData });
        break;
      // Add other steps as needed
    }
  };

  const getTotalPrice = () => {
    return bookingData.basePrice + (bookingData.fabricPrice || 0) + (bookingData.urgentFee || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not selected';
    // Simple date formatting - in real app you'd use a proper date library
    return dateString;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Not selected';
    return timeString;
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
        <Text style={styles.headerTitle}>Review Booking</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Service Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Service Details</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit('details')}
                activeOpacity={0.9}
              >
                <Ionicons name="pencil" size={16} color={colors.primary[600]} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Service</Text>
                <Text style={styles.cardValue}>Custom Tailoring</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Color Preference</Text>
                <Text style={styles.cardValue}>{bookingData.colorPreference || 'Not specified'}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Design Notes</Text>
                <Text style={styles.cardValue}>{bookingData.designNotes || 'None'}</Text>
              </View>
            </View>
          </View>

          {/* Fabric Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Fabric & Materials</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit('fabric')}
                activeOpacity={0.9}
              >
                <Ionicons name="pencil" size={16} color={colors.primary[600]} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardLabel}>Fabric Type</Text>
                <Text style={styles.cardValue}>
                  {bookingData.bringOwnFabric
                    ? 'Bring my own fabric'
                    : bookingData.selectedFabric
                      ? 'Premium fabric selected'
                      : 'Not selected'}
                </Text>
              </View>
              {bookingData.fabricPrice > 0 && (
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>Fabric Cost</Text>
                  <Text style={styles.cardValue}>GH₵{bookingData.fabricPrice}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Schedule */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Appointment Schedule</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit('schedule')}
                activeOpacity={0.9}
              >
                <Ionicons name="pencil" size={16} color={colors.primary[600]} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Ionicons name="calendar-outline" size={20} color={colors.text.secondary} />
                <View style={styles.scheduleInfo}>
                  <Text style={styles.cardLabel}>Date</Text>
                  <Text style={styles.cardValue}>{formatDate(bookingData.appointmentDate)}</Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <Ionicons name="time-outline" size={20} color={colors.text.secondary} />
                <View style={styles.scheduleInfo}>
                  <Text style={styles.cardLabel}>Time</Text>
                  <Text style={styles.cardValue}>{formatTime(bookingData.appointmentTime)}</Text>
                </View>
              </View>
              {bookingData.urgentDelivery && (
                <View style={styles.cardRow}>
                  <Ionicons name="flash" size={20} color={colors.warning.main} />
                  <View style={styles.scheduleInfo}>
                    <Text style={styles.cardLabel}>Delivery</Text>
                    <Text style={styles.cardValue}>Urgent (1 week)</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Measurements */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Measurements</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit('measurements')}
                activeOpacity={0.9}
              >
                <Ionicons name="pencil" size={16} color={colors.primary[600]} />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Ionicons name="body-outline" size={20} color={colors.text.secondary} />
                <View style={styles.measurementInfo}>
                  <Text style={styles.cardLabel}>Status</Text>
                  <Text style={styles.cardValue}>
                    {bookingData.hasMeasurements ? 'Measurements provided' : 'Will be taken at appointment'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Pricing Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing Summary</Text>

            <View style={styles.pricingCard}>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingLabel}>Base Service</Text>
                <Text style={styles.pricingValue}>GH₵{bookingData.basePrice}</Text>
              </View>
              {bookingData.fabricPrice > 0 && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Fabric Cost</Text>
                  <Text style={styles.pricingValue}>GH₵{bookingData.fabricPrice}</Text>
                </View>
              )}
              {bookingData.urgentFee > 0 && (
                <View style={styles.pricingRow}>
                  <Text style={styles.pricingLabel}>Urgent Delivery</Text>
                  <Text style={styles.pricingValue}>GH₵{bookingData.urgentFee}</Text>
                </View>
              )}
              <View style={[styles.pricingRow, styles.pricingTotal]}>
                <Text style={styles.pricingTotalLabel}>Total</Text>
                <Text style={styles.pricingTotalValue}>GH₵{getTotalPrice()}</Text>
              </View>
            </View>
          </View>

          {/* Terms & Conditions */}
          <View style={styles.termsSection}>
            <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.text.secondary} />
            <View style={styles.termsContent}>
              <Text style={styles.termsTitle}>Terms & Conditions</Text>
              <Text style={styles.termsText}>
                By confirming this booking, you agree to our terms of service. The tailor will contact you
                to confirm details. Cancellations must be made 24 hours in advance.
              </Text>
            </View>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>Total Amount</Text>
          <Text style={styles.bottomPrice}>GH₵{getTotalPrice()}</Text>
        </View>
        <Button
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          style={styles.confirmButton}
        />
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

  // Sections
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.text.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.primary[50],
  },
  editButtonText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Cards
  card: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    gap: spacing.md,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  cardLabel: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.secondary,
    flex: 1,
  },
  cardValue: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'right',
  },

  // Schedule specific
  scheduleInfo: {
    flex: 1,
  },

  // Measurements specific
  measurementInfo: {
    flex: 1,
  },

  // Pricing
  pricingCard: {
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  pricingLabel: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  pricingValue: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
  },
  pricingTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    marginTop: spacing.md,
    paddingTop: spacing.lg,
  },
  pricingTotalLabel: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  pricingTotalValue: {
    fontSize: 18,
    lineHeight: 24,
    color: colors.primary[700],
    fontWeight: '700',
  },

  // Terms
  termsSection: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.info.light,
    marginBottom: spacing.xxxl,
  },
  termsContent: {
    flex: 1,
  },
  termsTitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.info.dark,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.info.dark,
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 88,
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.lg,
  },
  bottomLeft: {
    gap: spacing.xs,
  },
  bottomLabel: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.secondary,
  },
  bottomPrice: {
    fontSize: 24,
    lineHeight: 32,
    color: colors.primary[700],
    fontWeight: '700',
  },
  confirmButton: {
    paddingHorizontal: spacing.xl * 2,
    minHeight: 52,
  },
});