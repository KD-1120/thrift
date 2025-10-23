import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { textStyles } from '../../../design-system/typography';
import { spacing } from '../../../design-system/spacing';

interface CustomerWelcomeScreenProps {
  onDismiss: () => void;
}

const CustomerWelcomeScreen: React.FC<CustomerWelcomeScreenProps> = ({ onDismiss }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ThriftAccra!</Text>
      <Text style={styles.subtitle}>
        The easiest way to find and book the best tailors in Accra.
      </Text>
      <View style={styles.feature}>
        <Text style={styles.featureEmoji}>🔎</Text>
        <Text style={styles.featureText}>Discover talented tailors near you.</Text>
      </View>
      <View style={styles.feature}>
        <Text style={styles.featureEmoji}>📅</Text>
        <Text style={styles.featureText}>Book appointments and custom orders seamlessly.</Text>
      </View>
      <View style={styles.feature}>
        <Text style={styles.featureEmoji}>💬</Text>
        <Text style={styles.featureText}>Communicate directly with your tailor.</Text>
      </View>
      <Button title="Start Exploring" onPress={onDismiss} style={{ marginTop: spacing.xl }} />
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
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  featureText: {
    ...textStyles.body,
    color: colors.text.primary,
  },
});

export default CustomerWelcomeScreen;
