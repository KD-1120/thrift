// Response Time Settings Screen - Monitor and improve response times

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type NavigationProp = StackNavigationProp<any>;

// Mock response time data
const MOCK_RESPONSE_DATA = {
  currentAvg: 45, // minutes
  target: 60, // minutes (under 1 hour)
  todayStats: {
    messagesReceived: 12,
    messagesReplied: 10,
    avgResponseTime: 38,
    bestResponseTime: 5,
    worstResponseTime: 120,
  },
  weeklyStats: [
    { day: 'Mon', avgTime: 42, messages: 8 },
    { day: 'Tue', avgTime: 38, messages: 12 },
    { day: 'Wed', avgTime: 55, messages: 6 },
    { day: 'Thu', avgTime: 48, messages: 15 },
    { day: 'Fri', avgTime: 35, messages: 18 },
    { day: 'Sat', avgTime: 62, messages: 4 },
    { day: 'Sun', avgTime: 58, messages: 3 },
  ],
  improvementTips: [
    {
      title: 'Set up push notifications',
      description: 'Enable notifications to respond faster to new messages',
      completed: true,
      impact: 'high',
    },
    {
      title: 'Create quick responses',
      description: 'Save common responses for faster replies',
      completed: false,
      impact: 'medium',
    },
    {
      title: 'Set response time goals',
      description: 'Aim to respond within 30 minutes during business hours',
      completed: true,
      impact: 'high',
    },
    {
      title: 'Use auto-replies',
      description: 'Set up automatic responses when you\'re busy',
      completed: false,
      impact: 'medium',
    },
    {
      title: 'Check messages regularly',
      description: 'Review messages at least every 2 hours',
      completed: true,
      impact: 'high',
    },
  ],
  recentResponses: [
    { time: '2 min ago', responseTime: 2, customer: 'Akua M.', message: 'Hi, I need alterations...' },
    { time: '15 min ago', responseTime: 8, customer: 'Kofi A.', message: 'Can you do custom work?' },
    { time: '1 hour ago', responseTime: 45, customer: 'Adwoa O.', message: 'Quote for wedding dress' },
    { time: '2 hours ago', responseTime: 120, customer: 'Yaw B.', message: 'Available this weekend?' },
  ],
};

export default function ResponseTimeSettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  const getTimeColor = (minutes: number) => {
    if (minutes <= 30) return colors.success.main;
    if (minutes <= 60) return colors.warning.main;
    return colors.error.main;
  };

  const getTimeStatus = (minutes: number) => {
    if (minutes <= 30) return 'Excellent';
    if (minutes <= 60) return 'Good';
    return 'Needs Improvement';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderWeeklyChart = () => (
    <Card variant="elevated" padding="xl" style={styles.section}>
      <Text style={styles.sectionTitle}>Weekly Response Times</Text>
      <Text style={styles.sectionSubtitle}>Your average response time by day</Text>

      <View style={styles.chartContainer}>
        {MOCK_RESPONSE_DATA.weeklyStats.map((day) => {
          const maxTime = Math.max(...MOCK_RESPONSE_DATA.weeklyStats.map(d => d.avgTime));
          const height = (day.avgTime / maxTime) * 120;

          return (
            <View key={day.day} style={styles.chartBar}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height,
                      backgroundColor: getTimeColor(day.avgTime),
                    }
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{day.day}</Text>
              <Text style={styles.barValue}>{day.avgTime}m</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.success.main }]} />
          <Text style={styles.legendText}>Under 30min</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.warning.main }]} />
          <Text style={styles.legendText}>30-60min</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.error.main }]} />
          <Text style={styles.legendText}>Over 60min</Text>
        </View>
      </View>
    </Card>
  );

  const renderImprovementTips = () => (
    <Card variant="elevated" padding="xl" style={styles.section}>
      <Text style={styles.sectionTitle}>Improvement Tips</Text>
      <Text style={styles.sectionSubtitle}>Ways to respond faster to customers</Text>

      {MOCK_RESPONSE_DATA.improvementTips.map((tip, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tipItem}
          onPress={() => setSelectedTip(selectedTip === index ? null : index)}
          activeOpacity={0.7}
        >
          <View style={styles.tipHeader}>
            <View style={styles.tipLeft}>
              <View style={[styles.tipCheckbox, tip.completed && styles.tipCheckboxCompleted]}>
                {tip.completed && (
                  <Ionicons name="checkmark" size={16} color={colors.background.primary} />
                )}
              </View>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, tip.completed && styles.tipTitleCompleted]}>
                  {tip.title}
                </Text>
                <Text style={styles.tipDescription}>{tip.description}</Text>
              </View>
            </View>
            <View style={[styles.impactBadge, { backgroundColor: getImpactColor(tip.impact) }]}>
              <Text style={styles.impactText}>{tip.impact}</Text>
            </View>
          </View>

          {selectedTip === index && (
            <View style={styles.tipActions}>
              {!tip.completed ? (
                <Button
                  title="Mark as Done"
                  onPress={() => Alert.alert('Success', 'Tip marked as completed!')}
                  style={styles.tipActionButton}
                  size="small"
                />
              ) : (
                <Text style={styles.completedText}>✓ Completed</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </Card>
  );

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return colors.success.main;
      case 'medium': return colors.warning.main;
      case 'low': return colors.error.main;
      default: return colors.text.secondary;
    }
  };

  const renderRecentResponses = () => (
    <Card variant="elevated" padding="xl" style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Responses</Text>
      <Text style={styles.sectionSubtitle}>Your latest message responses</Text>

      {MOCK_RESPONSE_DATA.recentResponses.map((response, index) => (
        <View key={index} style={styles.responseItem}>
          <View style={styles.responseHeader}>
            <Text style={styles.responseCustomer}>{response.customer}</Text>
            <View style={styles.responseTime}>
              <Ionicons name="time-outline" size={14} color={getTimeColor(response.responseTime)} />
              <Text style={[styles.responseTimeText, { color: getTimeColor(response.responseTime) }]}>
                {formatTime(response.responseTime)}
              </Text>
            </View>
          </View>
          <Text style={styles.responseMessage} numberOfLines={1}>
            {response.message}
          </Text>
          <Text style={styles.responseTimestamp}>{response.time}</Text>
        </View>
      ))}
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
          <Text style={styles.headerTitle}>Response Time</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Current Status */}
        <Card variant="elevated" padding="xl" style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIcon}>
              <Ionicons name="time-outline" size={32} color={getTimeColor(MOCK_RESPONSE_DATA.currentAvg)} />
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusValue}>{formatTime(MOCK_RESPONSE_DATA.currentAvg)}</Text>
              <Text style={styles.statusLabel}>Average Response Time</Text>
              <Text style={[styles.statusStatus, { color: getTimeColor(MOCK_RESPONSE_DATA.currentAvg) }]}>
                {getTimeStatus(MOCK_RESPONSE_DATA.currentAvg)}
              </Text>
            </View>
          </View>

          <View style={styles.targetInfo}>
            <Text style={styles.targetText}>
              Target: Under {formatTime(MOCK_RESPONSE_DATA.target)}
            </Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min((MOCK_RESPONSE_DATA.currentAvg / MOCK_RESPONSE_DATA.target) * 100, 100)}%`,
                      backgroundColor: getTimeColor(MOCK_RESPONSE_DATA.currentAvg),
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {MOCK_RESPONSE_DATA.currentAvg <= MOCK_RESPONSE_DATA.target ? 'On Track' : 'Needs Work'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Today's Stats */}
        <View style={styles.statsGrid}>
          <Card variant="elevated" padding="lg" style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_RESPONSE_DATA.todayStats.messagesReceived}</Text>
            <Text style={styles.statLabel}>Messages Today</Text>
          </Card>
          <Card variant="elevated" padding="lg" style={styles.statCard}>
            <Text style={styles.statValue}>{MOCK_RESPONSE_DATA.todayStats.messagesReplied}</Text>
            <Text style={styles.statLabel}>Replied</Text>
          </Card>
          <Card variant="elevated" padding="lg" style={styles.statCard}>
            <Text style={styles.statValue}>{formatTime(MOCK_RESPONSE_DATA.todayStats.bestResponseTime)}</Text>
            <Text style={styles.statLabel}>Best Time</Text>
          </Card>
          <Card variant="elevated" padding="lg" style={styles.statCard}>
            <Text style={styles.statValue}>{formatTime(MOCK_RESPONSE_DATA.todayStats.worstResponseTime)}</Text>
            <Text style={styles.statLabel}>Worst Time</Text>
          </Card>
        </View>

        {/* Weekly Chart */}
        {renderWeeklyChart()}

        {/* Improvement Tips */}
        {renderImprovementTips()}

        {/* Recent Responses */}
        {renderRecentResponses()}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Set Response Goals"
            onPress={() => Alert.alert('Coming Soon', 'Response time goals will be available in a future update.')}
            style={styles.actionButton}
            variant="outline"
          />
          <Button
            title="View All Messages"
            onPress={() => navigation.navigate('Conversations')}
            style={styles.actionButton}
          />
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
    marginBottom: spacing.lg,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  statusContent: {
    flex: 1,
  },
  statusValue: {
    ...textStyles.h2,
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: '700',
  },
  statusLabel: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  statusStatus: {
    ...textStyles.bodyMedium,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  targetInfo: {
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  targetText: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    ...textStyles.small,
    color: colors.text.secondary,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
    alignItems: 'center',
  },
  statValue: {
    ...textStyles.h4,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    textAlign: 'center',
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

  // Chart
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
    marginBottom: spacing.lg,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bar: {
    width: 24,
    borderRadius: 12,
    minHeight: 4,
  },
  barLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  barValue: {
    ...textStyles.small,
    color: colors.text.primary,
    fontWeight: '600',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...textStyles.small,
    color: colors.text.secondary,
  },

  // Tips
  tipItem: {
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tipCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  tipCheckboxCompleted: {
    backgroundColor: colors.success.main,
    borderColor: colors.success.main,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  tipTitleCompleted: {
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
  },
  tipDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  impactBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  impactText: {
    ...textStyles.small,
    color: colors.background.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tipActions: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  tipActionButton: {
    alignSelf: 'flex-start',
  },
  completedText: {
    ...textStyles.bodyMedium,
    color: colors.success.main,
    fontWeight: '600',
  },

  // Responses
  responseItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  responseCustomer: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
  },
  responseTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  responseTimeText: {
    ...textStyles.small,
    fontWeight: '600',
  },
  responseMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  responseTimestamp: {
    ...textStyles.small,
    color: colors.text.tertiary,
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.huge,
  },
  actionButton: {
    flex: 1,
  },
});