import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '../../../components/Button';
import { textStyles } from '../../../design-system/typography';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateTailorProfileMutation } from '../../../api/tailors.api';
import { useAppSelector } from '../../../store/hooks';
import { Alert } from 'react-native';

interface ServicesStepProps {
  onNext: () => void;
  onBack: () => void;
}

// Popular specialty suggestions
const SUGGESTED_SPECIALTIES = [
  'Wedding Gowns',
  'Traditional Wear',
  'Suits & Tuxedos',
  'Casual Wear',
  'Kaftans',
  'Office Wear',
  'Children\'s Clothing',
  'Alterations',
  'Custom Designs',
  'Party Dresses',
  'African Print',
  'Uniforms',
];

// Common turnaround time options
const TURNAROUND_OPTIONS = [
  '1-2 days',
  '3-5 days',
  '1 week',
  '1-2 weeks',
  '2-4 weeks',
];

const ServicesStep: React.FC<ServicesStepProps> = ({ onNext, onBack }) => {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('');
  const [showCustomSpecialty, setShowCustomSpecialty] = useState(false);
  const [updateTailorProfile, { isLoading }] = useUpdateTailorProfileMutation();
  const user = useAppSelector((state) => state.auth.user);

  const toggleSpecialty = (specialty: string) => {
    if (specialties.includes(specialty)) {
      setSpecialties(specialties.filter((s) => s !== specialty));
    } else {
      setSpecialties([...specialties, specialty]);
    }
  };

  const addCustomSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
      setShowCustomSpecialty(false);
    }
  };

  const selectTurnaroundTime = (time: string) => {
    setTurnaroundTime(time);
  };

  const handleFinish = async () => {
    if (!user) return;

    // Validation
    if (specialties.length === 0) {
      Alert.alert('Specialties Required', 'Please select at least one specialty.');
      return;
    }

    if (!minPrice || !maxPrice) {
      Alert.alert('Price Range Required', 'Please enter your price range.');
      return;
    }

    if (parseInt(minPrice, 10) >= parseInt(maxPrice, 10)) {
      Alert.alert('Invalid Price Range', 'Minimum price must be less than maximum price.');
      return;
    }

    if (!turnaroundTime) {
      Alert.alert('Turnaround Time Required', 'Please select your typical turnaround time.');
      return;
    }

    try {
      await updateTailorProfile({
        id: user.id,
        data: {
          specialties,
          priceRange: { min: parseInt(minPrice, 10), max: parseInt(maxPrice, 10) },
          turnaroundTime,
        },
      }).unwrap();
      onNext();
    } catch (error) {
      Alert.alert('Error', 'Failed to save services. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Define Your Services</Text>
        <Text style={styles.subtitle}>
          Let clients know what you specialize in, your price range, and typical turnaround time.
        </Text>

        {/* Specialties Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkmark-circle" size={24} color={colors.primary[600]} />
            <Text style={styles.sectionTitle}>Specialties</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Select all services you offer {specialties.length > 0 && `(${specialties.length} selected)`}
          </Text>

          {/* Suggested Specialties */}
          <View style={styles.specialtiesGrid}>
            {SUGGESTED_SPECIALTIES.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={[
                  styles.specialtyChip,
                  specialties.includes(specialty) && styles.specialtyChipSelected,
                ]}
                onPress={() => toggleSpecialty(specialty)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.specialtyChipText,
                    specialties.includes(specialty) && styles.specialtyChipTextSelected,
                  ]}
                >
                  {specialty}
                </Text>
                {specialties.includes(specialty) && (
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary[600]} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Specialty Input */}
          {!showCustomSpecialty ? (
            <TouchableOpacity
              style={styles.addCustomButton}
              onPress={() => setShowCustomSpecialty(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.primary[600]} />
              <Text style={styles.addCustomText}>Add Custom Specialty</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.customSpecialtyContainer}>
              <TextInput
                style={styles.customSpecialtyInput}
                value={newSpecialty}
                onChangeText={setNewSpecialty}
                placeholder="e.g., Beaded Gowns"
                placeholderTextColor={colors.text.tertiary}
                autoFocus
                onSubmitEditing={addCustomSpecialty}
              />
              <TouchableOpacity style={styles.addButton} onPress={addCustomSpecialty}>
                <Ionicons name="checkmark" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowCustomSpecialty(false);
                  setNewSpecialty('');
                }}
              >
                <Ionicons name="close" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Price Range Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cash-outline" size={24} color={colors.primary[600]} />
            <Text style={styles.sectionTitle}>Price Range</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Set your typical price range per garment in GH₵
          </Text>
          <View style={styles.priceRangeContainer}>
            <View style={styles.priceInputContainer}>
              <Text style={styles.priceLabel}>Minimum</Text>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.currencySymbol}>GH₵</Text>
                <TextInput
                  style={styles.priceInput}
                  value={minPrice}
                  onChangeText={setMinPrice}
                  placeholder="50"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={styles.priceSeparator}>
              <Text style={styles.priceSeparatorText}>to</Text>
            </View>
            <View style={styles.priceInputContainer}>
              <Text style={styles.priceLabel}>Maximum</Text>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.currencySymbol}>GH₵</Text>
                <TextInput
                  style={styles.priceInput}
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  placeholder="500"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Turnaround Time Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={24} color={colors.primary[600]} />
            <Text style={styles.sectionTitle}>Turnaround Time</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            How long does it typically take you to complete an order?
          </Text>
          <View style={styles.turnaroundGrid}>
            {TURNAROUND_OPTIONS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.turnaroundOption,
                  turnaroundTime === time && styles.turnaroundOptionSelected,
                ]}
                onPress={() => selectTurnaroundTime(time)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.turnaroundOptionText,
                    turnaroundTime === time && styles.turnaroundOptionTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.footer}>
        <Button 
          title="Back" 
          onPress={onBack} 
          variant="outline" 
          style={styles.backButton}
        />
        <Button 
          title="Finish Setup" 
          onPress={handleFinish} 
          loading={isLoading}
          style={styles.finishButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: spacing.huge,
  },
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontWeight: '700',
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.xxxl,
  },
  
  // Section Styles
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    fontWeight: '600',
  },
  sectionSubtitle: {
    ...textStyles.small,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },

  // Specialties Grid
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    minHeight: 44,
  },
  specialtyChipSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[600],
  },
  specialtyChipText: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  specialtyChipTextSelected: {
    color: colors.primary[700],
    fontWeight: '600',
  },

  // Custom Specialty
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  addCustomText: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
  },
  customSpecialtyContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  customSpecialtyInput: {
    flex: 1,
    ...textStyles.body,
    borderWidth: 1.5,
    borderColor: colors.primary[600],
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    minHeight: 48,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Price Range
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  priceInputContainer: {
    flex: 1,
  },
  priceLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  priceInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.primary,
    minHeight: 52,
  },
  currencySymbol: {
    ...textStyles.body,
    color: colors.text.tertiary,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  priceInput: {
    flex: 1,
    ...textStyles.body,
    color: colors.text.primary,
    padding: 0,
    minHeight: 24,
  },
  priceSeparator: {
    paddingBottom: spacing.md,
  },
  priceSeparatorText: {
    ...textStyles.small,
    color: colors.text.tertiary,
    fontWeight: '600',
  },

  // Turnaround Time
  turnaroundGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  turnaroundOption: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    minHeight: 44,
    justifyContent: 'center',
  },
  turnaroundOptionSelected: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  turnaroundOptionText: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  turnaroundOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    flex: 1,
  },
  finishButton: {
    flex: 2,
  },
});

export default ServicesStep;
