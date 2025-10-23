import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';

interface FallbackComponentProps {
  resetError: () => void;
}

export const FallbackComponent: React.FC<FallbackComponentProps> = ({ resetError }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Something went wrong</Text>
    <Text style={styles.message}>
      We're sorry, but the app has encountered an unexpected error. Please try again.
    </Text>
    <Button title="Reload App" onPress={resetError} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.primary,
  },
  title: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  message: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
