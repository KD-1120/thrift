// Verification Status Screen - View verification status and apply for verification

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';

type NavigationProp = StackNavigationProp<any>;

// Mock verification data
const MOCK_VERIFICATION_STATUS = {
  isVerified: false,
  applicationStatus: 'none', // 'none', 'pending', 'approved', 'rejected'
  rejectionReason: '',
  appliedDate: '',
  verificationBadge: {
    earned: false,
    requirements: {
      completedOrders: { current: 5, required: 10 },
      avgRating: { current: 4.9, required: 4.5 },
      responseTime: { current: 45, required: 60 }, // minutes
      portfolioItems: { current: 12, required: 5 },
      businessAge: { current: 24, required: 6 }, // months
    },
  },
  benefits: [
    'Verified badge on your profile',
    'Higher visibility in search results',
    'Priority customer support',
    'Access to premium features',
    'Trust signals for customers',
  ],
  requirements: [
    'Complete at least 10 orders',
    'Maintain 4.5+ average rating',
    'Respond to inquiries within 1 hour',
    'Have at least 5 portfolio items',
    'Business account active for 6+ months',
  ],
};

export default function VerificationStatusScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isApplying, setIsApplying] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return colors.success.main;
      case 'pending': return colors.warning.main;
      case 'rejected': return colors.error.main;
      default: return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Verified';
      case 'pending': return 'Application Pending';
      case 'rejected': return 'Application Rejected';
      default: return 'Not Verified';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'shield-checkmark';
      case 'pending': return 'time';
      case 'rejected': return 'close-circle';
      default: return 'shield-outline';
    }
  };

  const handleApplyForVerification = () => {
    const requirements = MOCK_VERIFICATION_STATUS.verificationBadge.requirements;
    const unmetRequirements = [];

    if (requirements.completedOrders.current < requirements.completedOrders.required) {
      unmetRequirements.push(`Complete ${requirements.completedOrders.required - requirements.completedOrders.current} more orders`);
    }
    if (requirements.avgRating.current < requirements.avgRating.required) {
      unmetRequirements.push(`Improve rating to ${requirements.avgRating.required}+`);
    }
    if (requirements.responseTime.current > requirements.responseTime.required) {
      unmetRequirements.push('Improve response time to under 1 hour');
    }
    if (requirements.portfolioItems.current < requirements.portfolioItems.required) {
      unmetRequirements.push(`Add ${requirements.portfolioItems.required - requirements.portfolioItems.current} more portfolio items`);
    }
    if (requirements.businessAge.current < requirements.businessAge.required) {
      unmetRequirements.push(`Account needs to be ${requirements.businessAge.required - requirements.businessAge.current} months older`);
    }

    if (unmetRequirements.length > 0) {
      Alert.alert(
        'Requirements Not Met',
        `To apply for verification, you need to:\n\n${unmetRequirements.join('\n')}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Improve Profile', onPress: () => navigation.navigate('TailorProfileManagement') },
        ]
      );
      return;
    }

    Alert.alert(
      'Apply for Verification',
      'Are you sure you want to apply for verification? Your application will be reviewed within 2-3 business days.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: () => {
            setIsApplying(true);
            // Simulate API call
            setTimeout(() => {
              setIsApplying(false);
              Alert.alert('Success', 'Your verification application has been submitted!', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            }, 2000);
          }
        },
      ]
    );
  };

  const renderRequirementItem = (
    label: string,
    current: number,
    required: number,
    unit: string = '',
    isTime: boolean = false
  ) => {
    const isMet = isTime ? current <= required : current >= required;
    const progress = Math.min((current / required) * 100, 100);

    return (
      <View style={styles.requirementItem}>
        <View style={styles.requirementHeader}>
          <Text style={styles.requirementLabel}>{label}</Text>
          <View style={styles.requirementValue}>
            <Ionicons
              name={isMet ? 'checkmark-circle' : 'ellipse-outline'}
              size={16}
              color={isMet ? colors.success.main : colors.text.secondary}
            />
            <Text style={[styles.requirementText, isMet && styles.requirementTextMet]}>
              {isTime ? `${current}min` : current}{unit} / {isTime ? `${required}min` : required}{unit}
            </Text>
          </View>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
              isMet && styles.progressFillMet
            ]}
          />
        </View>
      </View>
    );
  };

  const renderStatusCard = () => (
    <Card variant="elevated" padding="xl" style={styles.statusCard}>
      <View style={styles.statusHeader}>
        <View style={[styles.statusIcon, { backgroundColor: getStatusColor(MOCK_VERIFICATION_STATUS.applicationStatus) + '20' }]}>
          <Ionicons
            name={getStatusIcon(MOCK_VERIFICATION_STATUS.applicationStatus) as any}
            size={32}
            color={getStatusColor(MOCK_VERIFICATION_STATUS.applicationStatus)}
          />
        </View>
        <View style={styles.statusContent}>
          <Text style={styles.statusTitle}>
            {getStatusText(MOCK_VERIFICATION_STATUS.applicationStatus)}
          </Text>
          <Text style={styles.statusSubtitle}>
            {MOCK_VERIFICATION_STATUS.applicationStatus === 'pending'
              ? 'Your application is being reviewed'
              : MOCK_VERIFICATION_STATUS.applicationStatus === 'rejected'
              ? 'Your application was not approved'
              : 'Build trust with verified status'
            }
          </Text>
        </View>
      </View>

      {MOCK_VERIFICATION_STATUS.applicationStatus === 'rejected' && MOCK_VERIFICATION_STATUS.rejectionReason && (
        <View style={styles.rejectionNotice}>
          <Ionicons name="information-circle" size={20} color={colors.error.main} />
          <Text style={styles.rejectionText}>{MOCK_VERIFICATION_STATUS.rejectionReason}</Text>
        </View>
      )}
    </Card>
  );

  const renderBenefits = () => (
    <Card variant="elevated" padding="xl" style={styles.section}>
      <Text style={styles.sectionTitle}>Verification Benefits</Text>
      <Text style={styles.sectionSubtitle}>Why get verified?</Text>

      {MOCK_VERIFICATION_STATUS.benefits.map((benefit, index) => (
        <View key={index} style={styles.benefitItem}>
          <Ionicons name="checkmark" size={20} color={colors.success.main} />
          <Text style={styles.benefitText}>{benefit}</Text>
        </View>
      ))}
    </Card>
  );

  const renderRequirements = () => (
    <Card variant="elevated" padding="xl" style={styles.section}>
      <Text style={styles.sectionTitle}>Requirements</Text>
      <Text style={styles.sectionSubtitle}>What you need to qualify</Text>

      {renderRequirementItem(
        'Completed Orders',
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.completedOrders.current,
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.completedOrders.required
      )}

      {renderRequirementItem(
        'Average Rating',
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.avgRating.current,
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.avgRating.required,
        ' stars'
      )}

      {renderRequirementItem(
        'Response Time',
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.responseTime.current,
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.responseTime.required,
        ' min',
        true
      )}

      {renderRequirementItem(
        'Portfolio Items',
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.portfolioItems.current,
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.portfolioItems.required
      )}

      {renderRequirementItem(
        'Account Age',
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.businessAge.current,
        MOCK_VERIFICATION_STATUS.verificationBadge.requirements.businessAge.required,
        ' months'
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verification</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Status Card */}
        {renderStatusCard()}

        {/* Benefits */}
        {renderBenefits()}

        {/* Requirements */}
        {renderRequirements()}

        {/* Application Section */}
        {MOCK_VERIFICATION_STATUS.applicationStatus === 'none' && (
          <Card variant="elevated" padding="xl" style={styles.section}>
            <Text style={styles.sectionTitle}>Apply for Verification</Text>
            <Text style={styles.sectionSubtitle}>
              Ready to build trust with customers? Apply for verification to showcase your credibility.
            </Text>

            <View style={styles.applicationActions}>
              <Button
                title="Apply Now"
                onPress={handleApplyForVerification}
                style={styles.applyButton}
                loading={isApplying}
              />
              <TouchableOpacity
                style={styles.learnMoreButton}
                onPress={() => Alert.alert('Learn More', 'Verification helps customers trust your business and increases your visibility.')}
                activeOpacity={0.7}
              >
                <Text style={styles.learnMoreText}>Learn More</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {MOCK_VERIFICATION_STATUS.applicationStatus === 'pending' && (
          <Card variant="elevated" padding="xl" style={styles.section}>
            <Text style={styles.sectionTitle}>Application in Review</Text>
            <Text style={styles.sectionSubtitle}>
              We're reviewing your application. You'll receive a notification once we make a decision.
            </Text>
            <Text style={styles.pendingText}>
              Applied on {MOCK_VERIFICATION_STATUS.appliedDate || 'Recent date'}
            </Text>
          </Card>
        )}

        {MOCK_VERIFICATION_STATUS.applicationStatus === 'approved' && (
          <Card variant="elevated" padding="xl" style={styles.section}>
            <Text style={styles.sectionTitle}>🎉 Congratulations!</Text>
            <Text style={styles.sectionSubtitle}>
              Your business is now verified. Customers will see the verification badge on your profile.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.tertiary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
  },
  headerRight: {
    width: 40,
  },

  // Status Card
  statusCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  statusSubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  rejectionNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.error.light,
    padding: spacing.lg,
    borderRadius: radius.md,
    marginTop: spacing.lg,
  },
  rejectionText: {
    ...textStyles.body,
    color: colors.error.main,
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 22,
  },

  // Sections
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },

  // Benefits
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  benefitText: {
    ...textStyles.body,
    color: colors.text.primary,
    marginLeft: spacing.md,
    flex: 1,
    lineHeight: 22,
  },

  // Requirements
  requirementItem: {
    marginBottom: spacing.lg,
  },
  requirementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  requirementLabel: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  requirementValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  requirementText: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
  },
  requirementTextMet: {
    color: colors.success.main,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border.light,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary[600],
    borderRadius: 3,
  },
  progressFillMet: {
    backgroundColor: colors.success.main,
  },

  // Application
  applicationActions: {
    alignItems: 'center',
  },
  applyButton: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  learnMoreButton: {
    paddingVertical: spacing.sm,
  },
  learnMoreText: {
    ...textStyles.bodyMedium,
    color: colors.primary[600],
    fontWeight: '600',
  },

  // Pending/Rejected States
  pendingText: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
});