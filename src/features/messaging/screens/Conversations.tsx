// Conversations List Screen - Shows all user conversations

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useGetConversationsQuery } from '../api/messaging.api';
import { Avatar } from '../../../components/Avatar';
import { colors } from '../../../design-system/colors';
import { spacing } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';
import { useAppSelector } from '../../../store/hooks';

type NavigationProp = StackNavigationProp<any>;

export default function ConversationsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: conversations, isLoading, error } = useGetConversationsQuery(undefined, {
    skip: !isAuthenticated, // Skip the query if not authenticated
  });

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes <= 1 ? 'now' : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderConversation = ({ item }: { item: any }) => {
    const otherParticipant = item.participants.find((p: any) => p.id !== 'current-user');
    const lastMessage = item.lastMessage;

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigation.navigate('Messaging', {
          conversationId: item.id,
          tailorId: otherParticipant?.id,
          tailorName: otherParticipant?.name,
        })}
        activeOpacity={0.7}
      >
        <View style={styles.conversationLeft}>
          <Avatar
            uri={otherParticipant?.avatar}
            name={otherParticipant?.name || 'Tailor'}
            size={56}
          />
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.participantName} numberOfLines={1}>
              {otherParticipant?.name || 'Tailor'}
            </Text>
            <Text style={styles.lastMessageTime}>
              {formatLastMessageTime(item.updatedAt)}
            </Text>
          </View>

          {lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMessage.content}
            </Text>
          )}
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.text.tertiary}
        />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubble-ellipses-outline" size={80} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptyMessage}>
        Start a conversation by messaging a tailor from their profile
      </Text>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="log-in-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.errorTitle}>Authentication Required</Text>
          <Text style={styles.errorMessage}>Please sign in to view your messages.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.errorTitle}>Unable to load conversations</Text>
          <Text style={styles.errorMessage}>Please check your connection and try again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="search" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={conversations?.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    minHeight: 64,
  },
  headerTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  headerAction: {
    padding: spacing.sm,
  },

  // List
  list: {
    paddingTop: spacing.lg,
  },
  emptyList: {
    flex: 1,
  },

  // Conversation Item
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl, // Increased from lg (20) to xl (24)
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    minHeight: 80, // Ensure minimum height for content
  },
  conversationLeft: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary[600],
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    ...textStyles.small,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm, // Increased from xs (6) to sm (10)
  },
  participantName: {
    ...textStyles.h4,
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.md,
    fontSize: 18, // Slightly larger for better readability
    lineHeight: 24,
  },
  lastMessageTime: {
    ...textStyles.small,
    color: colors.text.tertiary,
    fontSize: 13, // Slightly larger
  },
  lastMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    fontSize: 15, // Slightly larger
    lineHeight: 20,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...textStyles.body,
    color: colors.text.secondary,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  emptyTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.md,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  errorMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});