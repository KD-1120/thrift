// Complete Settings Screen with Profile Management

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../store/navigation';
import { useAppSelector } from '../store/hooks';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';

const MAX_CONTENT_WIDTH = 600;

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useAppSelector((state) => state.auth.user);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Navigation handlers
  const handleEditProfile = () => {
    // TODO: Navigate to profile edit screen
  };
  const handleSavedMeasurements = () => {
    navigation.navigate('SavedMeasurements');
  };
  const handleAddresses = () => {
    navigation.navigate('Addresses');
  };
  const handlePaymentMethods = () => {
    navigation.navigate('PaymentMethods');
  };
  const handleLanguage = () => {
    navigation.navigate('Language');
  };
  const handleCurrency = () => {
    navigation.navigate('Currency');
  };
  const handleHelpFAQ = () => {
    navigation.navigate('HelpFAQ');
  };
  const handleTerms = () => {
    navigation.navigate('Terms');
  };
  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicy');
  };
  const handleLogout = () => {
    // TODO: Implement logout logic
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          {/* Profile Section */}
          <Card variant='elevated'>
            <View style={styles.profileSection}>
              <Avatar name={user?.name || 'User'} size={72} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
                <Text style={styles.profilePhone}>{user?.phone || '+233 XX XXX XXXX'}</Text>
              </View>
            </View>
            <Button title='Edit Profile' variant='outline' onPress={handleEditProfile} fullWidth />
          </Card>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACCOUNT</Text>
            <Card variant='outlined'>
              <TouchableOpacity style={styles.menuItem} onPress={handleSavedMeasurements} activeOpacity={0.7}>
                <Text style={styles.menuIcon}>📏</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Saved Measurements</Text>
                  <Text style={styles.menuDescription}>Manage your body measurements</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleAddresses} activeOpacity={0.7}>
                <Text style={styles.menuIcon}>📍</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Addresses</Text>
                  <Text style={styles.menuDescription}>Manage delivery addresses</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={handlePaymentMethods} activeOpacity={0.7}>
                <Text style={styles.menuIcon}>💳</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Payment Methods</Text>
                  <Text style={styles.menuDescription}>Manage payment options</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
            <Card variant='outlined'>
              <View style={styles.menuItem}>
                <Text style={styles.menuIcon}>🔔</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Push Notifications</Text>
                  <Text style={styles.menuDescription}>Receive order updates</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: colors.neutral[300], true: colors.primary[300] }}
                  thumbColor={notificationsEnabled ? colors.primary[500] : colors.neutral[100]}
                />
              </View>
            </Card>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PREFERENCES</Text>
            <Card variant='outlined'>
              <TouchableOpacity style={styles.menuItem} onPress={handleLanguage} activeOpacity={0.7}>
                <Text style={styles.menuIcon}>🌐</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Language</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleCurrency} activeOpacity={0.7}>
                <Text style={styles.menuIcon}>💱</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Currency</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </Card>
          </View>

          {/* Support & Legal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SUPPORT</Text>
            <Card variant='outlined'>
              <TouchableOpacity style={styles.menuItem} onPress={handleHelpFAQ} activeOpacity={0.7}>
                <Text style={styles.menuIcon}>❓</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Help & FAQ</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={handleTerms} activeOpacity={0.7}>
                <Text style={styles.menuIcon}>📄</Text>
                <View style={styles.menuContent}>
                  <Text style={styles.menuLabel}>Terms & Conditions</Text>
                </View>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyPolicy} activeOpacity={0.7}>
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
            <Card variant='outlined'>
              <View style={styles.aboutSection}>
                <Text style={styles.appName}>THRIFTACCRA</Text>
                <Text style={styles.version}>Version 1.0.0</Text>
                <Text style={styles.copyright}>© 2024 ThriftAccra. All rights reserved.</Text>
              </View>
            </Card>
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <Button title='Logout' variant='outline' onPress={handleLogout} fullWidth />
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
