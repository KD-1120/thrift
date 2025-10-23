import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../design-system/colors';
import { spacing, radius } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH > 720;

type RootStackParamList = {
  SignUp: { role: 'customer' | 'tailor' };
  SignIn: undefined;
};

export default function RoleSelectionScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const selectRole = (role: 'customer' | 'tailor') => {
    navigation.navigate('SignUp', { role });
  };

  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Thrift</Text>
          <Text style={styles.subtitle}>Join the fashion movement</Text>
          <Text style={styles.description}>
            Choose your role to begin—connect with expert tailors or offer your services.
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.cardsWrapper}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => selectRole('customer')}
            activeOpacity={0.9}
            accessibilityLabel="Sign up as a customer"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={[colors.primary[50], colors.primary[100]]}
              style={styles.cardGradient}
            >
              <View style={styles.cardTop}>
                <View style={styles.iconWrapper}>
                  <Text style={styles.emoji}>🛍️</Text>
                </View>
                <Text style={styles.cardTitle}>I'm a Customer</Text>
                <Text style={styles.cardDescription}>
                  Browse verified tailors, place custom orders, and track progress.
                </Text>
              </View>
              <View style={styles.cardBenefits}>
                <Text style={styles.benefitTag}>Find local experts</Text>
                <Text style={styles.benefitTag}>Custom measurements</Text>
                <Text style={styles.benefitTag}>Quality guaranteed</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => selectRole('tailor')}
            activeOpacity={0.9}
            accessibilityLabel="Sign up as a tailor"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={[colors.semantic.successBackground, colors.primary[100]]}
              style={styles.cardGradient}
            >
              <View style={styles.cardTop}>
                <View style={styles.iconWrapper}>
                  <Text style={styles.emoji}>✂️</Text>
                </View>
                <Text style={styles.cardTitle}>I'm a Tailor</Text>
                <Text style={styles.cardDescription}>
                  Showcase your work, receive orders, and build a loyal customer base.
                </Text>
              </View>
              <View style={styles.cardBenefits}>
                <Text style={styles.benefitTag}>Build your portfolio</Text>
                <Text style={styles.benefitTag}>Manage orders</Text>
                <Text style={styles.benefitTag}>Grow your brand</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleSignIn} accessibilityRole="button">
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.footerLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl * 1.5,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: colors.primary[700],
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 26,
  },
  description: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: spacing.md,
  },

  // Cards
  cardsWrapper: {
    flex: 1,
    flexDirection: IS_TABLET ? 'row' : 'column',
    gap: spacing.lg,
  },
  card: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardGradient: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'space-between',
    minHeight: 220,
  },
  cardTop: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  emoji: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 28,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.xs,
  },
  cardBenefits: {
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  benefitTag: {
    fontSize: 13,
    color: colors.text.tertiary,
    fontWeight: '500',
    lineHeight: 18,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  footerText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  footerLink: {
    color: colors.primary[600],
    fontWeight: '600',
  },
})