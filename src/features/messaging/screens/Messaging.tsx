// Messaging Screen - Chat interface for customer-tailor communication

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { IconButton } from '../../../components/IconButton';
import { Avatar } from '../../../components/Avatar';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';
import {
  useGetConversationQuery,
  useSendMessageMutation,
  useStartConversationMutation,
  useMarkAsReadMutation,
} from '../api/messaging.api';

type RouteParams = {
  Messaging: {
    tailorId?: string;
    tailorName?: string;
    conversationId?: string;
  };
};

type NavigationProp = StackNavigationProp<any>;

export default function MessagingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RouteParams, 'Messaging'>>();
  const { tailorId, tailorName, conversationId } = route.params || {};

  const [inputHeight, setInputHeight] = useState(48); // Minimum height matches inputWrapper minHeight
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // API hooks
  const { data: conversationData, isLoading: conversationLoading, error: conversationError } = useGetConversationQuery(conversationId || '', {
    skip: !conversationId,
  });

  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [startConversation, { isLoading: creatingConversation }] = useStartConversationMutation();
  const [markAsRead] = useMarkAsReadMutation();

  // Extract messages from conversation data
  const messages = conversationData?.messages || [];

  // Mock data for development when no conversation exists
  const mockMessages = [
    {
      id: '1',
      senderId: 'tailor-1',
      senderName: tailorName || 'Tailor',
      content: 'Hello! I received your order request. When would you like to schedule the fitting appointment?',
      createdAt: '2025-10-19T10:30:00Z',
      read: true,
    },
    {
      id: '2',
      senderId: 'customer-1',
      senderName: 'You',
      content: 'Hi! I\'m available next Tuesday afternoon around 2 PM. Would that work for you?',
      createdAt: '2025-10-19T10:35:00Z',
      read: true,
    },
  ];

  const displayMessages = messages.length > 0 ? messages : mockMessages;
  const conversation = conversationData?.conversation;

  // Mark messages as read when component mounts
  useEffect(() => {
    if (conversationId && displayMessages.length > 0) {
      markAsRead(conversationId);
    }
  }, [conversationId, displayMessages.length, markAsRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (displayMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [displayMessages]);

  const handleAudioCall = () => {
    console.log('handleAudioCall called');
    // For web testing, navigate directly to in-app call
    navigation.navigate('AudioCall', {
      tailorId: tailorId || '',
      tailorName: tailorName || 'Tailor',
      callType: 'in-app',
    });
  };

  const handleVideoCall = () => {
    console.log('handleVideoCall called');
    navigation.navigate('VideoCall', {
      tailorId: tailorId || '',
      tailorName: tailorName || 'Tailor',
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      let targetConversationId = conversationId;

      // If no conversation exists, start a new one
      if (!conversationId && tailorId) {
        const result = await startConversation({
          tailorId,
          initialMessage: message.trim(),
        }).unwrap();
        targetConversationId = result.id;
      } else if (conversationId) {
        // Send message to existing conversation
        await sendMessage({
          conversationId,
          content: message.trim(),
          messageType: 'text',
        }).unwrap();
      }

      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error('Send message error:', error);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isFromTailor = item.senderId !== 'customer-1' && item.senderId !== 'current-user';

    return (
      <View style={[
        styles.messageContainer,
        isFromTailor ? styles.messageFromTailor : styles.messageFromCustomer
      ]}>
        <View style={[
          styles.messageBubble,
          isFromTailor ? styles.bubbleTailor : styles.bubbleCustomer
        ]}>
          <Text style={[
            styles.messageText,
            isFromTailor ? styles.textTailor : styles.textCustomer
          ]}>
            {item.content || item.message}
          </Text>
          <Text style={[
            styles.messageTime,
            isFromTailor ? styles.timeTailor : styles.timeCustomer
          ]}>
            {formatMessageTime(item.createdAt || item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  if (conversationLoading && !conversationData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (conversationError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={64} color={colors.text.tertiary} />
          <Text style={styles.errorTitle}>Unable to load conversation</Text>
          <Text style={styles.errorMessage}>Please check your connection and try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          color={colors.text.primary}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.headerCenter}>
          <Avatar
            uri="https://via.placeholder.com/40x40/FF6B6B/FFFFFF?text=AS"
            name={tailorName || 'Tailor'}
            size={40}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{tailorName || 'Tailor'}</Text>
            <Text style={styles.headerStatus}>
              {conversation?.unreadCount ? `${conversation.unreadCount} unread` : 'Active now'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.callButton}
            onPress={handleAudioCall}
            activeOpacity={0.7}
          >
            <Ionicons name="call-outline" size={22} color={colors.primary[600]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callButton}
            onPress={handleVideoCall}
            activeOpacity={0.7}
          >
            <Ionicons name="videocam-outline" size={22} color={colors.primary[600]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={displayMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        inverted={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          <TextInput
            style={[styles.textInput, { height: Math.max(48, inputHeight) }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.text.tertiary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            editable={!sendingMessage && !creatingConversation}
            onContentSizeChange={(event) => {
              const { height } = event.nativeEvent.contentSize;
              setInputHeight(height);
            }}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || sendingMessage || creatingConversation) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!message.trim() || sendingMessage || creatingConversation}
          >
            {sendingMessage || creatingConversation ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={message.trim() ? '#FFFFFF' : colors.text.tertiary}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginTop: spacing.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
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
  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary[600],
    borderRadius: radius.lg,
  },
  retryText: {
    ...textStyles.bodyMedium,
    color: '#FFFFFF',
    fontWeight: '600',
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
    minHeight: 72,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    ...textStyles.h4,
    color: colors.text.primary,
    lineHeight: 24,
  },
  headerStatus: {
    ...textStyles.small,
    color: colors.success.main,
    lineHeight: 16,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Messages
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  messageContainer: {
    marginBottom: spacing.lg,
    maxWidth: '80%',
  },
  messageFromTailor: {
    alignSelf: 'flex-start',
  },
  messageFromCustomer: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    maxWidth: '100%',
  },
  bubbleTailor: {
    backgroundColor: colors.background.secondary,
    borderBottomLeftRadius: radius.sm,
  },
  bubbleCustomer: {
    backgroundColor: colors.primary[600],
    borderBottomRightRadius: radius.sm,
  },
  messageText: {
    ...textStyles.body,
    lineHeight: 20,
  },
  textTailor: {
    color: colors.text.primary,
  },
  textCustomer: {
    color: '#FFFFFF',
  },
  messageTime: {
    ...textStyles.small,
    marginTop: spacing.xs,
    lineHeight: 14,
  },
  timeTailor: {
    color: colors.text.tertiary,
  },
  timeCustomer: {
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Input
  inputContainer: {
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
  },
  attachButton: {
    padding: spacing.xs,
  },
  textInput: {
    flex: 1,
    ...textStyles.body,
    color: colors.text.primary,
    maxHeight: 120, // Maximum height for the input
    paddingVertical: spacing.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.background.tertiary,
  },
});