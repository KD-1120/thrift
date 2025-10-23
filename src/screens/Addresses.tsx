// Addresses Screen - Complete Implementation

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
const mockAddresses = [
  {
    id: '1',
    type: 'home',
    name: 'Home',
    recipient: 'John Doe',
    phone: '+233 24 123 4567',
    address: '123 Main Street, Cantonments',
    city: 'Accra',
    region: 'Greater Accra',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    name: 'Office',
    recipient: 'John Doe',
    phone: '+233 24 123 4567',
    address: '456 Business Avenue, Airport City',
    city: 'Accra',
    region: 'Greater Accra',
    isDefault: false,
  },
];

export default function AddressesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [addresses, setAddresses] = useState(mockAddresses);

  const handleAddAddress = () => {
    // TODO: Navigate to add address screen
    Alert.alert('Add Address', 'Address form would open here');
  };

  const handleEditAddress = (address: typeof mockAddresses[0]) => {
    // TODO: Navigate to edit address screen
    Alert.alert('Edit Address', `Edit ${address.name}`);
  };

  const handleDeleteAddress = (address: typeof mockAddresses[0]) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete "${address.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAddresses(prev => prev.filter(a => a.id !== address.id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev =>
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      }))
    );
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return '🏠';
      case 'work':
        return '🏢';
      case 'other':
        return '📍';
      default:
        return '📍';
    }
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
        <Text style={styles.headerTitle}>Delivery Addresses</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Add New Address Button */}
          <Card variant="elevated" style={styles.addCard}>
            <TouchableOpacity style={styles.addButton} onPress={handleAddAddress} activeOpacity={0.8}>
              <View style={styles.addIcon}>
                <Text style={styles.addIconText}>+</Text>
              </View>
              <View style={styles.addContent}>
                <Text style={styles.addTitle}>Add New Address</Text>
                <Text style={styles.addDescription}>Add a delivery address for your orders</Text>
              </View>
            </TouchableOpacity>
          </Card>

          {/* Addresses List */}
          {addresses.length > 0 ? (
            <View style={styles.addressesList}>
              <Text style={styles.sectionTitle}>Your Addresses</Text>

              {addresses.map((address) => (
                <Card key={address.id} variant="outlined" style={styles.addressCard}>
                  <View style={styles.addressHeader}>
                    <View style={styles.addressType}>
                      <Text style={styles.addressTypeIcon}>{getAddressTypeIcon(address.type)}</Text>
                      <Text style={styles.addressName}>{address.name}</Text>
                      {address.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.addressActions}>
                      <IconButton
                        icon="edit"
                        library="material"
                        size={20}
                        onPress={() => handleEditAddress(address)}
                        style={styles.actionButton}
                      />
                      <IconButton
                        icon="delete"
                        library="material"
                        size={20}
                        onPress={() => handleDeleteAddress(address)}
                        style={styles.actionButton}
                      />
                    </View>
                  </View>

                  <View style={styles.addressDetails}>
                    <Text style={styles.recipient}>{address.recipient}</Text>
                    <Text style={styles.phone}>{address.phone}</Text>
                    <Text style={styles.addressLine}>{address.address}</Text>
                    <Text style={styles.cityRegion}>
                      {address.city}, {address.region}
                    </Text>
                  </View>

                  {!address.isDefault && (
                    <View style={styles.addressFooter}>
                      <TouchableOpacity
                        style={styles.setDefaultButton}
                        onPress={() => handleSetDefault(address.id)}
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
              <Text style={styles.emptyIcon}>📍</Text>
              <Text style={styles.emptyTitle}>No Addresses Yet</Text>
              <Text style={styles.emptyDescription}>
                Add your first delivery address to start placing orders
              </Text>
              <Button
                title="Add Address"
                onPress={handleAddAddress}
                style={styles.emptyButton}
              />
            </View>
          )}

          {/* Supported Regions */}
          <Card variant="outlined" style={styles.infoCard}>
            <Text style={styles.infoTitle}>� Supported Regions</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoItem}>• Greater Accra Region</Text>
              <Text style={styles.infoItem}>• We deliver to all areas within Accra</Text>
              <Text style={styles.infoItem}>• Contact support for areas outside Accra</Text>
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

  // Add New Address
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

  // Addresses List
  addressesList: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  addressCard: {
    marginBottom: spacing.lg,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  addressType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTypeIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  addressName: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginRight: spacing.md,
  },
  defaultBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
  },
  defaultText: {
    ...textStyles.small,
    color: colors.primary[700],
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },

  // Address Details
  addressDetails: {
    marginBottom: spacing.lg,
  },
  recipient: {
    ...textStyles.body,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  phone: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  addressLine: {
    ...textStyles.body,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  cityRegion: {
    ...textStyles.body,
    color: colors.text.secondary,
  },

  // Address Footer
  addressFooter: {
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

  // Info Section
  infoCard: {
    marginTop: spacing.xl,
  },
  infoTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  infoList: {
    gap: spacing.sm,
  },
  infoItem: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
