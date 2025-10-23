// Payment Methods Screen - Complete Implementation

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../store/navigation';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { IconButton } from '../components/IconButton';

const MAX_CONTENT_WIDTH = 600;

// Mock data - in real app, this would come from API/store
const mockPaymentMethods = [
  {
    id: '1',
    type: 'momo',
    provider: 'MTN Mobile Money',
    accountName: 'John Doe',
    phoneNumber: '+233 24 123 4567',
    isDefault: true,
  },
  {
    id: '2',
    type: 'card',
    provider: 'Visa',
    lastFour: '4242',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: false,
  },
];

export default function PaymentMethodsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);

  const handleAddPaymentMethod = () => {
    // TODO: Navigate to add payment method screen
    Alert.alert('Add Payment Method', 'Payment method form would open here');
  };

  const handleEditPaymentMethod = (method: typeof mockPaymentMethods[0]) => {
    // TODO: Navigate to edit payment method screen
    Alert.alert('Edit Payment Method', `Edit ${method.provider}`);
  };

  const handleDeletePaymentMethod = (method: typeof mockPaymentMethods[0]) => {
    Alert.alert(
      'Delete Payment Method',
      `Are you sure you want to delete this ${method.provider} payment method?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(m => m.id !== method.id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  const getPaymentMethodIcon = (type: string, provider: string) => {
    if (type === 'momo') {
      switch (provider.toLowerCase()) {
        case 'mtn mobile money':
          return '📱';
        case 'vodafone cash':
          return '📞';
        case 'airtel money':
          return '💰';
        default:
          return '📱';
      }
    } else if (type === 'card') {
      switch (provider.toLowerCase()) {
        case 'visa':
          return '💳';
        case 'mastercard':
          return '💳';
        case 'american express':
          return '💳';
        default:
          return '💳';
      }
    }
    return '💳';
  };

  const formatCardNumber = (lastFour: string) => {
    return `•••• •••• •••• ${lastFour}`;
  };

  const formatExpiry = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          size={24}
          color={colors.text.primary}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Add New Payment Method Button */}
          <Card variant="elevated" style={styles.addCard}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddPaymentMethod} activeOpacity={0.8}>
              <View style={styles.addIcon}>
                <Text style={styles.addIconText}>+</Text>
              </View>
              <View style={styles.addContent}>
                <Text style={styles.addTitle}>Add Payment Method</Text>
                <Text style={styles.addDescription}>Add Mobile Money or card for payments</Text>
              </View>
            </TouchableOpacity>
          </Card>

          {/* Payment Methods List */}
          {paymentMethods.length > 0 ? (
            <View style={styles.methodsList}>
              <Text style={styles.sectionTitle}>Your Payment Methods</Text>

              {paymentMethods.map((method) => (
                <Card key={method.id} variant="outlined" style={styles.methodCard}>
                  <View style={styles.methodHeader}>
                    <View style={styles.methodType}>
                      <Text style={styles.methodIcon}>{getPaymentMethodIcon(method.type, method.provider)}</Text>
                      <View style={styles.methodInfo}>
                        <Text style={styles.methodProvider}>{method.provider}</Text>
                        {method.type === 'momo' ? (
                          <Text style={styles.methodDetail}>{method.phoneNumber}</Text>
                        ) : method.type === 'card' && method.lastFour && method.expiryMonth && method.expiryYear ? (
                          <Text style={styles.methodDetail}>
                            {formatCardNumber(method.lastFour)} • Expires {formatExpiry(method.expiryMonth, method.expiryYear)}
                          </Text>
                        ) : (
                          <Text style={styles.methodDetail}>Card details unavailable</Text>
                        )}
                      </View>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.methodActions}>
                      <IconButton
                        icon="edit"
                        library="material"
                        size={20}
                        onPress={() => handleEditPaymentMethod(method)}
                        style={styles.actionButton}
                      />
                      <IconButton
                        icon="delete"
                        library="material"
                        size={20}
                        onPress={() => handleDeletePaymentMethod(method)}
                        style={styles.actionButton}
                      />
                    </View>
                  </View>

                  {method.type === 'momo' && (
                    <View style={styles.methodDetails}>
                      <Text style={styles.accountName}>Account Name: {method.accountName}</Text>
                    </View>
                  )}

                  {!method.isDefault && (
                    <View style={styles.methodFooter}>
                      <TouchableOpacity
                        style={styles.setDefaultButton}
                        onPress={() => handleSetDefault(method.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.setDefaultText}>Set as Default</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Text style={styles.emptyTitle}>No Payment Methods</Text>
              <Text style={styles.emptyDescription}>
                Add a payment method to start placing orders
              </Text>
              <Button
                title="Add Payment Method"
                onPress={handleAddPaymentMethod}
                style={styles.emptyButton}
              />
            </View>
          )}

          {/* Security Info */}
          <Card variant="outlined" style={styles.securityCard}>
            <Text style={styles.securityTitle}>🔒 Security & Privacy</Text>
            <View style={styles.securityList}>
              <Text style={styles.securityItem}>• Your payment information is encrypted and secure</Text>
              <Text style={styles.securityItem}>• We never store your full card details</Text>
              <Text style={styles.securityItem}>• Mobile Money transactions are processed securely</Text>
              <Text style={styles.securityItem}>• All payments are PCI DSS compliant</Text>
            </View>
          </Card>

          {/* Supported Methods */}
          <Card variant="outlined" style={styles.supportedCard}>
            <Text style={styles.supportedTitle}>💰 Supported Payment Methods</Text>
            <View style={styles.supportedGrid}>
              <View style={styles.supportedItem}>
                <Text style={styles.supportedIcon}>📱</Text>
                <Text style={styles.supportedName}>MTN MoMo</Text>
              </View>
              <View style={styles.supportedItem}>
                <Text style={styles.supportedIcon}>📞</Text>
                <Text style={styles.supportedName}>Vodafone Cash</Text>
              </View>
              <View style={styles.supportedItem}>
                <Text style={styles.supportedIcon}>💰</Text>
                <Text style={styles.supportedName}>Airtel Money</Text>
              </View>
              <View style={styles.supportedItem}>
                <Text style={styles.supportedIcon}>💳</Text>
                <Text style={styles.supportedName}>Visa/Mastercard</Text>
              </View>
            </View>
          </Card>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    minHeight: 64,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
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

  // Add New Payment Method
  addCard: {
    marginBottom: spacing.xl,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  addIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  addIconText: {
    fontSize: 24,
    color: colors.primary[600],
    fontWeight: '600',
  },
  addContent: {
    flex: 1,
  },
  addTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  addDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
  },

  // Payment Methods List
  methodsList: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  methodCard: {
    marginBottom: spacing.lg,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  methodType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodProvider: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  methodDetail: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  defaultBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    marginLeft: spacing.md,
  },
  defaultText: {
    ...textStyles.small,
    color: colors.primary[700],
    fontWeight: '600',
  },
  methodActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },

  // Method Details
  methodDetails: {
    marginBottom: spacing.lg,
  },
  accountName: {
    ...textStyles.body,
    color: colors.text.secondary,
  },

  // Method Footer
  methodFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: spacing.lg,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
  },
  setDefaultText: {
    ...textStyles.button,
    color: colors.primary[700],
    fontWeight: '600',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptyDescription: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  emptyButton: {
    minWidth: 200,
  },

  // Security Info
  securityCard: {
    marginBottom: spacing.lg,
  },
  securityTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  securityList: {
    gap: spacing.sm,
  },
  securityItem: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 20,
  },

  // Supported Methods
  supportedCard: {
    marginTop: spacing.xl,
  },
  supportedTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  supportedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  supportedItem: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  supportedIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  supportedName: {
    ...textStyles.body,
    color: colors.text.primary,
    textAlign: 'center',
    fontWeight: '500',
  },
});
