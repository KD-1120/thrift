// Review Management Screen - View and respond to customer reviews

import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
import { useAppSelector } from '../../../store/hooks';
import {
  useGetTailorReviewsQuery,
  useRespondToTailorReviewMutation,
} from '../../../api/tailors.api';
import type { TailorReview } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/formatters';

type NavigationProp = StackNavigationProp<any>;

const FILTERS = ['all', 'unresponded', 'responded'] as const;
type ReviewFilter = (typeof FILTERS)[number];

export default function ReviewManagementScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useAppSelector((state) => state.auth.user);
  const tailorId = user?.id;

  const [selectedReview, setSelectedReview] = useState<TailorReview | null>(null);
  const [responseText, setResponseText] = useState('');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [filter, setFilter] = useState<ReviewFilter>('all');

  const { data, isLoading, isFetching, error, refetch } =
    useGetTailorReviewsQuery(tailorId as string, {
    skip: !tailorId,
  });

  const [respondToReview, { isLoading: isResponding }] =
    useRespondToTailorReviewMutation();

  const reviews = useMemo<TailorReview[]>(() => data?.reviews ?? [], [data]);
  const summary = data?.summary ?? {
    totalReviews: 0,
    averageRating: 0,
    pendingResponses: 0,
  };

  const respondedCount = useMemo(
    () => reviews.filter((review) => Boolean(review.response)).length,
    [reviews]
  );
  const unrespondedCount = reviews.length - respondedCount;

  const filteredReviews = useMemo(() => {
    if (filter === 'responded') {
      return reviews.filter((review) => Boolean(review.response));
    }
    if (filter === 'unresponded') {
      return reviews.filter((review) => !review.response);
    }
    return reviews;
  }, [filter, reviews]);

  const handleRespond = (review: TailorReview) => {
    setSelectedReview(review);
    setResponseText('');
    setShowResponseModal(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview || !tailorId) {
      return;
    }

    if (!responseText.trim()) {
      Alert.alert('Error', 'Please enter a response');
      return;
    }

    try {
      await respondToReview({
        tailorId,
        reviewId: selectedReview.id,
        response: responseText.trim(),
      }).unwrap();

      await refetch();

      setShowResponseModal(false);
      setSelectedReview(null);
      setResponseText('');
      Alert.alert('Success', 'Response submitted successfully');
    } catch (mutationError: any) {
      const message =
        mutationError?.data?.message ||
        mutationError?.error ||
        'Failed to submit response';
      Alert.alert('Error', message);
    }
  };

  const renderStars = (rating: number) =>
    [...Array(5)].map((_, index) => (
      <Ionicons
        key={index}
        name="star"
        size={16}
        color={index < rating ? colors.warning.main : colors.border.light}
      />
    ));

  const renderReviewItem = (review: TailorReview) => (
    <Card variant="elevated" padding="xl" style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.customerInfo}>
          <View style={styles.customerAvatar}>
            {review.customerAvatar ? (
              <Image
                source={{ uri: review.customerAvatar }}
                style={styles.customerAvatarImage}
              />
            ) : (
              <Text style={styles.customerInitial}>
                {review.customerName
                  .split(' ')
                  .map((namePart) => namePart[0])
                  .join('')}
              </Text>
            )}
          </View>
          <View style={styles.customerDetails}>
            <Text style={styles.customerName}>{review.customerName}</Text>
            <Text style={styles.orderType}>
              {review.orderType || 'Custom Order'} •{' '}
              {typeof review.orderAmount === 'number'
                ? formatCurrency(review.orderAmount)
                : 'Price on request'}
            </Text>
          </View>
        </View>
        <View style={styles.reviewMeta}>
          <View style={styles.ratingContainer}>{renderStars(review.rating)}</View>
          <Text style={styles.reviewDate}>{formatDate(review.createdAt)}</Text>
        </View>
      </View>

      <Text style={styles.reviewComment}>{review.comment}</Text>

      {review.images?.length ? (
        <View style={styles.reviewImages}>
          {review.images.map((image) => (
            <TouchableOpacity key={image} style={styles.reviewImageContainer}>
              <Image source={{ uri: image }} style={styles.reviewImage} />
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {review.response ? (
        <View style={styles.responseContainer}>
          <View style={styles.responseHeader}>
            <Ionicons
              name="return-down-forward"
              size={16}
              color={colors.primary[600]}
            />
            <Text style={styles.responseLabel}>Your Response</Text>
            <Text style={styles.responseDate}>
              {formatDate(review.response.createdAt)}
            </Text>
          </View>
          <Text style={styles.responseText}>{review.response.message}</Text>
        </View>
      ) : (
        <View style={styles.reviewActions}>
          <Button
            title="Respond"
            onPress={() => handleRespond(review)}
            style={styles.respondButton}
            variant="outline"
          />
        </View>
      )}
    </Card>
  );

  const renderFilterTabs = () => (
    <View style={styles.filterContainer}>
      {FILTERS.map((filterType) => {
        const count =
          filterType === 'responded'
            ? respondedCount
            : filterType === 'unresponded'
            ? unrespondedCount
            : reviews.length;

        return (
          <TouchableOpacity
            key={filterType}
            style={[styles.filterTab, filter === filterType && styles.filterTabActive]}
            onPress={() => setFilter(filterType)}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.filterText, filter === filterType && styles.filterTextActive]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType !== 'all' ? ` (${count})` : ''}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderEmptyState = (message: string, actionLabel?: string) => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>{message}</Text>
      {actionLabel ? (
        <Button title={actionLabel} onPress={refetch} variant="outline" />
      ) : null}
    </View>
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
          <Text style={styles.headerTitle}>Reviews</Text>
          <View style={styles.headerRight}>
            {isFetching ? (
              <ActivityIndicator size="small" color={colors.primary[500]} />
            ) : null}
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.totalReviews}</Text>
            <Text style={styles.statLabel}>Total Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Number(summary.totalReviews ? summary.averageRating : 0).toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Average Rating</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{summary.pendingResponses}</Text>
            <Text style={styles.statLabel}>Need Response</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        {renderFilterTabs()}

        {/* Reviews List */}
        <View style={styles.reviewsContainer}>
          {!tailorId
            ? renderEmptyState(
                'Sign in as a tailor to manage your reviews.',
                undefined
              )
            : isLoading && !reviews.length
            ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
              )
            : error
            ? renderEmptyState('Unable to load reviews. Tap to retry.', 'Retry')
            : filteredReviews.length === 0
            ? renderEmptyState(
                filter === 'unresponded'
                  ? 'All reviews have been handled. Great job!'
                  : 'No reviews available yet. Deliver great service to earn feedback!'
              )
            : filteredReviews.map((review) => (
                <View key={review.id}>{renderReviewItem(review)}</View>
              ))}
        </View>
      </ScrollView>

      {/* Response Modal */}
      <Modal
        visible={showResponseModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowResponseModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowResponseModal(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Respond to Review</Text>
            <View style={styles.modalHeaderRight} />
          </View>

          {selectedReview ? (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Card variant="elevated" padding="lg" style={styles.selectedReviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.customerInfo}>
                    <View style={styles.customerAvatar}>
                      {selectedReview.customerAvatar ? (
                        <Image
                          source={{ uri: selectedReview.customerAvatar }}
                          style={styles.customerAvatarImage}
                        />
                      ) : (
                        <Text style={styles.customerInitial}>
                          {selectedReview.customerName
                            .split(' ')
                            .map((namePart) => namePart[0])
                            .join('')}
                        </Text>
                      )}
                    </View>
                    <View style={styles.customerDetails}>
                      <Text style={styles.customerName}>{selectedReview.customerName}</Text>
                      <Text style={styles.orderType}>
                        {selectedReview.orderType || 'Custom Order'} •{' '}
                        {typeof selectedReview.orderAmount === 'number'
                          ? formatCurrency(selectedReview.orderAmount)
                          : 'Price on request'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.ratingContainer}>
                    {renderStars(selectedReview.rating)}
                  </View>
                </View>
                <Text style={styles.reviewComment}>{selectedReview.comment}</Text>
              </Card>

              <View style={styles.responseForm}>
                <Text style={styles.responseFormTitle}>Your Response</Text>
                <TextInput
                  style={styles.responseInput}
                  value={responseText}
                  onChangeText={setResponseText}
                  placeholder="Write a thoughtful response to this review..."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                <Text style={styles.responseTip}>
                  💡 Tip: Thank them for their feedback and address any concerns professionally
                </Text>
              </View>
            </ScrollView>
          ) : null}

          <View style={styles.modalActions}>
            <Button
              title="Cancel"
              onPress={() => setShowResponseModal(false)}
              style={styles.cancelButton}
              variant="outline"
              disabled={isResponding}
            />
            <Button
              title="Submit Response"
              onPress={handleSubmitResponse}
              style={styles.submitButton}
              loading={isResponding}
              disabled={isResponding}
            />
          </View>
        </SafeAreaView>
      </Modal>
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
    minWidth: 40,
    alignItems: 'flex-end',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    marginBottom: spacing.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...textStyles.h3,
    color: colors.text.primary,
    fontWeight: '700',
  },
  statLabel: {
    ...textStyles.small,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.md,
  },

  // Filter Tabs
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabActive: {
    borderBottomColor: colors.primary[600],
  },
  filterText: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.primary[600],
  },

  // Reviews
  reviewsContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.huge,
  },
  reviewCard: {
    marginBottom: spacing.xxl,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xxl,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  customerAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  customerInitial: {
    ...textStyles.bodyMedium,
    color: colors.primary[700],
    fontWeight: '600',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    ...textStyles.bodyMedium,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xl,
  },
  orderType: {
    ...textStyles.small,
    color: colors.text.secondary,
  },
  reviewMeta: {
    alignItems: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  reviewDate: {
    ...textStyles.small,
    color: colors.text.secondary,
  },
  reviewComment: {
    ...textStyles.body,
    color: colors.text.primary,
    lineHeight: 22,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  reviewImages: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  reviewImageContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  reviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
  },
  responseContainer: {
    backgroundColor: colors.primary[50],
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  responseLabel: {
    ...textStyles.bodyMedium,
    color: colors.primary[700],
    fontWeight: '600',
    marginLeft: spacing.sm,
    flex: 1,
  },
  responseDate: {
    ...textStyles.small,
    color: colors.text.secondary,
  },
  responseText: {
    ...textStyles.body,
    color: colors.text.primary,
    lineHeight: 22,
  },
  reviewActions: {
    marginTop: spacing.xl,
  },
  respondButton: {
    width: 'auto',
    alignSelf: 'flex-start',
  },

  loaderContainer: {
    paddingVertical: spacing.xxxl,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  emptyStateTitle: {
    ...textStyles.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  modalCloseButton: {
    padding: spacing.sm,
  },
  modalTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
  },
  modalHeaderRight: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    padding: spacing.xl,
  },
  selectedReviewCard: {
    marginBottom: spacing.xxxl,
  },
  responseForm: {
    marginBottom: spacing.xxxl,
  },
  responseFormTitle: {
    ...textStyles.h4,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  responseInput: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius.md,
    padding: spacing.lg,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  responseTip: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
});