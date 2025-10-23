// Booking Flow Screen - Multi-step booking process for custom tailoring services

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { IconButton } from '../components/IconButton';
import { Button } from '../components/Button';
import { colors } from '../design-system/colors';
import { spacing, radius, shadows } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';

type RouteParams = {
  BookingFlow: {
    serviceId: string;
    tailorId: string;
  };
};

type NavigationProp = StackNavigationProp<{
  MeasurementsInput: { bookingData: any };
  BookingReview: { bookingData: any };
  OrderDetail: { orderId: string };
}>;

// Booking Steps
const STEPS = ['Details', 'Fabric', 'Schedule', 'Measurements', 'Review'];

// Fabric Options
const FABRIC_OPTIONS = [
  { id: '1', name: 'Cotton', price: 0, icon: 'shirt-outline' },
  { id: '2', name: 'Silk', price: 50, icon: 'sparkles' },
  { id: '3', name: 'Satin', price: 70, icon: 'star' },
  { id: '4', name: 'Lace', price: 90, icon: 'flower-outline' },
  { id: '5', name: 'Custom Fabric', price: 0, icon: 'color-palette-outline' },
];

// Time Slots
const TIME_SLOTS = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM',
];

export default function BookingFlowScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'BookingFlow'>>();
  const { serviceId, tailorId } = route.params;

  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    // Step 1: Details
    colorPreference: '',
    designNotes: '',
    referenceImages: [],

    // Step 2: Fabric
    selectedFabric: '',
    bringOwnFabric: false,

    // Step 3: Schedule
    appointmentDate: '',
    appointmentTime: '',
    urgentDelivery: false,

    // Step 4: Measurements
    hasMeasurements: false,

    // Pricing
    basePrice: 450,
    fabricPrice: 0,
    urgentFee: 0,
  });

  const handleNext = () => {
    if (currentStep === 3 && !bookingData.hasMeasurements) {
      // Navigate to measurements input
      navigation.navigate('MeasurementsInput', { bookingData });
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit booking
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = () => {
    // Navigate to review screen for final confirmation
    navigation.navigate('BookingReview', { bookingData });
  };

  const updateBookingData = (field: string, value: any) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const getTotalPrice = () => {
    return bookingData.basePrice + bookingData.fabricPrice + bookingData.urgentFee;
  };

  // Step 1: Details
  const renderDetailsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Tell us about your vision</Text>
      <Text style={styles.stepDescription}>
        Help the tailor understand what you're looking for
      </Text>

      {/* Color Preference */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Color Preference</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Navy blue, Red, etc."
          placeholderTextColor={colors.text.tertiary}
          value={bookingData.colorPreference}
          onChangeText={(text) => updateBookingData('colorPreference', text)}
        />
      </View>

      {/* Design Notes */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Design Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe the design you want..."
          placeholderTextColor={colors.text.tertiary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={bookingData.designNotes}
          onChangeText={(text) => updateBookingData('designNotes', text)}
        />
      </View>

      {/* Reference Images */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Reference Images (Optional)</Text>
        <TouchableOpacity style={styles.uploadButton} activeOpacity={0.9}>
          <Ionicons name="cloud-upload-outline" size={24} color={colors.primary[600]} />
          <Text style={styles.uploadText}>Upload Images</Text>
          <Text style={styles.uploadSubtext}>PNG, JPG up to 10MB</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Step 2: Fabric
  const renderFabricStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Your Fabric</Text>
      <Text style={styles.stepDescription}>Select the fabric type for your garment</Text>

      {/* Fabric Options */}
      <View style={styles.fabricGrid}>
        {FABRIC_OPTIONS.map((fabric) => (
          <TouchableOpacity
            key={fabric.id}
            style={[
              styles.fabricCard,
              bookingData.selectedFabric === fabric.id && styles.fabricCardActive,
            ]}
            onPress={() => {
              updateBookingData('selectedFabric', fabric.id);
              updateBookingData('fabricPrice', fabric.price);
              updateBookingData('bringOwnFabric', false);
            }}
            activeOpacity={0.9}
          >
            <Ionicons
              name={fabric.icon as any}
              size={32}
              color={
                bookingData.selectedFabric === fabric.id
                  ? colors.primary[600]
                  : colors.text.tertiary
              }
            />
            <Text
              style={[
                styles.fabricName,
                bookingData.selectedFabric === fabric.id && styles.fabricNameActive,
              ]}
            >
              {fabric.name}
            </Text>
            {fabric.price > 0 && (
              <Text style={styles.fabricPrice}>+GH₵{fabric.price}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Bring Own Fabric */}
      <TouchableOpacity
        style={styles.ownFabricOption}
        onPress={() => {
          updateBookingData('bringOwnFabric', !bookingData.bringOwnFabric);
          if (!bookingData.bringOwnFabric) {
            updateBookingData('selectedFabric', '');
            updateBookingData('fabricPrice', 0);
          }
        }}
        activeOpacity={0.9}
      >
        <View style={styles.ownFabricLeft}>
          <MaterialCommunityIcons name="basket-outline" size={24} color={colors.text.primary} />
          <View>
            <Text style={styles.ownFabricTitle}>I'll bring my own fabric</Text>
            <Text style={styles.ownFabricSubtext}>No additional cost</Text>
          </View>
        </View>
        <Ionicons
          name={bookingData.bringOwnFabric ? 'checkbox' : 'square-outline'}
          size={24}
          color={bookingData.bringOwnFabric ? colors.primary[600] : colors.neutral[400]}
        />
      </TouchableOpacity>
    </View>
  );

  // Step 3: Schedule
  const renderScheduleStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Schedule Appointment</Text>
      <Text style={styles.stepDescription}>Pick a date and time for fitting</Text>

      {/* Date Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Appointment Date</Text>
        <TouchableOpacity style={styles.dateButton} activeOpacity={0.9}>
          <Ionicons name="calendar-outline" size={20} color={colors.text.primary} />
          <Text style={styles.dateButtonText}>
            {bookingData.appointmentDate || 'Select Date'}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      {/* Time Slots */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Preferred Time</Text>
        <View style={styles.timeSlotsGrid}>
          {TIME_SLOTS.map((slot) => (
            <TouchableOpacity
              key={slot}
              style={[
                styles.timeSlot,
                bookingData.appointmentTime === slot && styles.timeSlotActive,
              ]}
              onPress={() => updateBookingData('appointmentTime', slot)}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  bookingData.appointmentTime === slot && styles.timeSlotTextActive,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Urgent Delivery */}
      <TouchableOpacity
        style={styles.urgentOption}
        onPress={() => {
          const isUrgent = !bookingData.urgentDelivery;
          updateBookingData('urgentDelivery', isUrgent);
          updateBookingData('urgentFee', isUrgent ? 100 : 0);
        }}
        activeOpacity={0.9}
      >
        <View style={styles.urgentLeft}>
          <Ionicons name="flash" size={24} color={colors.warning.main} />
          <View>
            <Text style={styles.urgentTitle}>Urgent Delivery</Text>
            <Text style={styles.urgentSubtext}>Delivered in 1 week (+GH₵100)</Text>
          </View>
        </View>
        <Ionicons
          name={bookingData.urgentDelivery ? 'checkbox' : 'square-outline'}
          size={24}
          color={bookingData.urgentDelivery ? colors.primary[600] : colors.neutral[400]}
        />
      </TouchableOpacity>
    </View>
  );

  // Step 4: Measurements
  const renderMeasurementsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Body Measurements</Text>
      <Text style={styles.stepDescription}>
        Accurate measurements ensure the perfect fit
      </Text>

      {/* Options */}
      <TouchableOpacity
        style={styles.measurementOption}
        onPress={() => updateBookingData('hasMeasurements', true)}
        activeOpacity={0.9}
      >
        <View style={styles.measurementLeft}>
          <Ionicons name="checkmark-circle" size={32} color={colors.success.main} />
          <View>
            <Text style={styles.measurementTitle}>I have my measurements</Text>
            <Text style={styles.measurementSubtext}>Enter them in the next step</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.measurementOption}
        onPress={() => updateBookingData('hasMeasurements', false)}
        activeOpacity={0.9}
      >
        <View style={styles.measurementLeft}>
          <Ionicons name="person-outline" size={32} color={colors.primary[600]} />
          <View>
            <Text style={styles.measurementTitle}>Schedule a fitting</Text>
            <Text style={styles.measurementSubtext}>Tailor will take measurements</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
      </TouchableOpacity>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color={colors.info.main} />
        <Text style={styles.infoText}>
          The tailor will take measurements during your appointment if you don't have them
        </Text>
      </View>
    </View>
  );

  // Step 5: Review
  const renderReviewStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review & Confirm</Text>
      <Text style={styles.stepDescription}>Check your booking details</Text>

      {/* Summary Cards */}
      <View style={styles.reviewCard}>
        <Text style={styles.reviewCardTitle}>Service Details</Text>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Color:</Text>
          <Text style={styles.reviewValue}>{bookingData.colorPreference || 'Not specified'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Fabric:</Text>
          <Text style={styles.reviewValue}>
            {bookingData.bringOwnFabric
              ? 'Own fabric'
              : FABRIC_OPTIONS.find((f) => f.id === bookingData.selectedFabric)?.name || 'Not selected'}
          </Text>
        </View>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewCardTitle}>Appointment</Text>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Date:</Text>
          <Text style={styles.reviewValue}>{bookingData.appointmentDate || 'Not selected'}</Text>
        </View>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Time:</Text>
          <Text style={styles.reviewValue}>{bookingData.appointmentTime || 'Not selected'}</Text>
        </View>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewCardTitle}>Pricing</Text>
        <View style={styles.reviewRow}>
          <Text style={styles.reviewLabel}>Base Price:</Text>
          <Text style={styles.reviewValue}>GH₵{bookingData.basePrice}</Text>
        </View>
        {bookingData.fabricPrice > 0 && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Fabric:</Text>
            <Text style={styles.reviewValue}>GH₵{bookingData.fabricPrice}</Text>
          </View>
        )}
        {bookingData.urgentFee > 0 && (
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Urgent Delivery:</Text>
            <Text style={styles.reviewValue}>GH₵{bookingData.urgentFee}</Text>
          </View>
        )}
        <View style={[styles.reviewRow, styles.reviewTotal]}>
          <Text style={styles.reviewTotalLabel}>Total:</Text>
          <Text style={styles.reviewTotalValue}>GH₵{getTotalPrice()}</Text>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderDetailsStep();
      case 1:
        return renderFabricStep();
      case 2:
        return renderScheduleStep();
      case 3:
        return renderMeasurementsStep();
      case 4:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          color={colors.text.primary}
          onPress={handleBack}
        />
        <Text style={styles.headerTitle}>Book Service</Text>
        <IconButton
          icon="close"
          size={24}
          color={colors.text.primary}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        {STEPS.map((step, index) => (
          <View key={step} style={styles.progressStep}>
            <View
              style={[
                styles.progressDot,
                index <= currentStep && styles.progressDotActive,
                index < currentStep && styles.progressDotCompleted,
              ]}
            >
              {index < currentStep ? (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.progressNumber,
                    index <= currentStep && styles.progressNumberActive,
                  ]}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.progressLabel,
                index === currentStep && styles.progressLabelActive,
              ]}
            >
              {step}
            </Text>
            {index < STEPS.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  index < currentStep && styles.progressLineActive,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      {/* Step Content */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomPrice}>GH₵{getTotalPrice()}</Text>
        </View>
        <Button
          title={currentStep === STEPS.length - 1 ? 'Confirm Booking' : 'Continue'}
          onPress={handleNext}
          style={styles.continueButton}
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

  // Progress
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
    minHeight: 100,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    zIndex: 2,
  },
  progressDotActive: {
    backgroundColor: colors.primary[600],
  },
  progressDotCompleted: {
    backgroundColor: colors.success.main,
  },
  progressNumber: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral[600],
    fontWeight: '600',
  },
  progressNumberActive: {
    color: '#FFFFFF',
  },
  progressLabel: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  progressLabelActive: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  progressLine: {
    position: 'absolute',
    top: 20,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: colors.neutral[300],
    zIndex: 1,
  },
  progressLineActive: {
    backgroundColor: colors.success.main,
  },

  // Content
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: spacing.xxxl,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
    marginBottom: spacing.xxxl,
  },

  // Form Inputs
  inputGroup: {
    marginBottom: spacing.xxl,
  },
  label: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 48,
  },
  textArea: {
    minHeight: 120,
    paddingTop: spacing.lg,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    minHeight: 140,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border.main,
    borderRadius: radius.lg,
    backgroundColor: colors.background.secondary,
  },
  uploadText: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.primary[600],
    fontWeight: '600',
    marginTop: spacing.md,
  },
  uploadSubtext: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.tertiary,
    marginTop: spacing.xs,
  },

  // Fabric Selection
  fabricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  fabricCard: {
    flex: 1,
    minWidth: 110,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.secondary,
    gap: spacing.md,
  },
  fabricCardActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  fabricName: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  fabricNameActive: {
    color: colors.primary[700],
  },
  fabricPrice: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.tertiary,
  },
  ownFabricOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    minHeight: 72,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
  },
  ownFabricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    flex: 1,
  },
  ownFabricTitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
  },
  ownFabricSubtext: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.tertiary,
    marginTop: 2,
  },

  // Schedule
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.secondary,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  timeSlot: {
    flex: 1,
    minWidth: 150,
    minHeight: 48,
    justifyContent: 'center',
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
  },
  timeSlotActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  timeSlotText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text.primary,
    textAlign: 'center',
  },
  timeSlotTextActive: {
    color: colors.primary[700],
    fontWeight: '600',
  },
  urgentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    minHeight: 72,
    borderWidth: 1,
    borderColor: colors.warning.light,
    borderRadius: radius.lg,
    backgroundColor: colors.warning.light,
    marginTop: spacing.xxl,
  },
  urgentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    flex: 1,
  },
  urgentTitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
  },
  urgentSubtext: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.tertiary,
    marginTop: 2,
  },

  // Measurements
  measurementOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xxl,
    minHeight: 88,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    marginBottom: spacing.lg,
  },
  measurementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    flex: 1,
  },
  measurementTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
    fontWeight: '600',
  },
  measurementSubtext: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.info.light,
    marginTop: spacing.xxl,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.info.dark,
  },

  // Review
  reviewCard: {
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    marginBottom: spacing.lg,
  },
  reviewCardTitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  reviewLabel: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.secondary,
  },
  reviewValue: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text.primary,
    fontWeight: '600',
  },
  reviewTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    marginTop: spacing.md,
    paddingTop: spacing.lg,
  },
  reviewTotalLabel: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text.primary,
  },
  reviewTotalValue: {
    fontSize: 20,
    lineHeight: 28,
    color: colors.primary[700],
    fontWeight: '700',
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
  continueButton: {
    paddingHorizontal: spacing.xl * 2,
    minHeight: 52,
  },
});
