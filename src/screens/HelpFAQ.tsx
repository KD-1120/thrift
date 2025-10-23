// Help & FAQ Screen - Complete Implementation

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../store/navigation';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';

const MAX_CONTENT_WIDTH = 600;

// FAQ data
const faqCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Tap the "Sign Up" button and choose whether you\'re a customer or tailor. Fill in your details and verify your email to get started.',
      },
      {
        question: 'What\'s the difference between customer and tailor accounts?',
        answer: 'Customer accounts let you browse tailors and place orders. Tailor accounts let you showcase your work, manage orders, and build your business profile.',
      },
      {
        question: 'Is ThriftAccra free to use?',
        answer: 'Yes! Creating an account and browsing tailors is completely free. We only charge a small commission on completed orders.',
      },
    ],
  },
  {
    id: 'ordering',
    title: 'Ordering & Payments',
    icon: '🛒',
    faqs: [
      {
        question: 'How do I place an order?',
        answer: 'Browse tailors, select one, and use the booking flow to specify your garment type, measurements, and requirements. Review and confirm your order.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept Mobile Money (MTN MoMo, Vodafone Cash, Airtel Money) and major credit/debit cards (Visa, Mastercard).',
      },
      {
        question: 'When do I pay for my order?',
        answer: 'Payment is collected upfront when you place the order. This ensures your tailor has materials ready for your garment.',
      },
      {
        question: 'Can I cancel or modify my order?',
        answer: 'Orders can be cancelled within 1 hour of placement. After that, contact your tailor directly to discuss modifications.',
      },
    ],
  },
  {
    id: 'measurements',
    title: 'Measurements',
    icon: '📏',
    faqs: [
      {
        question: 'Do I need to provide measurements?',
        answer: 'Yes, accurate measurements are essential for well-fitting garments. You can save measurements for future orders.',
      },
      {
        question: 'How do I take accurate measurements?',
        answer: 'Wear form-fitting clothing, use a flexible tape measure, and stand straight. Check our measurement guide in the app for detailed instructions.',
      },
      {
        question: 'Can I get measured professionally?',
        answer: 'Many tailors offer in-person measurement services. Contact your chosen tailor to arrange a consultation.',
      },
      {
        question: 'What if my measurements change?',
        answer: 'You can update your saved measurements anytime in Settings. For existing orders, contact your tailor directly.',
      },
    ],
  },
  {
    id: 'tailors',
    title: 'Working with Tailors',
    icon: '👔',
    faqs: [
      {
        question: 'How do I choose a good tailor?',
        answer: 'Check reviews, portfolio quality, response time, and pricing. Verified tailors have completed background checks.',
      },
      {
        question: 'How do I communicate with my tailor?',
        answer: 'Use the in-app messaging system for all communications. You can also call or video chat for consultations.',
      },
      {
        question: 'What if I\'m not satisfied with my order?',
        answer: 'Contact your tailor first to discuss concerns. If unresolved, our support team can help mediate. We offer satisfaction guarantees.',
      },
      {
        question: 'How long does it take to complete an order?',
        answer: 'Standard turnaround is 3-5 business days, but this varies by garment complexity. Your tailor will provide an estimated completion date.',
      },
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery & Pickup',
    icon: '🚚',
    faqs: [
      {
        question: 'How does delivery work?',
        answer: 'Tailors can deliver completed garments or you can pick them up. Delivery fees vary by location within Greater Accra.',
      },
      {
        question: 'What are your delivery areas?',
        answer: 'We currently serve Greater Accra Region. Contact support to check if your area is covered.',
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes! Use the order tracking feature to see your order status from placement to delivery.',
      },
      {
        question: 'What if my delivery is delayed?',
        answer: 'Delays are rare, but if they occur, your tailor will notify you. Contact support if you haven\'t heard from them.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Account & Settings',
    icon: '⚙️',
    faqs: [
      {
        question: 'How do I update my profile?',
        answer: 'Go to Settings > Edit Profile to update your information, avatar, and preferences.',
      },
      {
        question: 'Can I change my account type?',
        answer: 'Currently, you need to create a separate account for each type (customer vs tailor). Contact support for assistance.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Use the "Forgot Password" link on the sign-in screen, or go to Settings > Account to change your password.',
      },
      {
        question: 'How do I delete my account?',
        answer: 'Contact our support team to request account deletion. This action cannot be undone.',
      },
    ],
  },
];

export default function HelpFAQScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedFAQ(null); // Close any open FAQ when switching categories
  };

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleContactSupport = () => {
    // TODO: Navigate to contact support screen or open email
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Help & FAQ</Text>
        <Text style={styles.headerSubtitle}>Find answers to common questions</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Search Bar Placeholder */}
          <Card variant="outlined" style={styles.searchCard}>
            <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
              <Text style={styles.searchIcon}>🔍</Text>
              <Text style={styles.searchText}>Search FAQs...</Text>
            </TouchableOpacity>
          </Card>

          {/* FAQ Categories */}
          {faqCategories.map((category) => (
            <View key={category.id} style={styles.categoryContainer}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category.id)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryLeft}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                </View>
                <Text style={styles.categoryArrow}>
                  {expandedCategory === category.id ? '−' : '+'}
                </Text>
              </TouchableOpacity>

              {expandedCategory === category.id && (
                <View style={styles.faqList}>
                  {category.faqs.map((faq, index) => {
                    const faqId = `${category.id}-${index}`;
                    return (
                      <View key={faqId} style={styles.faqItem}>
                        <TouchableOpacity
                          style={styles.faqQuestion}
                          onPress={() => toggleFAQ(faqId)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.questionText}>{faq.question}</Text>
                          <Text style={styles.faqArrow}>
                            {expandedFAQ === faqId ? '−' : '+'}
                          </Text>
                        </TouchableOpacity>

                        {expandedFAQ === faqId && (
                          <View style={styles.faqAnswer}>
                            <Text style={styles.answerText}>{faq.answer}</Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          ))}

          {/* Contact Support */}
          <Card variant="elevated" style={styles.contactCard}>
            <Text style={styles.contactTitle}>💬 Still Need Help?</Text>
            <Text style={styles.contactText}>
              Can't find what you're looking for? Our support team is here to help!
            </Text>
            <View style={styles.contactButtons}>
              <Button
                title="Contact Support"
                onPress={handleContactSupport}
                style={styles.contactButton}
              />
            </View>
          </Card>

          {/* Quick Links */}
          <Card variant="outlined" style={styles.linksCard}>
            <Text style={styles.linksTitle}>🔗 Quick Links</Text>
            <View style={styles.linksGrid}>
              <TouchableOpacity style={styles.linkItem} activeOpacity={0.7}>
                <Text style={styles.linkIcon}>📱</Text>
                <Text style={styles.linkText}>App Tutorial</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkItem} activeOpacity={0.7}>
                <Text style={styles.linkIcon}>📏</Text>
                <Text style={styles.linkText}>Measurement Guide</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkItem} activeOpacity={0.7}>
                <Text style={styles.linkIcon}>💳</Text>
                <Text style={styles.linkText}>Payment Help</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkItem} activeOpacity={0.7}>
                <Text style={styles.linkIcon}>🚚</Text>
                <Text style={styles.linkText}>Delivery Info</Text>
              </TouchableOpacity>
            </View>
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

  // Search
  searchCard: {
    marginBottom: spacing.xl,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: spacing.md,
    color: colors.text.tertiary,
  },
  searchText: {
    ...textStyles.body,
    color: colors.text.tertiary,
    flex: 1,
  },

  // Categories
  categoryContainer: {
    marginBottom: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  categoryTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  categoryArrow: {
    fontSize: 24,
    color: colors.text.tertiary,
    fontWeight: '600',
  },

  // FAQ Items
  faqList: {
    marginTop: spacing.md,
    paddingLeft: spacing.xl,
  },
  faqItem: {
    borderLeftWidth: 2,
    borderLeftColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
  },
  questionText: {
    ...textStyles.body,
    color: colors.text.primary,
    flex: 1,
    fontWeight: '500',
  },
  faqArrow: {
    fontSize: 18,
    color: colors.text.tertiary,
    fontWeight: '600',
    marginLeft: spacing.md,
  },
  faqAnswer: {
    paddingVertical: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    paddingBottom: spacing.md,
  },
  answerText: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },

  // Contact Support
  contactCard: {
    marginVertical: spacing.xl,
  },
  contactTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  contactText: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  contactButtons: {
    alignItems: 'flex-start',
  },
  contactButton: {
    minWidth: 160,
  },

  // Quick Links
  linksCard: {
    marginTop: spacing.xl,
  },
  linksTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  linkItem: {
    flex: 1,
    minWidth: 140,
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  linkIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  linkText: {
    ...textStyles.body,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
