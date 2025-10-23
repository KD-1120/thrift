import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { textStyles } from '../../../design-system/typography';
import { spacing } from '../../../design-system/spacing';

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ThriftAccra!</Text>
      <Text style={styles.subtitle}>
        Let's set up your tailor profile to start attracting clients.
      </Text>
      <Button title="Get Started" onPress={onNext} />
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
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});

export default WelcomeStep;
