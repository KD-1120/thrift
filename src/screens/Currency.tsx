// Currency Screen - Complete Implementation

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../store/navigation';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';
import { Card } from '../components/Card';
import { IconButton } from '../components/IconButton';

const MAX_CONTENT_WIDTH = 600;

// Available currencies
const currencies = [
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: '₵',
    flag: '🇬🇭',
    isDefault: true,
    exchangeRate: 1,
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    isDefault: false,
    exchangeRate: 0.085, // Approximate: 1 GHS = ~0.085 USD
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    isDefault: false,
    exchangeRate: 0.078, // Approximate: 1 GHS = ~0.078 EUR
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    isDefault: false,
    exchangeRate: 0.067, // Approximate: 1 GHS = ~0.067 GBP
  },
];

export default function CurrencyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedCurrency, setSelectedCurrency] = useState('GHS');

  const handleCurrencySelect = (currencyCode: string) => {
    setSelectedCurrency(currencyCode);
    // TODO: Save currency preference and update app state
  };

  const formatPrice = (amount: number, currency: typeof currencies[0]) => {
    return `${currency.symbol}${amount.toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Currency</Text>
        <Text style={styles.headerSubtitle}>Choose your preferred currency</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Current Currency */}
          <Card variant="outlined" style={styles.currentCard}>
            <View style={styles.currentHeader}>
              <Text style={styles.currentTitle}>Current Currency</Text>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>
                  {currencies.find(curr => curr.code === selectedCurrency)?.flag} {' '}
                  {currencies.find(curr => curr.code === selectedCurrency)?.code}
                </Text>
              </View>
            </View>
          </Card>

          {/* Available Currencies */}
          <View style={styles.currenciesSection}>
            <Text style={styles.sectionTitle}>Available Currencies</Text>

            {currencies.map((currency) => (
              <Card
                key={currency.code}
                variant={selectedCurrency === currency.code ? "elevated" : "outlined"}
                style={selectedCurrency === currency.code ? styles.selectedCard : styles.currencyCard}
              >
                <TouchableOpacity
                  style={styles.currencyButton}
                  onPress={() => handleCurrencySelect(currency.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.currencyLeft}>
                    <Text style={styles.currencyFlag}>{currency.flag}</Text>
                    <View style={styles.currencyInfo}>
                      <Text style={styles.currencyCode}>{currency.code}</Text>
                      <Text style={styles.currencyName}>{currency.name}</Text>
                    </View>
                  </View>

                  <View style={styles.currencyRight}>
                    {currency.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                    <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                    {selectedCurrency === currency.code && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>

          {/* Price Comparison */}
          <Card variant="outlined" style={styles.comparisonCard}>
            <Text style={styles.comparisonTitle}>💰 Price Comparison</Text>
            <Text style={styles.comparisonSubtitle}>Sample prices for a ₵200 garment:</Text>

            <View style={styles.priceGrid}>
              {currencies.map((currency) => {
                const convertedAmount = 200 * currency.exchangeRate;
                return (
                  <View key={currency.code} style={styles.priceItem}>
                    <Text style={styles.priceFlag}>{currency.flag}</Text>
                    <Text style={styles.priceAmount}>
                      {formatPrice(convertedAmount, currency)}
                    </Text>
                    <Text style={styles.priceCode}>{currency.code}</Text>
                  </View>
                );
              })}
            </View>

            <Text style={styles.disclaimer}>
              * Exchange rates are approximate and may vary. Actual prices will be calculated at checkout.
            </Text>
          </Card>

          {/* Currency Info */}
          <Card variant="outlined" style={styles.infoCard}>
            <Text style={styles.infoTitle}>💱 About Currencies</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoItem}>
                • Ghanaian Cedi (GHS) is the default currency for local customers
              </Text>
              <Text style={styles.infoItem}>
                • International currencies are available for tourists and expats
              </Text>
              <Text style={styles.infoItem}>
                • All payments are processed in your selected currency
              </Text>
              <Text style={styles.infoItem}>
                • Currency changes affect all prices throughout the app
              </Text>
            </View>
          </Card>

          {/* Regional Info */}
          <Card variant="outlined" style={styles.regionalCard}>
            <Text style={styles.regionalTitle}>🌍 Regional Information</Text>
            <View style={styles.regionalList}>
              <Text style={styles.regionalItem}>
                🇬🇭 Ghana: Primary market with GHS as local currency
              </Text>
              <Text style={styles.regionalItem}>
                🌍 International: USD, EUR, GBP for global customers
              </Text>
              <Text style={styles.regionalItem}>
                💱 Exchange: Real-time rates used for international payments
              </Text>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + spacing.xs,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: {
    marginBottom: spacing.sm,
  },
  headerTitle: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
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

  // Current Currency
  currentCard: {
    marginBottom: spacing.xl,
  },
  currentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
  },
  currentBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  currentBadgeText: {
    ...textStyles.body,
    color: colors.primary[700],
    fontWeight: '600',
  },

  // Currencies Section
  currenciesSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  currencyCard: {
    marginBottom: spacing.md,
  },
  selectedCard: {
    borderColor: colors.primary[300],
    borderWidth: 2,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencyFlag: {
    fontSize: 32,
    marginRight: spacing.lg,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  currencyName: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  currencyRight: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  defaultBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  defaultText: {
    ...textStyles.small,
    color: colors.primary[700],
    fontWeight: '600',
  },
  currencySymbol: {
    ...textStyles.h2,
    color: colors.text.primary,
    marginRight: spacing.md,
    minWidth: 24,
    textAlign: 'center',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 14,
    fontWeight: '700',
  },

  // Price Comparison
  comparisonCard: {
    marginBottom: spacing.lg,
  },
  comparisonTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  comparisonSubtitle: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  priceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  priceItem: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
  },
  priceFlag: {
    fontSize: 24,
    marginBottom: spacing.sm,
  },
  priceAmount: {
    ...textStyles.h2,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  priceCode: {
    ...textStyles.small,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  disclaimer: {
    ...textStyles.small,
    color: colors.text.tertiary,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Info Section
  infoCard: {
    marginBottom: spacing.lg,
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

  // Regional Section
  regionalCard: {
    marginTop: spacing.xl,
  },
  regionalTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  regionalList: {
    gap: spacing.sm,
  },
  regionalItem: {
    ...textStyles.body,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
