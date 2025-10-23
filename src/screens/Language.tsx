// Language Screen - Complete Implementation

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

// Available languages
const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    isDefault: true,
  },
  {
    code: 'tw',
    name: 'Twi',
    nativeName: 'Twi',
    flag: '🇬🇭',
    isAvailable: false, // Not yet implemented
  },
  {
    code: 'ga',
    name: 'Ga',
    nativeName: 'Ga',
    flag: '🇬🇭',
    isAvailable: false, // Not yet implemented
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    isAvailable: false, // Not yet implemented
  },
];

export default function LanguageScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageSelect = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language?.isAvailable === false) {
      // TODO: Show coming soon message
      return;
    }
    setSelectedLanguage(languageCode);
    // TODO: Save language preference and restart app
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Language</Text>
        <Text style={styles.headerSubtitle}>Choose your preferred language</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Current Language */}
          <Card variant="outlined" style={styles.currentCard}>
            <View style={styles.currentHeader}>
              <Text style={styles.currentTitle}>Current Language</Text>
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>
                  {languages.find(lang => lang.code === selectedLanguage)?.flag} {' '}
                  {languages.find(lang => lang.code === selectedLanguage)?.name}
                </Text>
              </View>
            </View>
          </Card>

          {/* Available Languages */}
          <View style={styles.languagesSection}>
            <Text style={styles.sectionTitle}>Available Languages</Text>

            {languages.map((language) => (
              <Card
                key={language.code}
                variant={selectedLanguage === language.code ? "elevated" : "outlined"}
                style={selectedLanguage === language.code ? styles.selectedCard : styles.languageCard}
              >
                <TouchableOpacity
                  style={styles.languageButton}
                  onPress={() => handleLanguageSelect(language.code)}
                  activeOpacity={0.7}
                  disabled={language.isAvailable === false}
                >
                  <View style={styles.languageLeft}>
                    <Text style={styles.languageFlag}>{language.flag}</Text>
                    <View style={styles.languageInfo}>
                      <Text style={[
                        styles.languageName,
                        language.isAvailable === false && styles.disabledText,
                      ]}>
                        {language.name}
                      </Text>
                      <Text style={[
                        styles.languageNative,
                        language.isAvailable === false && styles.disabledText,
                      ]}>
                        {language.nativeName}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.languageRight}>
                    {language.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                    {language.isAvailable === false && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>Coming Soon</Text>
                      </View>
                    )}
                    {selectedLanguage === language.code && language.isAvailable !== false && (
                      <View style={styles.selectedIndicator}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Card>
            ))}
          </View>

          {/* Language Info */}
          <Card variant="outlined" style={styles.infoCard}>
            <Text style={styles.infoTitle}>🌐 About Languages</Text>
            <View style={styles.infoList}>
              <Text style={styles.infoItem}>
                • English is currently the primary language with full support
              </Text>
              <Text style={styles.infoItem}>
                • Local languages (Twi, Ga) are planned for future releases
              </Text>
              <Text style={styles.infoItem}>
                • French support for international customers coming soon
              </Text>
              <Text style={styles.infoItem}>
                • Language changes require app restart to take effect
              </Text>
            </View>
          </Card>

          {/* Help Section */}
          <Card variant="outlined" style={styles.helpCard}>
            <Text style={styles.helpTitle}>❓ Need Help?</Text>
            <Text style={styles.helpText}>
              If you don't see your preferred language or need assistance with language settings,
              please contact our support team.
            </Text>
            <TouchableOpacity style={styles.contactButton} activeOpacity={0.7}>
              <Text style={styles.contactText}>Contact Support</Text>
            </TouchableOpacity>
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

  // Current Language
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

  // Languages Section
  languagesSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  languageCard: {
    marginBottom: spacing.md,
  },
  selectedCard: {
    borderColor: colors.primary[300],
    borderWidth: 2,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  languageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: spacing.lg,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs / 2,
  },
  languageNative: {
    ...textStyles.body,
    color: colors.text.secondary,
  },
  disabledText: {
    color: colors.text.disabled,
  },
  languageRight: {
    alignItems: 'center',
  },
  defaultBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  defaultText: {
    ...textStyles.small,
    color: colors.primary[700],
    fontWeight: '600',
  },
  comingSoonBadge: {
    backgroundColor: colors.warning[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  comingSoonText: {
    ...textStyles.small,
    color: colors.warning[700],
    fontWeight: '600',
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

  // Help Section
  helpCard: {
    marginTop: spacing.xl,
  },
  helpTitle: {
    ...textStyles.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  helpText: {
    ...textStyles.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  contactButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary[50],
    borderRadius: 8,
  },
  contactText: {
    ...textStyles.button,
    color: colors.primary[700],
    fontWeight: '600',
  },
});
