import { useState, useCallback } from 'react';
import { Share } from 'react-native';
import type { MediaItem } from '../../../types';

export function useMediaInteractions(
  localMediaItems: MediaItem[],
  setLocalMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>,
  currentIndex: number
) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleLike = useCallback(() => {
    setLocalMediaItems((prev: MediaItem[]) => {
      const updated = [...prev];
      const item = updated[currentIndex];
      updated[currentIndex] = {
        ...item,
        isLiked: !item.isLiked,
        likes: item.isLiked ? item.likes - 1 : item.likes + 1,
      };
      return updated;
    });
  }, [currentIndex, setLocalMediaItems]);

  const handleBookmark = useCallback(() => {
    setLocalMediaItems((prev: MediaItem[]) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        isBookmarked: !updated[currentIndex].isBookmarked,
      };
      return updated;
    });
  }, [currentIndex, setLocalMediaItems]);

  const handleComment = useCallback(() => {
    setShowComments(true);
  }, []);

  const handleSendComment = useCallback(() => {
    if (commentText.trim()) {
      setCommentText('');
      setShowComments(false);
      setLocalMediaItems((prev: MediaItem[]) => {
        const updated = [...prev];
        updated[currentIndex] = {
          ...updated[currentIndex],
          comments: updated[currentIndex].comments + 1,
        };
        return updated;
      });
    }
  }, [commentText, currentIndex, setLocalMediaItems]);

    // TikTok-style: share video link with title/description using built-in Share
    const handleShare = useCallback(async () => {
      const item = localMediaItems[currentIndex];
      if (!item) return;
      try {
        await Share.share({
          message: `${item.caption ? item.caption + '\n' : ''}${item.url}`.trim(),
        });
      } catch (error) {
        // Optionally handle error
      }
    }, [localMediaItems, currentIndex]);

  const formatCount = useCallback((count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  }, []);

  return {
    showComments,
    setShowComments,
    commentText,
    setCommentText,
    handleLike,
    handleBookmark,
    handleComment,
    handleSendComment,
    handleShare,
    formatCount,
  };
}
