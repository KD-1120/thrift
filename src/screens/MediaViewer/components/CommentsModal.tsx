import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../design-system/colors';
import { spacing } from '../../../design-system/spacing';
import { SCREEN_HEIGHT } from '../constants';

interface CommentsModalProps {
  visible: boolean;
  commentCount: number;
  commentText: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
  onSend: () => void;
  formatCount: (count: number) => string;
}

export function CommentsModal({
  visible,
  commentCount,
  commentText,
  onChangeText,
  onClose,
  onSend,
  formatCount,
}: CommentsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.commentsSheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Comments ({formatCount(commentCount)})</Text>

          {/* Comments List */}
          <View style={styles.commentsList}>
            <View style={styles.comment}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentBody}>
                <Text style={styles.commentAuthor}>Jane Doe</Text>
                <Text style={styles.commentText}>
                  This is absolutely stunning! Love the attention to detail 😍
                </Text>
                <Text style={styles.commentTime}>2h ago</Text>
              </View>
            </View>

            <View style={styles.comment}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentBody}>
                <Text style={styles.commentAuthor}>John Smith</Text>
                <Text style={styles.commentText}>Where can I order something similar?</Text>
                <Text style={styles.commentTime}>45m ago</Text>
              </View>
            </View>
          </View>

          {/* Input Area */}
          <SafeAreaView edges={['bottom']} style={styles.inputArea}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=20' }}
              style={styles.inputAvatar}
            />
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor={colors.text.tertiary}
              value={commentText}
              onChangeText={onChangeText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.postBtn, !commentText.trim() && styles.postBtnDisabled]}
              onPress={onSend}
              disabled={!commentText.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.postBtnText}>Post</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  commentsSheet: {
    backgroundColor: colors.background.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.75,
    paddingTop: spacing.md,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: colors.neutral[300],
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    lineHeight: 26,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: spacing.lg + spacing.sm,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral[300],
    marginRight: spacing.sm,
  },
  commentBody: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs - 2,
    lineHeight: 18,
  },
  commentText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  commentTime: {
    fontSize: 12,
    color: colors.text.tertiary,
    lineHeight: 16,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral[300],
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background.tertiary,
    color: colors.text.primary,
    fontSize: 15,
    lineHeight: 20,
  },
  postBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: 20,
    backgroundColor: colors.primary[600],
  },
  postBtnDisabled: {
    opacity: 0.4,
  },
  postBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
  },
});
