// Verification Request Screen - Allow tailors to submit verification documents

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';

type NavigationProp = StackNavigationProp<any>;

interface VerificationDocument {
  id: string;
  type: 'id_card' | 'business_license' | 'certification' | 'portfolio_sample';
  title: string;
  description: string;
  required: boolean;
  uploaded: boolean;
  uri?: string;
}

export default function VerificationRequestScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: '1',
      type: 'id_card',
      title: 'National ID Card',
      description: 'Clear photo of your national ID card (front and back)',
      required: true,
      uploaded: false,
    },
    {
      id: '2',
      type: 'business_license',
      title: 'Business License',
      description: 'Valid business registration or license',
      required: true,
      uploaded: false,
    },
    {
      id: '3',
      type: 'certification',
      title: 'Tailoring Certification',
      description: 'Professional tailoring certification or diploma (optional)',
      required: false,
      uploaded: false,
    },
    {
      id: '4',
      type: 'portfolio_sample',
      title: 'Portfolio Sample',
      description: 'Photo of your best work to showcase your skills',
      required: false,
      uploaded: false,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async (documentId: string) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Camera roll permissions are required to upload documents.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setDocuments(docs =>
          docs.map(doc =>
            doc.id === documentId
              ? { ...doc, uploaded: true, uri: result.assets[0].uri }
              : doc
          )
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async (documentId: string) => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Camera permissions are required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setDocuments(docs =>
          docs.map(doc =>
            doc.id === documentId
              ? { ...doc, uploaded: true, uri: result.assets[0].uri }
              : doc
          )
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removeDocument = (documentId: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === documentId
          ? { ...doc, uploaded: false, uri: undefined }
          : doc
      )
    );
  };

  const handleSubmitVerification = async () => {
    const requiredDocs = documents.filter(doc => doc.required);
    const uploadedRequired = requiredDocs.filter(doc => doc.uploaded);

    if (uploadedRequired.length < requiredDocs.length) {
      Alert.alert(
        'Missing Documents',
        'Please upload all required documents before submitting your verification request.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Verification Submitted',
        'Your verification documents have been submitted successfully. We will review them within 2-3 business days and notify you of the results.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit verification. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDocumentItem = (document: VerificationDocument) => (
    <Card key={document.id} variant="elevated" padding="lg" style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <View style={styles.documentInfo}>
          <Text style={styles.documentTitle}>
            {document.title}
            {document.required && <Text style={styles.requiredAsterisk}> *</Text>}
          </Text>
          <Text style={styles.documentDescription}>{document.description}</Text>
        </View>
        {document.uploaded && document.uri && (
          <View style={styles.uploadedBadge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success.main} />
            <Text style={styles.uploadedText}>Uploaded</Text>
          </View>
        )}
      </View>

      {document.uploaded && document.uri ? (
        <View style={styles.uploadedContainer}>
          <Image source={{ uri: document.uri }} style={styles.uploadedImage} />
          <View style={styles.uploadedActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => pickImage(document.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="image" size={16} color={colors.primary[600]} />
              <Text style={styles.actionButtonText}>Replace</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => removeDocument(document.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash" size={16} color={colors.error.main} />
              <Text style={[styles.actionButtonText, styles.deleteText]}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.uploadContainer}>
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => pickImage(document.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="image" size={24} color={colors.primary[600]} />
            <Text style={styles.uploadOptionText}>Choose from Gallery</Text>
          </TouchableOpacity>
          <View style={styles.uploadDivider} />
          <TouchableOpacity
            style={styles.uploadOption}
            onPress={() => takePhoto(document.id)}
            activeOpacity={0.7}
          >
            <Ionicons name="camera" size={24} color={colors.primary[600]} />
            <Text style={styles.uploadOptionText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </Card>
  );

  const requiredUploaded = documents.filter(doc => doc.required && doc.uploaded).length;
  const requiredTotal = documents.filter(doc => doc.required).length;
  const optionalUploaded = documents.filter(doc => !doc.required && doc.uploaded).length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Get Verified</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Section */}
        <Card variant="elevated" padding="lg" style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="shield-checkmark" size={24} color={colors.primary[600]} />
            <Text style={styles.infoTitle}>Why Get Verified?</Text>
          </View>
          <Text style={styles.infoText}>
            Verified tailors get priority in search results, can charge premium rates,
            and build trust with customers. Verification typically takes 2-3 business days.
          </Text>
        </Card>

        {/* Progress Section */}
        <Card variant="elevated" padding="lg" style={styles.progressCard}>
          <Text style={styles.progressTitle}>Verification Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{requiredUploaded}/{requiredTotal}</Text>
              <Text style={styles.progressLabel}>Required</Text>
            </View>
            <View style={styles.progressDivider} />
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{optionalUploaded}</Text>
              <Text style={styles.progressLabel}>Optional</Text>
            </View>
          </View>
        </Card>

        {/* Documents Section */}
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>Required Documents</Text>
          {documents.filter(doc => doc.required).map(renderDocumentItem)}

          <Text style={styles.sectionTitle}>Optional Documents</Text>
          {documents.filter(doc => !doc.required).map(renderDocumentItem)}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <Button
          title={isSubmitting ? "Submitting..." : "Submit for Verification"}
          onPress={handleSubmitVerification}
          disabled={isSubmitting || requiredUploaded < requiredTotal}
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </View>
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
    width: 40,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },

  // Info Card
  infoCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  infoTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  infoText: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 22,
    fontSize: 14,
  },

  // Progress Card
  progressCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  progressTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    fontSize: 18,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressItem: {
    alignItems: 'center',
    flex: 1,
  },
  progressNumber: {
    ...textStyles.h3,
    color: colors.primary[600],
    fontWeight: '700',
    fontSize: 28,
  },
  progressLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginTop: spacing.sm,
    fontSize: 12,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
  },

  // Documents Section
  documentsSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    marginTop: spacing.xl,
    fontSize: 18,
  },

  // Document Cards
  documentCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.sm,
    fontSize: 15,
  },
  requiredAsterisk: {
    color: colors.error.main,
  },
  documentDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 20,
    fontSize: 13,
  },
  uploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success.light + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  uploadedText: {
    ...textStyles.small,
    color: colors.success.main,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },

  // Upload Container
  uploadContainer: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  uploadOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.secondary,
  },
  uploadOptionText: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  uploadDivider: {
    height: 1,
    backgroundColor: colors.border.light,
  },

  // Uploaded Container
  uploadedContainer: {
    borderWidth: 1,
    borderColor: colors.success.light,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  uploadedActions: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
    marginRight: spacing.sm,
  },
  actionButtonText: {
    ...textStyles.small,
    color: colors.primary[600],
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  deleteText: {
    color: colors.error.main,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  submitButton: {
    width: '100%',
  },
});