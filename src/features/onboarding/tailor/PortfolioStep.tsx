import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../components/Button';
import { textStyles } from '../../../design-system/typography';
import { colors } from '../../../design-system/colors';
import { spacing } from '../../../design-system/spacing';

interface PortfolioStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PortfolioStep: React.FC<PortfolioStepProps> = ({ onNext, onBack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Showcase your work</Text>
      <Text style={styles.subtitle}>
        Upload a few images of your best work to attract clients.
      </Text>
      <Button title="Upload Images" variant="outline" style={{ marginBottom: spacing.xl }} />
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={onBack} variant="outline" />
        <Button title="Next" onPress={onNext} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default PortfolioStep;
