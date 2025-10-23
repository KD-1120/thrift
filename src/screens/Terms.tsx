// Terms of Service Screen - Complete Implementation

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../store/navigation';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';
import { Card } from '../components/Card';
import { IconButton } from '../components/IconButton';

const MAX_CONTENT_WIDTH = 600;

const termsSections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: `By accessing and using ThriftAccra ("the App"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
  },
  {
    id: 'description',
    title: '2. Service Description',
    content: `ThriftAccra is a platform that connects customers with professional tailors in Accra, Ghana. We provide a marketplace for custom clothing services, including but not limited to garment design, measurements, production, and delivery.`,
  },
  {
    id: 'user-accounts',
    title: '3. User Accounts',
    content: `To use our services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration.`,
  },
  {
    id: 'user-conduct',
    title: '4. User Conduct',
    content: `You agree to use the App only for lawful purposes. You shall not:
• Post false, inaccurate, misleading, defamatory, or offensive content
• Impersonate any person or entity
• Interfere with the proper functioning of the App
• Attempt to gain unauthorized access to our systems
• Use the App for any commercial purpose without our written consent`,
  },
  {
    id: 'tailor-services',
    title: '5. Tailor Services',
    content: `Tailors listed on our platform are independent contractors. We do not guarantee the quality, timeliness, or accuracy of services provided by tailors. Customers are encouraged to review tailor profiles, ratings, and portfolios before placing orders.`,
  },
  {
    id: 'orders-payments',
    title: '6. Orders and Payments',
    content: `All orders are binding once confirmed. Payment is processed securely through our platform. Prices are set by individual tailors and may vary. We reserve the right to modify pricing or cancel orders in exceptional circumstances.`,
  },
  {
    id: 'cancellations-refunds',
    title: '7. Cancellations and Refunds',
    content: `Orders may be cancelled within 1 hour of placement for a full refund. After this period, cancellations are subject to tailor discretion. Refunds for completed orders are handled on a case-by-case basis and may be subject to our dispute resolution process.`,
  },
  {
    id: 'intellectual-property',
    title: '8. Intellectual Property',
    content: `All content, features, and functionality of the App are owned by ThriftAccra and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    id: 'privacy',
    title: '9. Privacy and Data Protection',
    content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the App, to understand our practices regarding the collection and use of your personal information.`,
  },
  {
    id: 'disclaimers',
    title: '10. Disclaimers',
    content: `The App is provided "as is" without warranties of any kind. We do not warrant that the App will be uninterrupted or error-free. We disclaim all warranties, express or implied, including but not limited to merchantability and fitness for a particular purpose.`,
  },
  {
    id: 'limitation-liability',
    title: '11. Limitation of Liability',
    content: `In no event shall ThriftAccra be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the App. Our total liability shall not exceed the amount paid by you for the specific service in question.`,
  },
  {
    id: 'indemnification',
    title: '12. Indemnification',
    content: `You agree to indemnify and hold ThriftAccra harmless from any claims, damages, losses, or expenses arising from your use of the App, violation of these terms, or infringement of any rights of another party.`,
  },
  {
    id: 'termination',
    title: '13. Termination',
    content: `We may terminate or suspend your account and access to the App immediately, without prior notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.`,
  },
  {
    id: 'governing-law',
    title: '14. Governing Law',
    content: `These terms shall be governed by and construed in accordance with the laws of Ghana. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Ghana.`,
  },
  {
    id: 'changes',
    title: '15. Changes to Terms',
    content: `We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the App. Continued use of the App after changes constitutes acceptance of the new terms.`,
  },
  {
    id: 'contact',
    title: '16. Contact Information',
    content: `If you have questions about these Terms of Service, please contact us at:
Email: legal@thriftaccra.com
Phone: +233 XX XXX XXXX
Address: Accra, Ghana`,
  },
];

export default function TermsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const currentDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <Text style={styles.headerSubtitle}>Last updated: {currentDate}</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Introduction */}
          <Card variant="outlined" style={styles.introCard}>
            <Text style={styles.introText}>
              Welcome to ThriftAccra! These Terms of Service ("Terms") govern your use of our mobile application and services. By using ThriftAccra, you agree to these terms.
            </Text>
          </Card>

          {/* Terms Sections */}
          {termsSections.map((section) => (
            <Card key={section.id} variant="outlined" style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </Card>
          ))}

          {/* Footer */}
          <Card variant="elevated" style={styles.footerCard}>
            <Text style={styles.footerText}>
              These terms were last updated on {currentDate}. By continuing to use ThriftAccra, you acknowledge that you have read, understood, and agree to be bound by these terms.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + spacing.xs,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
  },
  innerContainer: {
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },

  // Introduction
  introCard: {
    marginBottom: spacing.xl,
  },
  introText: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },

  // Sections
  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  sectionContent: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },

  // Footer
  footerCard: {
    marginTop: spacing.xl,
  },
  footerText: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});
