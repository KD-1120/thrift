import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch } from '../store/hooks';
import { markAllRead } from '../features/notifications/notificationsSlice';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';

// Mock notifications data
const NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'Order Update',
    message: 'Your order #1234 has been shipped!',
    time: '2h ago',
    icon: 'cube-outline',
  },
  {
    id: '2',
    type: 'promo',
    title: 'Promo',
    message: 'Get 10% off your next order. Use code: TAILOR10',
    time: '5h ago',
    icon: 'pricetag-outline',
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    message: 'Ama: Your dress is ready for pickup!',
    time: '1d ago',
    icon: 'chatbubble-ellipses-outline',
  },
];


export default function NotificationsScreen() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(markAllRead());
  }, [dispatch]);
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Ionicons name={item.icon as any} size={28} color={colors.primary[500]} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        marginTop: spacing.lg,
        marginBottom: spacing.md,
        marginHorizontal: spacing.lg,
        color: colors.text.primary,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.background.card,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    icon: {
        marginRight: spacing.md,
        marginTop: 2,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text.primary,
    },
    message: {
        fontSize: 14,
        color: colors.text.secondary,
        marginTop: 2,
    },
    time: {
        fontSize: 12,
        color: colors.text.tertiary,
        marginTop: 4,
    },
});

