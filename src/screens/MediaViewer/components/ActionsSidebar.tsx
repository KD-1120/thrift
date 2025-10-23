import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { spacing } from '../../../design-system/spacing';
import type { MediaItem } from '../../../types';

interface ActionsSidebarProps {
  item: MediaItem;
  onLike: () => void;
  onComment: () => void;
  onBookmark: () => void;
  onShare: () => void;
  formatCount: (count: number) => string;
}

export function ActionsSidebar({
  item,
  onLike,
  onComment,
  onBookmark,
  onShare,
  formatCount,
}: ActionsSidebarProps) {
  return (
    <View style={styles.actions}>
      <SafeAreaView edges={['bottom']} style={styles.actionsSafeArea}>
        {/* Like */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => {
            onLike();
            if (!item.isLiked) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={item.isLiked ? 'heart' : 'heart-outline'}
            size={32}
            color={item.isLiked ? '#EF4444' : '#FFFFFF'}
          />
          <Text style={styles.actionText}>{formatCount(item.likes)}</Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity style={styles.actionBtn} onPress={onComment} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={30} color="#FFFFFF" />
          <Text style={styles.actionText}>{formatCount(item.comments)}</Text>
        </TouchableOpacity>

        {/* Bookmark */}
        <TouchableOpacity style={styles.actionBtn} onPress={onBookmark} activeOpacity={0.7}>
          <Ionicons
            name={item.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={30}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity style={styles.actionBtn} onPress={onShare} activeOpacity={0.7}>
          <Ionicons name="share-outline" size={30} color="#FFFFFF" />
          <Text style={styles.actionText}>{formatCount(item.shares)}</Text>
        </TouchableOpacity>

        {/* More */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    position: 'absolute',
    right: spacing.md,
    bottom: 0,
  },
  actionsSafeArea: {
    alignItems: 'center',
    gap: spacing.lg + spacing.sm,
    paddingBottom: spacing.xl + spacing.md,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
