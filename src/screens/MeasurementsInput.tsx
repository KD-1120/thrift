// Measurements Input Screen - Detailed body measurements for custom tailoring

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../components/IconButton';
import { Button } from '../components/Button';
import { colors } from '../design-system/colors';
import { spacing, radius, shadows } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';

type RouteParams = {
  MeasurementsInput: {
    bookingData: any;
  };
};

type NavigationProp = StackNavigationProp<any>;

// Measurement Categories
const MEASUREMENT_CATEGORIES = {
  upper: {
    title: 'Upper Body',
    icon: 'body-outline',
    fields: [
      { key: 'shoulder', label: 'Shoulder Width', unit: 'cm', placeholder: 'e.g., 42' },
      { key: 'bust', label: 'Bust/Chest', unit: 'cm', placeholder: 'e.g., 92' },
      { key: 'waist', label: 'Waist', unit: 'cm', placeholder: 'e.g., 72' },
      { key: 'arm', label: 'Arm Length', unit: 'cm', placeholder: 'e.g., 60' },
      { key: 'sleeve', label: 'Sleeve Length', unit: 'cm', placeholder: 'e.g., 58' },
      { key: 'neck', label: 'Neck', unit: 'cm', placeholder: 'e.g., 38' },
    ],
  },
  lower: {
    title: 'Lower Body',
    icon: 'man-outline',
    fields: [
      { key: 'hip', label: 'Hip', unit: 'cm', placeholder: 'e.g., 98' },
      { key: 'inseam', label: 'Inseam', unit: 'cm', placeholder: 'e.g., 78' },
      { key: 'outseam', label: 'Outseam', unit: 'cm', placeholder: 'e.g., 105' },
      { key: 'thigh', label: 'Thigh', unit: 'cm', placeholder: 'e.g., 56' },
      { key: 'knee', label: 'Knee', unit: 'cm', placeholder: 'e.g., 38' },
      { key: 'ankle', label: 'Ankle', unit: 'cm', placeholder: 'e.g., 22' },
    ],
  },
  dress: {
    title: 'Dress Specific',
    icon: 'shirt-outline',
    fields: [
      { key: 'dressLength', label: 'Dress Length', unit: 'cm', placeholder: 'e.g., 100' },
      { key: 'armhole', label: 'Armhole', unit: 'cm', placeholder: 'e.g., 42' },
      { key: 'backWidth', label: 'Back Width', unit: 'cm', placeholder: 'e.g., 38' },
      { key: 'frontLength', label: 'Front Length', unit: 'cm', placeholder: 'e.g., 45' },
    ],
  },
};

export default function MeasurementsInputScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'MeasurementsInput'>>();
  const { bookingData } = route.params;

  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof MEASUREMENT_CATEGORIES>('upper');
  const [savedProfiles, setSavedProfiles] = useState([
    { id: '1', name: 'My Default Measurements', date: '2 weeks ago' },
  ]);

  const updateMeasurement = (key: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAndContinue = () => {
    console.log('Measurements:', measurements);
    // Navigate to review screen with updated booking data
    navigation.navigate('BookingReview', {
      bookingData: {
        ...bookingData,
        measurements,
        hasMeasurements: true,
      }
    });
  };

  const handleLoadProfile = (profileId: string) => {
    // Load measurements from saved profile
    console.log('Loading profile:', profileId);
  };

  const renderMeasurementField = (field: { key: string; label: string; unit: string; placeholder: string }) => (
    <View key={field.key} style={styles.measurementField}>
      <Text style={styles.fieldLabel}>{field.label}</Text>
      <View style={styles.fieldInputContainer}>
        <TextInput
          style={styles.fieldInput}
          placeholder={field.placeholder}
          placeholderTextColor={colors.text.tertiary}
          keyboardType="numeric"
          value={measurements[field.key] || ''}
          onChangeText={(text) => updateMeasurement(field.key, text)}
        />
        <Text style={styles.fieldUnit}>{field.unit}</Text>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Body Measurements</Text>
        <IconButton
          icon="help-circle-outline"
          size={22}
          color={colors.text.primary}
          onPress={() => {}}
        />
      </View>

      {/* Saved Profiles */}
      {savedProfiles.length > 0 && (
        <View style={styles.profilesSection}>
          <Text style={styles.profilesTitle}>Saved Profiles</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.profilesScroll}>
            {savedProfiles.map((profile) => (
              <TouchableOpacity
                key={profile.id}
                style={styles.profileCard}
                onPress={() => handleLoadProfile(profile.id)}
                activeOpacity={0.9}
              >
                <Ionicons name="person-circle-outline" size={32} color={colors.primary[600]} />
                <Text style={styles.profileName} numberOfLines={1}>
                  {profile.name}
                </Text>
                <Text style={styles.profileDate}>{profile.date}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.addProfileCard} activeOpacity={0.9}>
              <Ionicons name="add-circle-outline" size={32} color={colors.text.tertiary} />
              <Text style={styles.addProfileText}>New Profile</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Category Tabs */}
      <View style={styles.categoryTabs}>
        {Object.entries(MEASUREMENT_CATEGORIES).map(([key, category]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.categoryTab,
              selectedCategory === key && styles.categoryTabActive,
            ]}
            onPress={() => setSelectedCategory(key as keyof typeof MEASUREMENT_CATEGORIES)}
            activeOpacity={0.9}
          >
            <Ionicons
              name={category.icon as any}
              size={20}
              color={selectedCategory === key ? colors.primary[600] : colors.text.tertiary}
            />
            <Text
              style={[
                styles.categoryTabText,
                selectedCategory === key && styles.categoryTabTextActive,
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Measurement Fields */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.fieldsContainer}>
            {/* Help Card */}
            <View style={styles.helpCard}>
              <Ionicons name="bulb-outline" size={20} color="#D97706" />
              <View style={styles.helpContent}>
                <Text style={styles.helpTitle}>How to measure yourself</Text>
                <Text style={styles.helpText}>
                  Use a soft measuring tape. Wear form-fitting clothes and stand naturally. Tap the
                  help icon above for detailed instructions.
                </Text>
              </View>
            </View>

            {/* Fields */}
            {MEASUREMENT_CATEGORIES[selectedCategory].fields.map(renderMeasurementField)}

            {/* Additional Notes */}
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Additional Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Any special considerations..."
                placeholderTextColor={colors.text.tertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Bottom Spacing */}
            <View style={{ height: 100 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveProfileButton} activeOpacity={0.9}>
          <Ionicons name="bookmark-outline" size={20} color={colors.primary[600]} />
          <Text style={styles.saveProfileText}>Save as Profile</Text>
        </TouchableOpacity>
        <Button
          title="Save & Continue"
          onPress={handleSaveAndContinue}
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
    color: colors.text.primary,
  },

  // Saved Profiles
  profilesSection: {
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  profilesTitle: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  profilesScroll: {
    marginHorizontal: -spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  profileCard: {
    width: 120,
    padding: spacing.lg,
    minHeight: 100,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: spacing.lg,
  },
  profileName: {
    fontSize: 13,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  profileDate: {
    fontSize: 11,
    color: colors.text.tertiary,
  },
  addProfileCard: {
    width: 120,
    padding: spacing.lg,
    minHeight: 100,
    borderRadius: radius.lg,
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  addProfileText: {
    fontSize: 13,
    color: colors.text.tertiary,
  },

  // Category Tabs
  categoryTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    minHeight: 56,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryTabActive: {
    borderBottomColor: colors.primary[600],
  },
  categoryTabText: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  categoryTabTextActive: {
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Content
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  fieldsContainer: {
    padding: spacing.xxxl,
  },

  // Help Card
  helpCard: {
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: spacing.xxxl,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 15,
    color: '#78350F',
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  helpText: {
    fontSize: 13,
    color: '#92400E',
  },

  // Measurement Fields
  measurementField: {
    marginBottom: spacing.xxl,
  },
  fieldLabel: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  fieldInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    minHeight: 56,
    overflow: 'hidden',
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    paddingVertical: spacing.lg,
  },
  fieldUnit: {
    fontSize: 15,
    color: colors.text.tertiary,
    fontWeight: '600',
    marginLeft: spacing.md,
  },

  // Notes
  notesSection: {
    marginTop: spacing.xxl,
  },
  notesLabel: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  notesInput: {
    fontSize: 15,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 120,
    textAlignVertical: 'top',
  },

  // Bottom Bar
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 88,
    backgroundColor: colors.background.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    ...shadows.lg,
  },
  saveProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primary[600],
  },
  saveProfileText: {
    fontSize: 15,
    color: colors.primary[600],
    fontWeight: '600',
  },
  continueButton: {
    flex: 1,
    minHeight: 52,
  },
});
