import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from '../../../components/Button';
import { textStyles } from '../../../design-system/typography';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { cameraService } from '../../../services/camera';
import { useAddPortfolioItemMutation } from '../../../api/tailors.api';
import { useAppSelector } from '../../../store/hooks';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { PortfolioItem } from '../../../types';

interface PortfolioStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PortfolioStep: React.FC<PortfolioStepProps> = ({ onNext, onBack }) => {
  const [items, setItems] = useState<Omit<PortfolioItem, 'id'>[]>([]);
  const [addPortfolioItem, { isLoading }] = useAddPortfolioItemMutation();
  const user = useAppSelector((state) => state.auth.user);

  const handleAddImage = async () => {
    try {
      const result = await cameraService.pickImage();
      if (result) {
        // Resize image to reduce file size for upload
        const resized = await cameraService.resizeImage(result.uri, 800, 1000);
        
        const newItem: Omit<PortfolioItem, 'id'> = {
          imageUrl: resized.uri,
          title: '',
          description: '',
          category: 'General',
          type: 'image',
        };
        setItems([...items, newItem]);
      }
    } catch (error) {
      console.error('Error adding image:', error);
      Alert.alert('Error', 'Failed to add image. Please try again.');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleUpdateItem = (index: number, field: 'title' | 'description' | 'category', value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSkip = () => {
    // Skip directly without confirmation - it's optional anyway
    onNext();
  };

  const handleNext = async () => {
    if (!user) return;

    // If no items, just skip to next step
    if (items.length === 0) {
      onNext();
      return;
    }

    try {
      // Upload items one by one to avoid overwhelming the server
      for (const item of items) {
        await addPortfolioItem({
          tailorId: user.id,
          item: {
            ...item,
            title: item.title || 'Untitled Work',
            category: item.category || 'General',
          },
        }).unwrap();
      }
      Alert.alert('Success', 'Portfolio items added successfully!');
      onNext();
    } catch (error: any) {
      console.error('Portfolio upload error:', error);
      
      // Check for specific error types
      let errorMessage = 'Some items may not have been uploaded. You can add them later from your profile.';
      
      if (error?.status === 413 || error?.message?.includes('too large')) {
        errorMessage = 'The images are too large. Please try with smaller images or fewer items at once.';
      } else if (error?.status === 'FETCH_ERROR' || error?.error?.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      }
      
      Alert.alert(
        'Upload Error',
        errorMessage,
        [
          { text: 'Try Again', style: 'cancel' },
          { text: 'Continue Anyway', onPress: onNext },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Skip button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Showcase Your Work</Text>
          <Text style={styles.optional}>(Optional)</Text>
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Add photos of your best work to attract more clients. You can always add more later!
      </Text>
      <Text style={styles.hint}>
        💡 Tip: Use smaller image sizes for faster uploads
      </Text>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={64} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>No portfolio items yet</Text>
            <Text style={styles.emptyHint}>
              Showcase your best work to stand out to potential clients
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            {items.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(index)}
                  >
                    <Ionicons name="close-circle" size={28} color={colors.error[500]} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Title (e.g., Blue Kaftan)"
                  placeholderTextColor={colors.text.tertiary}
                  value={item.title}
                  onChangeText={(value) => handleUpdateItem(index, 'title', value)}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description (optional)"
                  placeholderTextColor={colors.text.tertiary}
                  value={item.description}
                  onChangeText={(value) => handleUpdateItem(index, 'description', value)}
                  multiline
                  numberOfLines={3}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Category (e.g., Dresses, Suits)"
                  placeholderTextColor={colors.text.tertiary}
                  value={item.category}
                  onChangeText={(value) => handleUpdateItem(index, 'category', value)}
                />
              </View>
            ))}
          </View>
        )}

        <Button
          title="Add Portfolio Image"
          onPress={handleAddImage}
          variant="outline"
          style={styles.addButton}
          icon={<Ionicons name="add-circle-outline" size={20} color={colors.primary[600]} />}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={onBack} variant="outline" style={styles.backButton} />
        <Button
          title={items.length === 0 ? 'Skip for Now' : `Continue with ${items.length} ${items.length === 1 ? 'Item' : 'Items'}`}
          onPress={handleNext}
          loading={isLoading}
          style={styles.nextButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  optional: {
    ...textStyles.small,
    color: colors.text.tertiary,
    fontStyle: 'italic',
  },
  skipButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  hint: {
    ...textStyles.small,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    marginBottom: spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    ...textStyles.h4,
    color: colors.text.secondary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  emptyHint: {
    ...textStyles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
  itemsList: {
    gap: spacing.xl,
  },
  itemContainer: {
    backgroundColor: colors.background.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: spacing.md,
    alignSelf: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: radius.md,
    backgroundColor: colors.neutral[200],
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: colors.background.primary,
    borderRadius: 14,
  },
  input: {
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background.primary,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
});

export default PortfolioStep;
