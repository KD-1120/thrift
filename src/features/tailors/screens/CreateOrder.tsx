// Complete Create Order Screen with Measurement Integration

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { formatCurrency } from '../../../utils/formatters';
import { cameraService } from '../../../services/camera';
import type { Measurement } from '../../../types';

type MainStackParamList = {
  OrderDetail: { orderId: string };
};

export default function CreateOrderScreen() {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  
  // Form state
  const [garmentType, setGarmentType] = useState('');
  const [fabricType, setFabricType] = useState('');
  const [description, setDescription] = useState('');
  const [useSavedMeasurements, setUseSavedMeasurements] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [customMeasurements, setCustomMeasurements] = useState({
    chest: '',
    waist: '',
    hips: '',
    shoulder: '',
    sleeveLength: '',
    shirtLength: '',
  });
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock saved measurements
  const savedMeasurements: Measurement[] = [
    {
      id: '1',
      userId: 'user123',
      name: 'My Regular Fit',
      chest: 100,
      waist: 85,
      hips: 95,
      shoulders: 45,
      armLength: 60,
      inseam: 75,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString(),
    },
  ];

  const garmentTypes = [
    'Shirt',
    'Trousers',
    'Dress',
    'Suit',
    'Kaftan',
    'Traditional Wear',
    'Other',
  ];

  const fabricTypes = [
    'Cotton',
    'Silk',
    'Linen',
    'Wool',
    'Polyester',
    'Kente',
    'Other',
  ];

  const handleAddImage = async () => {
    Alert.alert(
      'Add Reference Image',
      'Choose image source',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const result = await cameraService.capturePhoto();
            if (result) {
              setReferenceImages([...referenceImages, result.uri]);
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await cameraService.pickImage();
            if (result) {
              setReferenceImages([...referenceImages, result.uri]);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleRemoveImage = (index: number) => {
    const newImages = referenceImages.filter((_, i) => i !== index);
    setReferenceImages(newImages);
  };

  const handleSubmit = async () => {
    // Validation
    if (!garmentType) {
      Alert.alert('Error', 'Please select a garment type');
      return;
    }

    if (!useSavedMeasurements) {
      if (!customMeasurements.chest || !customMeasurements.waist) {
        Alert.alert('Error', 'Please provide at least chest and waist measurements');
        return;
      }
    }

    setLoading(true);

    try {
      // TODO: Submit order to API
      // const orderData = {
      //   garmentType,
      //   fabricType,
      //   description,
      //   measurements: useSavedMeasurements ? selectedMeasurement : customMeasurements,
      //   referenceImages,
      //   specialInstructions,
      // };
      // await createOrder(orderData);

      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Success',
        'Your order has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OrderDetail', { orderId: '123' }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Order</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Garment Type */}
        <Card variant="outlined">
          <Text style={styles.sectionTitle}>Garment Type *</Text>
          <View style={styles.chipsContainer}>
            {garmentTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  garmentType === type && styles.chipActive,
                ]}
                onPress={() => setGarmentType(type)}
              >
                <Text
                  style={[
                    styles.chipText,
                    garmentType === type && styles.chipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Fabric Type */}
        <Card variant="outlined">
          <Text style={styles.sectionTitle}>Fabric Type</Text>
          <View style={styles.chipsContainer}>
            {fabricTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.chip,
                  fabricType === type && styles.chipActive,
                ]}
                onPress={() => setFabricType(type)}
              >
                <Text
                  style={[
                    styles.chipText,
                    fabricType === type && styles.chipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Description */}
        <Card variant="outlined">
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the garment you want..."
            placeholderTextColor={colors.text.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>

        {/* Measurements */}
        <Card variant="outlined">
          <View style={styles.measurementHeader}>
            <Text style={styles.sectionTitle}>Measurements (cm) *</Text>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Use saved</Text>
              <Switch
                value={useSavedMeasurements}
                onValueChange={setUseSavedMeasurements}
                trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                thumbColor={useSavedMeasurements ? colors.primary[500] : colors.neutral[100]}
              />
            </View>
          </View>

          {useSavedMeasurements ? (
            <View style={styles.savedMeasurements}>
              {savedMeasurements.map((measurement) => (
                <TouchableOpacity
                  key={measurement.id}
                  style={[
                    styles.measurementCard,
                    selectedMeasurement?.id === measurement.id && styles.measurementCardActive,
                  ]}
                  onPress={() => setSelectedMeasurement(measurement)}
                >
                  <Text style={styles.measurementName}>{measurement.name}</Text>
                  <Text style={styles.measurementDetails}>
                    Chest: {measurement.chest}cm • Waist: {measurement.waist}cm
                  </Text>
                </TouchableOpacity>
              ))}
              <Button
                title="View All Measurements"
                variant="outline"
                size="small"
                onPress={() => {
                  /* Navigate to saved measurements */
                }}
              />
            </View>
          ) : (
            <View style={styles.customMeasurementsForm}>
              <View style={styles.row}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Chest *</Text>
                  <TextInput
                    style={styles.input}
                    value={customMeasurements.chest}
                    onChangeText={(value) =>
                      setCustomMeasurements({ ...customMeasurements, chest: value })
                    }
                    placeholder="100"
                    keyboardType="numeric"
                    placeholderTextColor={colors.text.placeholder}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Waist *</Text>
                  <TextInput
                    style={styles.input}
                    value={customMeasurements.waist}
                    onChangeText={(value) =>
                      setCustomMeasurements({ ...customMeasurements, waist: value })
                    }
                    placeholder="85"
                    keyboardType="numeric"
                    placeholderTextColor={colors.text.placeholder}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Hips</Text>
                  <TextInput
                    style={styles.input}
                    value={customMeasurements.hips}
                    onChangeText={(value) =>
                      setCustomMeasurements({ ...customMeasurements, hips: value })
                    }
                    placeholder="95"
                    keyboardType="numeric"
                    placeholderTextColor={colors.text.placeholder}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Shoulder</Text>
                  <TextInput
                    style={styles.input}
                    value={customMeasurements.shoulder}
                    onChangeText={(value) =>
                      setCustomMeasurements({ ...customMeasurements, shoulder: value })
                    }
                    placeholder="45"
                    keyboardType="numeric"
                    placeholderTextColor={colors.text.placeholder}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Sleeve Length</Text>
                  <TextInput
                    style={styles.input}
                    value={customMeasurements.sleeveLength}
                    onChangeText={(value) =>
                      setCustomMeasurements({ ...customMeasurements, sleeveLength: value })
                    }
                    placeholder="60"
                    keyboardType="numeric"
                    placeholderTextColor={colors.text.placeholder}
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Shirt Length</Text>
                  <TextInput
                    style={styles.input}
                    value={customMeasurements.shirtLength}
                    onChangeText={(value) =>
                      setCustomMeasurements({ ...customMeasurements, shirtLength: value })
                    }
                    placeholder="75"
                    keyboardType="numeric"
                    placeholderTextColor={colors.text.placeholder}
                  />
                </View>
              </View>
              <Button
                title="📏 How to Measure"
                variant="ghost"
                size="small"
                onPress={() => {
                  /* Show measurement guide */
                }}
              />
            </View>
          )}
        </Card>

        {/* Reference Images */}
        <Card variant="outlined">
          <Text style={styles.sectionTitle}>Reference Images</Text>
          <Text style={styles.sectionDescription}>
            Upload photos of designs you like
          </Text>
          <View style={styles.imagesContainer}>
            {referenceImages.map((uri, index) => (
              <View key={index} style={styles.imagePreview}>
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imageEmoji}>🖼️</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {referenceImages.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
                <Text style={styles.addImageText}>+ Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Special Instructions */}
        <Card variant="outlined">
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.textArea}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            placeholder="Any special requests or details..."
            placeholderTextColor={colors.text.placeholder}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </Card>

        {/* Estimated Cost */}
        <Card variant="filled">
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Estimated Cost</Text>
            <Text style={styles.priceValue}>{formatCurrency(150)}</Text>
          </View>
          <Text style={styles.priceNote}>
            Final price will be confirmed by the tailor
          </Text>
        </Card>

        {/* Submit Button */}
        <Button
          title={loading ? 'Creating Order...' : 'Create Order'}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          fullWidth
        />

        <View style={styles.bottomSpacer} />
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
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.card,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonText: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  headerTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionDescription: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  chipActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  chipText: {
    ...textStyles.small,
    color: colors.text.secondary,
  },
  chipTextActive: {
    ...textStyles.smallMedium,
    color: colors.background.card,
  },
  textArea: {
    ...textStyles.body,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text.primary,
    minHeight: 100,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  switchLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
  },
  savedMeasurements: {
    gap: spacing.md,
  },
  measurementCard: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  measurementCardActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  measurementName: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  measurementDetails: {
    ...textStyles.small,
    color: colors.text.secondary,
  },
  customMeasurementsForm: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  input: {
    ...textStyles.body,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text.primary,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageEmoji: {
    fontSize: 32,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    ...textStyles.small,
    color: colors.text.tertiary,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    ...textStyles.h4,
    color: colors.text.primary,
  },
  priceValue: {
    ...textStyles.h3,
    color: colors.primary[500],
  },
  priceNote: {
    ...textStyles.small,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});
