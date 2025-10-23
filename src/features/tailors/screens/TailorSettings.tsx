// Tailor Settings Screen - Business-focused settings for tailors

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { MainStackParamList } from '../../../store/navigation';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { logout } from '../../../features/auth/authSlice';
import { colors } from '../../../design-system/colors';
import { spacing, radius } from '../../../design-system/spacing';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Avatar } from '../../../components/Avatar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_CONTENT_WIDTH = 600;

export default function TailorSettingsScreen() {
  const navigation = useNavigation<StackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate('TailorProfileManagement');
  };

  const handleBusinessSettings = () => {
    Alert.alert('Coming Soon', 'Business settings will be available soon');
  };

  const handlePricingSettings = () => {
    Alert.alert('Coming Soon', 'Pricing management coming soon');
  };

  const handleAvailabilitySettings = () => {
    Alert.alert('Coming Soon', 'Availability settings coming soon');
  };

  const handlePortfolioSettings = () => {
    navigation.navigate('PortfolioManagement');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Profile Section */}
          <Card variant="elevated">
            <View style={styles.profileSection}>
              <Avatar name={user?.name || 'Tailor'} size={72} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'Tailor Name'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
                <Text style={styles.profilePhone}>{user?.phone || '+233 XX XXX XXXX'}</Text>
                <View style={styles.availabilityContainer}>
                  <View style={[styles.availabilityDot, { backgroundColor: isAvailable ? colors.success.main : colors.error.main }]} />
                  <Text style={styles.availabilityText}>
                    {isAvailable ? 'Available for orders' : 'Currently unavailable'}
                  </Text>
                </View>
              </View>
            </View>
            <Button
              title="Edit Business Profile"
              variant="outline"
              onPress={handleEditProfile}
              fullWidth
            />
          </Card>

          {/* Business Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BUSINESS</Text>
            <Card variant="outlined">
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleBusinessSettings}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>🏢</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Business Information</Text>
                  <Text style={styles.menuDescription}>
                    Update your business details and location
                  </Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handlePricingSettings}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>💰</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Pricing & Services</Text>
                  <Text style={styles.menuDescription}>
                    Manage your service prices and offerings
                  </Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleAvailabilitySettings}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>📅</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Working Hours</Text>
                  <Text style={styles.menuDescription}>
                    Set your availability and working schedule
                  </Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handlePortfolioSettings}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>📸</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Portfolio Management</Text>
                  <Text style={styles.menuDescription}>
                    Manage your work samples and photos
                  </Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* Availability Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AVAILABILITY</Text>
            <Card variant="outlined">
              <View style={styles.menuItem}>
                <Text style={styles.menuIcon}>🟢</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Accept New Orders</Text>
                  <Text style={styles.menuDescription}>
                    Turn off to temporarily stop receiving orders
                  </Text>
                </View>
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  trackColor={{ false: colors.neutral[300], true: colors.success.light }}
                  thumbColor={isAvailable ? colors.success.main : colors.neutral[100]}
                />
              </View>
            </Card>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
            <Card variant="outlined">
              <View style={styles.menuItem}>
                <Text style={styles.menuIcon}>🔔</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Push Notifications</Text>
                  <Text style={styles.menuDescription}>
                    Receive notifications on your device
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                  thumbColor={notificationsEnabled ? colors.primary[500] : colors.neutral[100]}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.menuItem}>
                <Text style={styles.menuIcon}>📦</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>New Orders</Text>
                  <Text style={styles.menuDescription}>
                    Get notified when you receive new orders
                  </Text>
                </View>
                <Switch
                  value={orderNotifications}
                  onValueChange={setOrderNotifications}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                  thumbColor={orderNotifications ? colors.primary[500] : colors.neutral[100]}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.menuItem}>
                <Text style={styles.menuIcon}>💬</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Messages</Text>
                  <Text style={styles.menuDescription}>
                    Receive notifications for new messages
                  </Text>
                </View>
                <Switch
                  value={messageNotifications}
                  onValueChange={setMessageNotifications}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                  thumbColor={messageNotifications ? colors.primary[500] : colors.neutral[100]}
                />
              </View>
            </Card>
          </View>

          {/* Analytics & Insights */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ANALYTICS</Text>
            <Card variant="outlined">
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('TailorAnalytics')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>📊</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Performance Analytics</Text>
                  <Text style={styles.menuDescription}>
                    View your business performance and insights
                  </Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('ReviewManagement')}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>⭐</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Customer Reviews</Text>
                  <Text style={styles.menuDescription}>
                    Manage and respond to customer feedback
                  </Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* Support & Legal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUPPORT</Text>
            <Card variant="outlined">
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>❓</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Help & FAQ</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>📄</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Terms & Conditions</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>🔒</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Privacy Policy</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Card variant="outlined">
              <View style={styles.aboutSection}>
                <Text style={styles.appName}>THRIFTACCRA</Text>
                <Text style={styles.version}>Version 1.0.0</Text>
                <Text style={styles.copyright}>© 2024 ThriftAccra. All rights reserved.</Text>
              </View>
            </Card>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <Button
              title="Logout"
              variant="outline"
              onPress={handleLogout}
              fullWidth
            />
          </View>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + spacing.xs,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 30,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.lg,
  },
  innerContainer: {
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
  },

  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg + spacing.sm,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    lineHeight: 26,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs - 2,
    lineHeight: 18,
  },
  profilePhone: {
    fontSize: 13,
    color: colors.text.tertiary,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },

  // Sections
  section: {
    marginTop: spacing.xl + spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    lineHeight: 16,
  },

  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md + spacing.xs,
  },
  menuIcon: {
    fontSize: 22,
    width: 32,
  },
  menuContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs - 2,
    lineHeight: 20,
  },
  menuDescription: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  menuArrow: {
    fontSize: 28,
    color: colors.text.tertiary,
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginLeft: 32 + spacing.md,
  },

  // About Section
  aboutSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary[700],
    letterSpacing: 2,
    marginBottom: spacing.xs,
    lineHeight: 24,
  },
  version: {
    fontSize: 13,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  copyright: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Logout Section
  logoutSection: {
    marginTop: spacing.xl + spacing.md,
    marginBottom: spacing.xxl,
  },
});