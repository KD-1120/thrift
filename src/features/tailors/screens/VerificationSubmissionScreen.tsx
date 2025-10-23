import React from 'react';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../components/Button';
import { textStyles } from '../../../design-system/typography';
import { colors } from '../../../design-system/colors';
import { spacing } from '../../../design-system/spacing';

import { useState } from 'react';
import { TextInput, Alert } from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import { useUpdateTailorProfileMutation } from '../../../api/tailors.api';

const VerificationSubmissionScreen = ({ navigation }) => {
  const [businessName, setBusinessName] = useState('');
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const [updateTailorProfile, { isLoading }] = useUpdateTailorProfileMutation();

  const handleUploadId = async () => {
    // In a real app, you would use a library like react-native-image-picker
    // to let the user select an image from their device.
    setIdPhoto('https://via.placeholder.com/150');
  };

  const handleSubmit = async () => {
    if (!user) return;
    try {
      await updateTailorProfile({
        id: user.id,
        data: {
          businessName,
          // In a real app, you would upload the idPhoto to a cloud storage service
          // and send the URL to the backend.
        },
      }).unwrap();
      Alert.alert('Success', 'Verification submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit verification. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
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
      <Button title={idPhoto ? 'ID Uploaded' : 'Upload ID'} onPress={handleUploadId} variant="outline" style={{ marginBottom: 16 }} />
      <Button title="Submit for Review" onPress={handleSubmit} loading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
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
});

export default VerificationSubmissionScreen;
