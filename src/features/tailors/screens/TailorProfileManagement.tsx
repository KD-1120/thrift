// Tailor Profile Management Screen - Create and edit tailor business profile

import React, { useState } from 'react';
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

type NavigationProp = StackNavigationProp<any>;

export default function TailorProfileManagementScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Form state
  const [businessName, setBusinessName] = useState('Ama Serwaa Tailoring');
  const [description, setDescription] = useState(
    'Expert tailor specializing in traditional and modern Ghanaian fashion. Over 10 years of experience creating bespoke garments for weddings, corporate events, and everyday wear.'
  );
  const [phone, setPhone] = useState('+233 24 123 4567');
  const [email, setEmail] = useState('ama.serwaa@email.com');
  const [address, setAddress] = useState('Accra Central Market, Accra');
  const [specialties, setSpecialties] = useState([
    'Wedding Gowns',
    'Kente Cloth',
    'Corporate Attire',
    'Traditional Wear',
  ]);
  const [minPrice, setMinPrice] = useState('150');
  const [maxPrice, setMaxPrice] = useState('1500');
  const [turnaroundTime, setTurnaroundTime] = useState('7-14 days');

  const [newSpecialty, setNewSpecialty] = useState('');

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSave = () => {
    // Validate required fields
    if (!businessName.trim() || !description.trim() || !phone.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // In real app, this would save to API
    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
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

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Avatar
            uri="https://via.placeholder.com/120x120/FF6B6B/FFFFFF?text=AS"
            name={businessName}
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