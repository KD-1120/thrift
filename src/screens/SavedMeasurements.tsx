// Saved Measurements Screen - Complete Implementation

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../store/navigation';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';

const MAX_CONTENT_WIDTH = 600;

// Mock data - in real app, this would come from API/store
const mockMeasurements = [
  {
    id: '1',
    name: 'Casual Wear',
    createdAt: '2024-01-15',
    measurements: {
      chest: 40,
      waist: 32,
      hips: 38,
      inseam: 32,
      shoulder: 18,
      sleeve: 25,
    },
  },
  {
    id: '2',
    name: 'Formal Suit',
    createdAt: '2024-01-10',
    measurements: {
      chest: 42,
      waist: 34,
      hips: 40,
      inseam: 34,
      shoulder: 19,
      sleeve: 26,
    },
  },
];

export default function SavedMeasurementsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [measurements, setMeasurements] = useState(mockMeasurements);

  const handleAddMeasurement = () => {
    navigation.navigate('MeasurementsInput', { bookingData: {} });
  };

  const handleEditMeasurement = (measurement: typeof mockMeasurements[0]) => {
    // TODO: Navigate to edit measurement screen
    Alert.alert('Edit Measurement', `Edit ${measurement.name}`);
  };

  const handleDeleteMeasurement = (measurement: typeof mockMeasurements[0]) => {
    Alert.alert(
      'Delete Measurement',
      `Are you sure you want to delete "${measurement.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMeasurements(prev => prev.filter(m => m.id !== measurement.id));
          },
        },
      ]
    );
  };

  const formatMeasurement = (value: number) => {
    return `${value}"`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          color={colors.text.primary}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Saved Measurements</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Add New Measurement Button */}
          <Card variant="elevated" style={styles.addCard}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddMeasurement} activeOpacity={0.8}>
              <View style={styles.addIcon}>
                <Text style={styles.addIconText}>+</Text>
              </View>
              <View style={styles.addContent}>
                <Text style={styles.addTitle}>Add New Measurement</Text>
                <Text style={styles.addDescription}>Take accurate measurements for better fit</Text>
              </View>
            </TouchableOpacity>
          </Card>

          {/* Measurements List */}
          {measurements.length > 0 ? (
            <View style={styles.measurementsList}>
              <Text style={styles.sectionTitle}>Your Measurements</Text>

              {measurements.map((measurement) => (
                <Card key={measurement.id} variant="outlined" style={styles.measurementCard}>
                  <View style={styles.measurementHeader}>
                    <View style={styles.measurementInfo}>
                      <Text style={styles.measurementName}>{measurement.name}</Text>
                      <Text style={styles.measurementDate}>Created {formatDate(measurement.createdAt)}</Text>
                    </View>
                    <View style={styles.measurementActions}>
                      <IconButton
                        icon="edit"
                        library="material"
                        size={20}
                        onPress={() => handleEditMeasurement(measurement)}
                        style={styles.actionButton}
                      />
                      <IconButton
                        icon="delete"
                        library="material"
                        size={20}
                        onPress={() => handleDeleteMeasurement(measurement)}
                        style={styles.actionButton}
                      />
                    </View>
                  </View>

                  <View style={styles.measurementGrid}>
                    <View style={styles.measurementRow}>
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Chest</Text>
                        <Text style={styles.measurementValue}>
                          {formatMeasurement(measurement.measurements.chest)}
                        </Text>
                      </View>
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Waist</Text>
                        <Text style={styles.measurementValue}>
                          {formatMeasurement(measurement.measurements.waist)}
                        </Text>
                      </View>
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Hips</Text>
                        <Text style={styles.measurementValue}>
                          {formatMeasurement(measurement.measurements.hips)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.measurementRow}>
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Inseam</Text>
                        <Text style={styles.measurementValue}>
                          {formatMeasurement(measurement.measurements.inseam)}
                        </Text>
                      </View>
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Shoulder</Text>
                        <Text style={styles.measurementValue}>
                          {formatMeasurement(measurement.measurements.shoulder)}
                        </Text>
                      </View>
                      <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Sleeve</Text>
                        <Text style={styles.measurementValue}>
                          {formatMeasurement(measurement.measurements.sleeve)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📏</Text>
              <Text style={styles.emptyTitle}>No Measurements Yet</Text>
              <Text style={styles.emptyDescription}>
                Add your first measurement set to get started with custom orders
              </Text>
              <Button
                title="Add Measurement"
                onPress={handleAddMeasurement}
                style={styles.emptyButton}
              />
            </View>
          )}

          {/* Tips Section */}
          <Card variant="outlined" style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Measurement Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipsItem}>• Wear form-fitting clothing when measuring</Text>
              <Text style={styles.tipsItem}>• Use a flexible measuring tape</Text>
              <Text style={styles.tipsItem}>• Measure twice for accuracy</Text>
              <Text style={styles.tipsItem}>• Stand straight with relaxed posture</Text>
            </View>
          </Card>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 64,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
  },
  innerContainer: {
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  // Add New Measurement
  addCard: {
    marginBottom: spacing.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  addIconText: {
    fontSize: 24,
    color: colors.primary[600],
    fontWeight: '600',
  },
  addContent: {
    flex: 1,
  },
  addTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  addDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
  },

  // Measurements List
  measurementsList: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  measurementCard: {
    marginBottom: spacing.lg,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  measurementInfo: {
    flex: 1,
  },
  measurementName: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  measurementDate: {
    ...textStyles.small,
    color: colors.text.tertiary,
  },
  measurementActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },

  // Measurement Grid
  measurementGrid: {
    gap: spacing.md,
  },
  measurementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  measurementItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    marginHorizontal: spacing.xs / 2,
  },
  measurementLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  measurementValue: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  emptyButton: {
    minWidth: 200,
  },

  // Tips Section
  tipsCard: {
    marginTop: spacing.xl,
  },
  tipsTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipsItem: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
