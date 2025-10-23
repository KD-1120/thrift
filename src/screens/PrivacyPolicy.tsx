// Privacy Policy Screen - Complete Implementation

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

const privacySections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: `ThriftAccra ("we", "us", or "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.`,
  },
  {
    id: 'information-collect',
    title: '2. Information We Collect',
    content: `We collect information you provide directly to us, such as when you create an account, place orders, or contact support. This includes:
• Name, email address, phone number
• Profile information and preferences
• Body measurements for custom orders
• Payment information and billing addresses
• Communication history and feedback
• Device information and usage data`,
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    content: `We use collected information to:
• Provide and maintain our services
• Process orders and payments
• Communicate with you about your orders
• Send service updates and marketing communications
• Improve our app and develop new features
• Ensure platform security and prevent fraud
• Comply with legal obligations`,
  },
  {
    id: 'information-sharing',
    title: '4. Information Sharing and Disclosure',
    content: `We may share your information with:
• Tailors to fulfill your orders (measurements, contact details)
• Payment processors for secure transactions
• Service providers who assist our operations
• Law enforcement when required by law
• Other users as necessary for order fulfillment

We do not sell your personal information to third parties.`,
  },
  {
    id: 'data-security',
    title: '5. Data Security',
    content: `We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments.`,
  },
  {
    id: 'data-retention',
    title: '6. Data Retention',
    content: `We retain your personal data only as long as necessary for the purposes outlined in this policy, unless a longer retention period is required by law. Order data is typically retained for 7 years for tax and accounting purposes.`,
  },
  {
    id: 'your-rights',
    title: '7. Your Rights',
    content: `You have the right to:
• Access your personal data
• Correct inaccurate information
• Delete your account and data
• Object to processing in certain circumstances
• Data portability
• Withdraw consent for marketing communications

Contact us to exercise these rights.`,
  },
  {
    id: 'cookies-tracking',
    title: '8. Cookies and Tracking Technologies',
    content: `We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie preferences through your device settings.`,
  },
  {
    id: 'third-party-services',
    title: '9. Third-Party Services',
    content: `Our app may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services. Please review their privacy policies.`,
  },
  {
    id: 'international-transfers',
    title: '10. International Data Transfers',
    content: `Your data may be transferred to and processed in countries other than Ghana. We ensure appropriate safeguards are in place to protect your data during international transfers.`,
  },
  {
    id: 'childrens-privacy',
    title: '11. Children\'s Privacy',
    content: `Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information immediately.`,
  },
  {
    id: 'changes-policy',
    title: '12. Changes to This Privacy Policy',
    content: `We may update this privacy policy from time to time. We will notify you of any material changes via email or through the app. Your continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
  {
    id: 'contact-us',
    title: '13. Contact Us',
    content: `If you have questions about this privacy policy or our data practices, please contact us at:
Email: privacy@thriftaccra.com
Phone: +233 XX XXX XXXX
Address: Accra, Ghana

You can also reach us through the app's support section.`,
  },
];

export default function PrivacyPolicyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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
              Your privacy is important to us. This policy explains how ThriftAccra collects, uses, and protects your personal information.
            </Text>
          </Card>

          {/* Privacy Sections */}
          {privacySections.map((section) => (
            <Card key={section.id} variant="outlined" style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionContent}>{section.content}</Text>
            </Card>
          ))}

          {/* Footer */}
          <Card variant="elevated" style={styles.footerCard}>
            <Text style={styles.footerText}>
              This privacy policy was last updated on {currentDate}. By using ThriftAccra, you consent to the collection and use of information in accordance with this policy.
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
