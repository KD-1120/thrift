// Tailor Profile Management Screen - Create and edit tailor business profile

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
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
import { useAppSelector } from '../../../store/hooks';
import { useGetTailorQuery, useUpdateTailorProfileMutation } from '../../../api/tailors.api';

type NavigationProp = StackNavigationProp<any>;

type NavigationProp = StackNavigationProp<any>;

export default function TailorProfileManagementScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector((state) => state.auth.user);
  const [updateTailorProfile, { isLoading }] = useUpdateTailorProfileMutation();
  const { data: tailorProfile, isLoading: isLoadingProfile, refetch } = useGetTailorQuery(user?.id || '', {
    skip: !user?.id,
  });

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [turnaroundTime, setTurnaroundTime] = useState('');

  const [newSpecialty, setNewSpecialty] = useState('');

  // Check if user is a tailor
  useEffect(() => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to access this feature.');
      navigation.goBack();
      return;
    }

    if (user.role !== 'tailor') {
      Alert.alert('Access Denied', 'This feature is only available for tailors.');
      navigation.goBack();
      return;
    }
  }, [user, navigation]);

  // Pre-fill form with existing data
  useEffect(() => {
    if (tailorProfile) {
      setBusinessName(tailorProfile.businessName || '');
      setDescription(tailorProfile.description || '');
      setPhone(user?.phone || '');
      setEmail(user?.email || '');
      setAddress(tailorProfile.location?.address || '');
      setSpecialties(tailorProfile.specialties || []);
      setMinPrice(tailorProfile.priceRange?.min?.toString() || '');
      setMaxPrice(tailorProfile.priceRange?.max?.toString() || '');
      setTurnaroundTime(tailorProfile.turnaroundTime || '');
    }
  }, [tailorProfile, user]);

  // Show loading
  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state if no profile exists
  if (!tailorProfile) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="person-circle-outline" size={80} color={colors.text.secondary} />
          <Text style={styles.emptyTitle}>No Profile Found</Text>
          <Text style={styles.emptySubtitle}>
            Complete your tailor onboarding to create your business profile.
          </Text>
          <Button
            title="Complete Onboarding"
            onPress={() => navigation.navigate('TailorOnboarding')}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSave = async () => {
    if (!user) return;

    // Validate required fields
    if (!businessName.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await updateTailorProfile({
        id: user.id,
        data: {
          businessName: businessName.trim(),
          description: description.trim(),
          location: {
            address: address.trim(),
            city: tailorProfile.location?.city || '',
            region: tailorProfile.location?.region || '',
          },
          specialties,
          priceRange: {
            min: parseInt(minPrice) || 0,
            max: parseInt(maxPrice) || 0,
          },
          turnaroundTime: turnaroundTime.trim(),
        },
      }).unwrap();

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

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
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.headerRight} />
        </View>

  // Avatar Section
        <View style={styles.avatarSection}>
          <Avatar
            uri={tailorProfile.avatar || undefined}
            name={user?.name || 'Tailor'}
            size={100}
          />
          <TouchableOpacity style={styles.changePhotoButton} activeOpacity={0.8}>
            <Ionicons name="camera" size={20} color={colors.primary[600]} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Business Information */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Name *</Text>
            <TextInput
              style={styles.textInput}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Enter your business name"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your services and experience"
              placeholderTextColor={colors.text.tertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email address"
              placeholderTextColor={colors.text.tertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Business Address</Text>
            <TextInput
              style={styles.textInput}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your business address"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </Card>

        {/* Specialties */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <Text style={styles.sectionSubtitle}>What types of garments do you specialize in?</Text>

          <View style={styles.specialtiesContainer}>
            {specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
                <TouchableOpacity
                  onPress={() => removeSpecialty(specialty)}
                  style={styles.removeButton}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={16} color={colors.primary[700]} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.addSpecialtyContainer}>
            <TextInput
              style={styles.addSpecialtyInput}
              value={newSpecialty}
              onChangeText={setNewSpecialty}
              placeholder="Add a specialty"
              placeholderTextColor={colors.text.tertiary}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addSpecialty}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Pricing */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Information</Text>

          <View style={styles.priceRangeContainer}>
            <View style={styles.priceInputGroup}>
              <Text style={styles.inputLabel}>Minimum Price (GH₵)</Text>
              <TextInput
                style={styles.priceInput}
                value={minPrice}
                onChangeText={setMinPrice}
                placeholder="150"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.priceRangeSeparator}>-</Text>

            <View style={styles.priceInputGroup}>
              <Text style={styles.inputLabel}>Maximum Price (GH₵)</Text>
              <TextInput
                style={styles.priceInput}
                value={maxPrice}
                onChangeText={setMaxPrice}
                placeholder="1500"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Typical Turnaround Time</Text>
            <TextInput
              style={styles.textInput}
              value={turnaroundTime}
              onChangeText={setTurnaroundTime}
              placeholder="e.g., 7-14 days"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </Card>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
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
    width: 40, // Balance the back button width
  },

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Avatar
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: colors.background.primary,
    marginBottom: spacing.xl,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
    borderRadius: radius.lg,
  },
  changePhotoText: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Sections
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    fontSize: 18,
  },
  sectionSubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
    fontSize: 14,
  },

  // Inputs
  inputGroup: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
    fontSize: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Specialties
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  specialtyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  specialtyText: {
    ...textStyles.small,
    color: colors.primary[700],
    fontWeight: '600',
  },
  removeButton: {
    padding: spacing.xs,
  },
  addSpecialtyContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-end',
  },
  addSpecialtyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Pricing
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  priceInputGroup: {
    flex: 1,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  priceRangeSeparator: {
    ...textStyles.h3,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },

  // Save
  saveContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.huge,
  },
  saveButton: {
    width: '100%',
  },
});