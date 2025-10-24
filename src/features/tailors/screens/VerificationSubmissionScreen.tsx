import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TextInput } from 'react-native';
import { Button } from '../../../components/Button';
import { textStyles } from '../../../design-system/typography';
import { colors } from '../../../design-system/colors';
import { spacing } from '../../../design-system/spacing';
import { useAppSelector } from '../../../store/hooks';
import { useUpdateTailorProfileMutation, useGetTailorQuery } from '../../../api/tailors.api';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../../store/navigation';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<MainStackParamList, 'VerificationSubmission'>;

const VerificationSubmissionScreen = ({ navigation }: Props) => {
  const [businessName, setBusinessName] = useState('');
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const [updateTailorProfile, { isLoading }] = useUpdateTailorProfileMutation();
  const { data: tailorProfile, isLoading: isLoadingProfile, error: profileError } = useGetTailorQuery(user?.id || '', {
    skip: !user?.id,
  });

  // Check if user is a tailor and has a profile
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

    if (!isLoadingProfile && profileError) {
      Alert.alert(
        'Profile Not Found',
        'Your tailor profile was not found. Please complete your profile setup first.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [user, isLoadingProfile, profileError, navigation]);

  // Pre-fill business name if profile exists
  useEffect(() => {
    if (tailorProfile?.businessName) {
      setBusinessName(tailorProfile.businessName);
    }
  }, [tailorProfile]);

  // Show loading while checking profile
  if (isLoadingProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  // Don't render if user is not a tailor or profile doesn't exist
  if (!user || user.role !== 'tailor' || profileError) {
    return null;
  }

  const handleUploadId = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission required', 'Permission to access camera roll is required to upload ID photos.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIdPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!businessName.trim()) {
      Alert.alert('Error', 'Please enter your business name.');
      return;
    }

    if (!idPhoto) {
      Alert.alert('Error', 'Please upload an ID photo.');
      return;
    }

    try {
      await updateTailorProfile({
        id: user.id,
        data: {
          businessName: businessName.trim(),
          // idPhoto would be uploaded to cloud storage and URL stored in a verification field
        },
      }).unwrap();
      Alert.alert('Success', 'Verification submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error submitting verification:', error);
      Alert.alert('Error', 'Failed to submit verification. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        title="Back" 
        onPress={() => navigation.goBack()} 
        variant="ghost" 
        style={styles.backButton}
        icon={<Ionicons name="arrow-back" size={20} color={colors.primary[500]} />}
      />
      <Text style={styles.title}>Get Verified</Text>
      <Text style={styles.subtitle}>
        Submit your documents to get a verified badge on your profile.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
      />

      {/* ID Photo Upload Section */}
      <View style={styles.photoSection}>
        <Text style={styles.photoLabel}>ID Photo</Text>
        {idPhoto ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: idPhoto }} style={styles.photoPreview} />
            <Button
              title="Change Photo"
              onPress={handleUploadId}
              variant="outline"
              style={styles.changePhotoButton}
            />
          </View>
        ) : (
          <Button
            title="Upload ID Photo"
            onPress={handleUploadId}
            variant="outline"
            style={styles.uploadButton}
          />
        )}
      </View>

      <Button title="Submit for Review" onPress={handleSubmit} loading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: spacing.lg,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  input: {
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 16,
  },
  photoSection: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  photoLabel: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  photoPreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  changePhotoButton: {
    width: 150,
  },
  uploadButton: {
    width: '100%',
  },
});

export default VerificationSubmissionScreen;
