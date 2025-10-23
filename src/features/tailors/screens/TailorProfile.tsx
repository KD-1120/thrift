// Tailor Profile Screen

import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useGetTailorQuery } from '../../../api/tailors.api';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Avatar } from '../../../components/Avatar';
import { IconButton } from '../../../components/IconButton';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';
import type { MainStackParamList } from '../../../store/navigation';

type TailorProfileRouteProp = RouteProp<MainStackParamList, 'TailorProfile'>;
type TailorProfileNavigationProp = StackNavigationProp<MainStackParamList>;

export default function TailorProfileScreen() {
  const route = useRoute<TailorProfileRouteProp>();
  const navigation = useNavigation<TailorProfileNavigationProp>();
  const { data: tailor, isLoading, error } = useGetTailorQuery(route.params.tailorId);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loading}>Loading tailor profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !tailor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error.main} />
          <Text style={styles.errorTitle}>Tailor Not Found</Text>
          <Text style={styles.errorMessage}>
            {error ? 'Unable to load tailor profile. Please try again.' : 'This tailor does not exist.'}
          </Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <IconButton
              icon="arrow-back"
              size={24}
              color={colors.text.primary}
              onPress={() => navigation.goBack()}
            />
          </View>
          <Avatar uri={tailor.avatar ?? undefined} name={tailor.businessName} size={100} />
          <Text style={styles.businessName}>{tailor.businessName}</Text>
          <Text style={styles.location}>{tailor.location.address}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.rating}>★ {tailor.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({tailor.reviewCount} reviews)</Text>
            {tailor.verified && <Text style={styles.verified}>✓ Verified</Text>}
          </View>
        </View>

        {/* About */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{tailor.description}</Text>
        </Card>

        {/* Specialties */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.specialties}>
            {tailor.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Portfolio Preview */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TailorGallery', { tailorId: tailor.id, tailorName: tailor.businessName })}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.portfolioGrid}>
            {tailor.portfolio.slice(0, 6).map((item) => (
              <Image key={item.id} source={{ uri: item.imageUrl }} style={styles.portfolioImage} />
            ))}
          </View>
        </Card>

        {/* Price Range */}
        <Card variant="elevated" padding="xl" style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <Text style={styles.priceRange}>
            GH₵ {tailor.priceRange.min} - GH₵ {tailor.priceRange.max}
          </Text>
          <Text style={styles.turnaround}>Turnaround: {tailor.turnaroundTime}</Text>
        </Card>

        <View style={styles.actions}>
          <Button title="Message" onPress={() => navigation.navigate('Messaging', { tailorId: tailor.id, tailorName: tailor.businessName })} variant="outline" style={styles.actionButton} />
          <Button 
            title="Place Order" 
            onPress={() => navigation.navigate('BookingFlow', { serviceId: 'service-1', tailorId: tailor.id })} 
            style={styles.actionButton} 
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    ...textStyles.body,
    color: colors.text.tertiary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.background.primary,
    marginBottom: spacing.xxl,
  },
  headerTop: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.xl,
    zIndex: 1,
  },
  businessName: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    lineHeight: 36,
  },
  location: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rating: {
    ...textStyles.bodyMedium,
    color: colors.primary[500],
    lineHeight: 20,
  },
  reviews: {
    ...textStyles.small,
    color: colors.text.tertiary,
    lineHeight: 16,
  },
  verified: {
    ...textStyles.small,
    color: colors.success.main,
    lineHeight: 16,
  },
  section: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
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
    lineHeight: 28,
    marginBottom: spacing.sm,
  },
  seeAll: {
    ...textStyles.bodyMedium,
    color: colors.primary[500],
    lineHeight: 20,
  },
  description: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 28,
    marginTop: spacing.sm,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  specialtyTag: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  specialtyText: {
    ...textStyles.small,
    color: colors.primary[700],
    lineHeight: 16,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  portfolioImage: {
    width: '30.5%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    backgroundColor: colors.primary[100],
  },
  priceRange: {
    ...textStyles.h3,
    color: colors.primary[500],
    marginBottom: spacing.md,
    lineHeight: 32,
  },
  turnaround: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  actionButton: {
    flex: 1,
  },
});
