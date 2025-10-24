// Portfolio Management Screen - Build and manage tailor portfolio

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { colors } from '../../../design-system/colors';
import { SAMPLE_VIDEO_URLS } from '../../../utils/video';
import { spacing, radius } from '../../../design-system/spacing';
import { textStyles } from '../../../design-system/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = 2; // Instagram-style minimal gap
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (SCREEN_WIDTH - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

type NavigationProp = StackNavigationProp<any>;

interface PortfolioItem {
  id: string;
  type: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  title: string;
  category: string;
  subCategory?: string;
  price?: number;
  description?: string;
  features?: string[];
  timeline?: string;
  likes: number;
  comments: number;
  shares: number;
  isFeatured: boolean;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
  duration?: number; // for videos in seconds
}

export default function PortfolioManagementScreen() {
  const navigation = useNavigation<NavigationProp>();

  // State Management
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: '1',
      type: 'image',
      mediaUrl: 'https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Wedding+Dress',
      thumbnailUrl: 'https://via.placeholder.com/300x400/4ECDC4/FFFFFF?text=Wedding+Dress',
      title: 'Wedding Dress',
      category: 'Wedding',
      subCategory: 'Formal',
      price: 1200,
      description: 'Elegant white wedding gown with lace details',
      features: ['Custom measurements', 'Premium fabric', 'Hand-stitched details'],
      timeline: '3-4 weeks',
      likes: 234,
      comments: 12,
      shares: 5,
      isFeatured: true,
      isPublished: true,
      tags: ['wedding', 'formal', 'gown'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'image',
      mediaUrl: 'https://via.placeholder.com/300x400/45B7D1/FFFFFF?text=Kente+Suit',
      thumbnailUrl: 'https://via.placeholder.com/300x400/45B7D1/FFFFFF?text=Kente+Suit',
      title: 'Kente Suit',
      category: 'Traditional',
      subCategory: 'Traditional',
      price: 800,
      description: 'Traditional Ghanaian kente cloth suit',
      features: ['Authentic kente', 'Perfect fit', 'Traditional craftsmanship'],
      timeline: '2-3 weeks',
      likes: 892,
      comments: 45,
      shares: 23,
      isFeatured: true,
      isPublished: true,
      tags: ['kente', 'traditional', 'suit'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'video',
      mediaUrl: SAMPLE_VIDEO_URLS.forBiggerJoyrides,
      thumbnailUrl: 'https://via.placeholder.com/300x400/96CEB4/FFFFFF?text=Corporate+Blazer',
      title: 'Corporate Blazer',
      category: 'Corporate',
      subCategory: 'Formal',
      price: 450,
      description: 'Professional business attire',
      features: ['Professional look', 'Quality fabric', 'Modern cut'],
      timeline: '1-2 weeks',
      likes: 445,
      comments: 18,
      shares: 8,
      isFeatured: false,
      isPublished: true,
      tags: ['corporate', 'blazer', 'formal'],
      createdAt: new Date().toISOString(),
      duration: 30,
    },
    {
      id: '4',
      type: 'image',
      mediaUrl: 'https://via.placeholder.com/300x400/FECA57/FFFFFF?text=Evening+Gown',
      thumbnailUrl: 'https://via.placeholder.com/300x400/FECA57/FFFFFF?text=Evening+Gown',
      title: 'Evening Gown',
      category: 'Evening Wear',
      subCategory: 'Formal',
      price: 650,
      description: 'Stunning evening dress for special occasions',
      features: ['Elegant design', 'Premium materials', 'Perfect for events'],
      timeline: '2 weeks',
      likes: 567,
      comments: 24,
      shares: 10,
      isFeatured: false,
      isPublished: false, // Draft
      tags: ['evening', 'gown', 'formal'],
      createdAt: new Date().toISOString(),
    },
  ]);

  const categories = [
    'All',
    'Wedding',
    'Traditional',
    'Corporate',
    'Evening Wear',
    'Casual',
    'Academic',
  ];

  const [activeCategory, setActiveCategory] = useState('All');
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Editor form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Wedding',
    price: '',
    description: '',
    features: '',
    timeline: '',
    tags: '',
    mediaUri: '',
    mediaType: 'image' as 'image' | 'video',
  });

  const getFilteredItems = () => {
    let filtered = portfolioItems;
    
    // Filter by category only
    if (activeCategory !== 'All') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    return filtered;
  };

  // Image Picker Flow
  const requestPermissions = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos to upload portfolio items.');
        return false;
      }
      return true;
    } catch (error) {
      Alert.alert('Error', `Failed to request permissions: ${error}`);
      return false;
    }
  };

  const pickMedia = async () => {
    try {
      // Test if function is being called
      Alert.alert('Debug', 'pickMedia function called');
      
      const hasPermission = await requestPermissions();
      
      if (!hasPermission) return;

      Alert.alert(
        'Add Portfolio Item',
        'Choose media type',
        [
          {
            text: 'Photo',
            onPress: () => pickImage(),
          },
          {
            text: 'Video',
            onPress: () => pickVideo(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', `Failed to open media picker: ${error}`);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 0.8,
        allowsEditing: true,
        aspect: [3, 4],
      });

      if (!result.canceled && result.assets[0]) {
        openEditor(result.assets[0].uri, 'image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        openEditor(result.assets[0].uri, 'video');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick video. Please try again.');
    }
  };

  const openEditor = (mediaUri: string, mediaType: 'image' | 'video', item?: PortfolioItem) => {
    if (item) {
      // Editing existing item
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        price: item.price?.toString() || '',
        description: item.description || '',
        features: item.features?.join(', ') || '',
        timeline: item.timeline || '',
        tags: item.tags?.join(', ') || '',
        mediaUri: item.mediaUrl,
        mediaType: item.type,
      });
    } else {
      // Adding new item
      setEditingItem(null);
      setFormData({
        title: '',
        category: 'Wedding',
        price: '',
        description: '',
        features: '',
        timeline: '',
        tags: '',
        mediaUri,
        mediaType,
      });
    }
    setShowEditorModal(true);
  };

  const closeEditor = () => {
    setShowEditorModal(false);
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'Wedding',
      price: '',
      description: '',
      features: '',
      timeline: '',
      tags: '',
      mediaUri: '',
      mediaType: 'image',
    });
  };

  const savePortfolioItem = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title for your portfolio item.');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Validation Error', 'Please enter a description.');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newItem: PortfolioItem = {
        id: editingItem?.id || Date.now().toString(),
        type: formData.mediaType,
        mediaUrl: formData.mediaUri,
        thumbnailUrl: formData.mediaUri,
        title: formData.title,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : undefined,
        description: formData.description,
        features: formData.features ? formData.features.split(',').map(f => f.trim()) : [],
        timeline: formData.timeline || undefined,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        likes: editingItem?.likes || 0,
        comments: editingItem?.comments || 0,
        shares: editingItem?.shares || 0,
        isFeatured: editingItem?.isFeatured || false,
        isPublished: editingItem?.isPublished || false,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
      };

      if (editingItem) {
        // Update existing
        setPortfolioItems(items =>
          items.map(item => item.id === editingItem.id ? newItem : item)
        );
        Alert.alert('Success', 'Portfolio item updated successfully!');
      } else {
        // Add new
        setPortfolioItems(items => [newItem, ...items]);
        Alert.alert('Success', 'Portfolio item added successfully!', [
          {
            text: 'Publish Now',
            onPress: () => {
              setPortfolioItems(items =>
                items.map(item => item.id === newItem.id ? { ...item, isPublished: true } : item)
              );
            },
          },
          {
            text: 'Keep as Draft',
            style: 'cancel',
          },
        ]);
      }

      closeEditor();
    } catch (error) {
      Alert.alert('Error', 'Failed to save portfolio item. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const togglePublish = (item: PortfolioItem) => {
    setPortfolioItems(items =>
      items.map(i =>
        i.id === item.id ? { ...i, isPublished: !i.isPublished } : i
      )
    );
    const message = item.isPublished 
      ? `"${item.title}" is now hidden from customers` 
      : `"${item.title}" is now live on your profile`;
    Alert.alert(
      item.isPublished ? 'Unpublished' : 'Published ✓',
      message
    );
  };

  const toggleFeatured = (item: PortfolioItem) => {
    setPortfolioItems(items =>
      items.map(i =>
        i.id === item.id ? { ...i, isFeatured: !i.isFeatured } : i
      )
    );
    const message = item.isFeatured
      ? `"${item.title}" removed from featured`
      : `"${item.title}" will appear at the top of your gallery`;
    Alert.alert(
      item.isFeatured ? 'Removed from Featured' : 'Featured ⭐',
      message
    );
  };

  const deletePortfolioItem = (item: PortfolioItem) => {
    Alert.alert(
      'Delete Item?',
      `"${item.title}" will be permanently deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPortfolioItems(items => items.filter(i => i.id !== item.id));
            Alert.alert('Deleted', 'Portfolio item removed successfully.');
          },
        },
      ]
    );
  };

  const handleItemLongPress = (item: PortfolioItem) => {
    // Instagram-style action sheet with contextual actions
    const actions: { text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }[] = [
      {
        text: item.isFeatured ? '⭐ Unmark as Featured' : '⭐ Mark as Featured',
        onPress: () => toggleFeatured(item),
      },
      {
        text: item.isPublished ? '👁 Hide from Customers' : '👁 Publish to Gallery',
        onPress: () => togglePublish(item),
      },
      {
        text: '✏️ Edit Details',
        onPress: () => openEditor(item.mediaUrl, item.type, item),
      },
      {
        text: '🔗 Share Link',
        onPress: () => {
          Alert.alert('Share', `Share link for "${item.title}"\n\nThis would open the share sheet.`);
        },
      },
      {
        text: '📊 View Stats',
        onPress: () => {
          Alert.alert(
            'Statistics',
            `${item.title}\n\n` +
            `👍 ${item.likes} likes\n` +
            `💬 ${item.comments} comments\n` +
            `📤 ${item.shares} shares\n` +
            `${item.isPublished ? '✅ Published' : '📝 Draft'}\n` +
            `${item.isFeatured ? '⭐ Featured' : ''}`
          );
        },
      },
      {
        text: '🗑️ Delete',
        onPress: () => deletePortfolioItem(item),
        style: 'destructive',
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ];

    Alert.alert(item.title, 'Choose an action', actions);
  };

  const handleItemTap = (item: PortfolioItem) => {
    // Quick preview of the item
    Alert.alert(
      item.title,
      `${item.description}\n\n` +
      `Category: ${item.category}\n` +
      `Price: ${item.price ? `GH₵${item.price}` : 'Not set'}\n` +
      `Timeline: ${item.timeline || 'Not set'}\n` +
      `Status: ${item.isPublished ? 'Published ✅' : 'Draft 📝'}\n` +
      `${item.isFeatured ? 'Featured ⭐' : ''}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Edit', onPress: () => openEditor(item.mediaUrl, item.type, item) },
      ]
    );
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const renderPortfolioItem = (item: PortfolioItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.portfolioItem}
      activeOpacity={0.95}
      onPress={() => handleItemTap(item)}
      onLongPress={() => handleItemLongPress(item)}
    >
      <Image source={{ uri: item.thumbnailUrl || item.mediaUrl }} style={styles.portfolioImage} />
      
      {/* Video indicator (top-right, Instagram style) */}
      {item.type === 'video' && (
        <View style={styles.videoIndicator}>
          <Ionicons name="play" size={16} color="#FFFFFF" />
        </View>
      )}
      
      {/* Featured star (top-left corner) */}
      {item.isFeatured && (
        <View style={styles.featuredIndicator}>
          <Ionicons name="star" size={14} color="#FFD700" />
        </View>
      )}
      
      {/* Draft indicator (subtle overlay) */}
      {!item.isPublished && (
        <View style={styles.draftOverlay}>
          <View style={styles.draftLabel}>
            <Text style={styles.draftLabelText}>DRAFT</Text>
          </View>
        </View>
      )}
      
      {/* Stats overlay (Instagram style - bottom) */}
      {item.isPublished && (
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={14} color="#FFFFFF" />
            <Text style={styles.statCount}>{formatCount(item.likes)}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={14} color="#FFFFFF" />
            <Text style={styles.statCount}>{formatCount(item.comments)}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const filteredItems = getFilteredItems();
  const publishedCount = portfolioItems.filter(i => i.isPublished).length;
  const totalLikes = portfolioItems.reduce((sum, item) => sum + item.likes, 0);
  const totalValue = portfolioItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header - Instagram style */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Portfolio</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={pickMedia}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle-outline" size={28} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Stats Bar - Compact Instagram style */}
        <View style={styles.statsBar2}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{portfolioItems.length}</Text>
            <Text style={styles.statKey}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{publishedCount}</Text>
            <Text style={styles.statKey}>Published</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{formatCount(totalLikes)}</Text>
            <Text style={styles.statKey}>Likes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>GH₵{totalValue}</Text>
            <Text style={styles.statKey}>Value</Text>
          </View>
        </View>

        {/* Category Pills - Horizontal scroll */}
        {portfolioItems.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesPills}
            contentContainerStyle={styles.categoriesPillsContent}
          >
            {categories.map((category) => {
              const itemCount = category === 'All' 
                ? filteredItems.length 
                : filteredItems.filter(item => item.category === category).length;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.pill,
                    activeCategory === category && styles.pillActive,
                  ]}
                  onPress={() => setActiveCategory(category)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      activeCategory === category && styles.pillTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                  {itemCount > 0 && (
                    <View style={[
                      styles.pillBadge,
                      activeCategory === category && styles.pillBadgeActive,
                    ]}>
                      <Text style={[
                        styles.pillBadgeText,
                        activeCategory === category && styles.pillBadgeTextActive,
                      ]}>
                        {itemCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Portfolio Grid - Instagram 3-column grid */}
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={80} color={colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No items yet</Text>
            <Text style={styles.emptyMessage}>
              Tap the + button to add your first portfolio item and showcase your work to customers.
            </Text>
            <Button
              title="Add First Item"
              onPress={pickMedia}
              style={styles.emptyButton}
            />
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {filteredItems.map(renderPortfolioItem)}
          </View>
        )}

        {/* Tips - Collapsible card */}
        {portfolioItems.length > 0 && (
          <Card variant="elevated" padding="lg" style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={20} color={colors.primary[600]} />
              <Text style={styles.tipsTitle}>Pro Tips</Text>
            </View>
            <View style={styles.tipsList}>
              <Text style={styles.tipText}>• Tap any item to preview details</Text>
              <Text style={styles.tipText}>• Long press for quick actions (publish, feature, edit, delete)</Text>
              <Text style={styles.tipText}>• Star your best work to feature it at the top</Text>
              <Text style={styles.tipText}>• Draft items are private until you publish them</Text>
              <Text style={styles.tipText}>• High-quality images get more engagement</Text>
            </View>
          </Card>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Editor Modal */}
      <Modal
        visible={showEditorModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeEditor}
      >
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeEditor} activeOpacity={0.7}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Item' : 'New Item'}
              </Text>
              <TouchableOpacity
                onPress={savePortfolioItem}
                disabled={isUploading}
                activeOpacity={0.7}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color={colors.primary[600]} />
                ) : (
                  <Text style={styles.modalSave}>Save</Text>
                )}
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {/* Media Preview */}
              <View style={styles.mediaPreview}>
                <Image
                  source={{ uri: formData.mediaUri }}
                  style={styles.mediaPreviewImage}
                  resizeMode="cover"
                />
                {formData.mediaType === 'video' && (
                  <View style={styles.videoPreviewBadge}>
                    <Ionicons name="play-circle" size={48} color="#FFFFFF" />
                  </View>
                )}
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Title *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="e.g., Wedding Dress"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Category *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categorySelector}>
                    {categories.filter(c => c !== 'All').map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categorySelectorChip,
                          formData.category === cat && styles.categorySelectorChipActive,
                        ]}
                        onPress={() => setFormData({ ...formData, category: cat })}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.categorySelectorText,
                            formData.category === cat && styles.categorySelectorTextActive,
                          ]}
                        >
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Price (GH₵)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.price}
                  onChangeText={(text) => setFormData({ ...formData, price: text })}
                  placeholder="e.g., 1200"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Description *</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextArea]}
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Describe your work in detail..."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Features (comma separated)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.features}
                  onChangeText={(text) => setFormData({ ...formData, features: text })}
                  placeholder="e.g., Custom measurements, Premium fabric"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Timeline</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.timeline}
                  onChangeText={(text) => setFormData({ ...formData, timeline: text })}
                  placeholder="e.g., 2-3 weeks"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Tags (comma separated)</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.tags}
                  onChangeText={(text) => setFormData({ ...formData, tags: text })}
                  placeholder="e.g., wedding, formal, elegant"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>

              <View style={styles.bottomSpacer} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  // Header - Instagram style
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.light,
    height: 56,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  addButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  // Stats Bar - Instagram profile style
  statsBar2: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.light,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  statKey: {
    fontSize: 12,
    color: colors.text.secondary,
  },

  // Segmented Control - Instagram style
  segmentedControl: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    gap: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  segmentActive: {
    borderBottomColor: colors.text.primary,
  },
  segmentCount: {
    fontSize: 12,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  segmentCountActive: {
    color: colors.text.primary,
  },

  // Category Pills
  categoriesPills: {
    backgroundColor: colors.background.primary,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.light,
  },
  categoriesPillsContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    gap: spacing.sm,
  },
  pillActive: {
    backgroundColor: colors.text.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.primary,
  },
  pillTextActive: {
    color: colors.background.primary,
  },
  pillBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  pillBadgeActive: {
    backgroundColor: colors.background.secondary,
  },
  pillBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text.primary,
  },
  pillBadgeTextActive: {
    color: colors.text.primary,
  },

  // Grid Container - Instagram 3-column
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  portfolioItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    marginRight: GAP,
    marginBottom: GAP,
    backgroundColor: colors.neutral[200],
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },

  // Video Indicator - top-right corner
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Featured Indicator - top-left corner
  featuredIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Draft Overlay
  draftOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  draftLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Stats Bar - Instagram style overlay at bottom
  statsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  emptyButton: {
    minWidth: 140,
  },

  // Tips Card
  tipsCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text.primary,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 20,
  },

  bottomSpacer: {
    height: spacing.xl,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.light,
  },
  modalCancel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary[600],
  },
  modalScroll: {
    flex: 1,
  },
  mediaPreview: {
    width: '100%',
    height: 300,
    backgroundColor: colors.neutral[200],
    position: 'relative',
  },
  mediaPreviewImage: {
    width: '100%',
    height: '100%',
  },
  videoPreviewBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  formSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.border.main,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  formTextArea: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  categorySelector: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categorySelectorChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  categorySelectorChipActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  categorySelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  categorySelectorTextActive: {
    color: '#FFFFFF',
  },

  // Unused old styles - will be removed
  statsContainer: { display: 'none' },
  statCard: { display: 'none' },
  statNumber: { display: 'none' },
  statLabel: { display: 'none' },
  tabsContainer: { display: 'none' },
  tab: { display: 'none' },
  tabActive: { display: 'none' },
  tabText: { display: 'none' },
  tabTextActive: { display: 'none' },
  categoriesScroll: { display: 'none' },
  categoriesContent: { display: 'none' },
  categoryChip: { display: 'none' },
  categoryChipActive: { display: 'none' },
  categoryText: { display: 'none' },
  categoryTextActive: { display: 'none' },
  section: { display: 'none' },
  sectionHeader: { display: 'none' },
  sectionTitle: { display: 'none' },
  sectionSubtitle: { display: 'none' },
  itemCount: { display: 'none' },
  categoriesGrid: { display: 'none' },
  categoryCard: { display: 'none' },
  categoryName: { display: 'none' },
  categoryCount: { display: 'none' },
  portfolioGrid: { display: 'none' },
  videoOverlay: { display: 'none' },
  durationBadge: { display: 'none' },
  durationText: { display: 'none' },
  featuredBadge: { display: 'none' },
  draftBadge: { display: 'none' },
  draftText: { display: 'none' },
  portfolioOverlay: { display: 'none' },
  actionButton: { display: 'none' },
  editButton: { display: 'none' },
  deleteButton: { display: 'none' },
  statsOverlay: { display: 'none' },
  stat: { display: 'none' },
  statText: { display: 'none' },
  portfolioInfo: { display: 'none' },
  portfolioTitle: { display: 'none' },
  portfolioCategory: { display: 'none' },
  portfolioPrice: { display: 'none' },
  addItemCard: { display: 'none' },
  addItemText: { display: 'none' },
  tipItem: { display: 'none' },
});