import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../components/Button';
import { textStyles } from '../../../design-system/typography';
import { colors } from '../../../design-system/colors';
import { spacing } from '../../../design-system/spacing';

interface ServicesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const ServicesStep: React.FC<ServicesStepProps> = ({ onNext, onBack }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Define your services</Text>
      <Text style={styles.subtitle}>
        Let clients know what you specialize in and your price range.
      </Text>
      {/* TODO: Add specialties and pricing form */}
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={onBack} variant="outline" />
        <Button title="Finish" onPress={onNext} />
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

export default ServicesStep;
