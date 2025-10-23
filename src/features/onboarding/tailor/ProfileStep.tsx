import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';

import { useState } from 'react';

interface ProfileStepProps {
  onNext: (data: { businessName: string; description: string }) => void;
  onBack: () => void;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ onNext, onBack }) => {
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');

  const handleNext = () => {
    onNext({ businessName, description });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your profile</Text>
      <Card variant="outlined" padding="lg">
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Business Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Ama's Stitches"
            placeholderTextColor={colors.text.placeholder}
            value={businessName}
            onChangeText={setBusinessName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>A brief description of your business</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="e.g., I specialize in traditional and modern wear for all occasions."
            placeholderTextColor={colors.text.placeholder}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>
      </Card>
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={onBack} variant="outline" />
        <Button title="Next" onPress={handleNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...textStyles.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  textInput: {
    ...textStyles.body,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
  },
});

export default ProfileStep;
