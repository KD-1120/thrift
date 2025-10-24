import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../design-system/colors';
import { spacing } from '../../../design-system/spacing';
import type { MediaItem } from '../../../types';

interface MediaInfoProps {
  item: MediaItem;
}

export function MediaInfo({ item }: MediaInfoProps) {
  return (
    <View style={styles.bottomInfo}>
      <SafeAreaView edges={['bottom']} style={styles.bottomSafeArea}>
        {/* Author Section */}
        <View style={styles.authorRow}>
          <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{item.author.name}</Text>
            <Text style={styles.timestamp}>2 hours ago</Text>
          </View>
          <TouchableOpacity style={styles.followBtn} activeOpacity={0.8}>
            <Text style={styles.followBtnText}>Follow</Text>
          </TouchableOpacity>
        </View>

        {/* Caption */}
        {item.caption && (
          <Text style={styles.caption} numberOfLines={3}>
            {item.caption}
          </Text>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.slice(0, 3).map((tag) => (
              <TouchableOpacity key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, // Changed from 80 to 0 for full width
    paddingHorizontal: spacing.lg,
    paddingRight: 96, // Add padding to avoid overlap with sidebar
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bottomSafeArea: {
    gap: spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral[700],
    marginRight: spacing.sm,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 2,
  },
  timestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    lineHeight: 16,
  },
  followBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.primary[600],
  },
  followBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
  },
  caption: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 22,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    paddingHorizontal: spacing.sm + spacing.xs,
    paddingVertical: spacing.xs - 2,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tagText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
});
