// Onboarding Welcome Screen

import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { colors } from '../design-system/colors';
import { spacing } from '../design-system/spacing';
import { textStyles } from '../design-system/typography';
import { Button } from '../components/Button';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Find Expert Tailors',
    description: 'Connect with skilled local tailors in Accra who bring your fashion vision to life',
    backgroundColor: colors.primary[50],
  },
  {
    id: '2',
    title: 'Custom-Fitted Elegance',
    description: 'Get perfectly fitted garments made just for you with precise measurements',
    backgroundColor: colors.semantic.successBackground,
  },
  {
    id: '3',
    title: 'Track Your Orders',
    description: 'Stay updated on your order progress from creation to delivery',
    backgroundColor: colors.semantic.infoBackground,
  },
  {
    id: '4',
    title: 'Quality Guaranteed',
    description: 'Browse portfolios, read reviews, and choose verified tailors you can trust',
    backgroundColor: colors.semantic.warningBackground,
  },
];

type AuthStackParamList = {
  RoleSelection: undefined;
};

export default function OnboardingScreen() {
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  }, []);

  const goToNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < slides.length) {
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      });
    }
  }, [currentIndex]);

  const goToSlide = useCallback((index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
  }, []);

  const skip = useCallback(() => {
    navigation.navigate('RoleSelection');
  }, [navigation]);

  const getStarted = useCallback(() => {
    navigation.navigate('RoleSelection');
  }, [navigation]);

  const renderSlide = useCallback(({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <View style={styles.slideContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  ), []);

  const renderDots = useMemo(() => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.dot,
            index === currentIndex && styles.activeDot,
          ]}
          onPress={() => goToSlide(index)}
          accessibilityLabel={`Go to slide ${index + 1}`}
        />
      ))}
    </View>
  ), [currentIndex, goToSlide]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.logo}>Thrift</Text>
        <TouchableOpacity onPress={skip} accessibilityLabel="Skip onboarding">
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={[styles.slide, { backgroundColor: slide.backgroundColor }]}>
            <View style={styles.slideContent}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {renderDots}
        <View style={styles.buttonContainer}>
          {currentIndex === slides.length - 1 ? (
            <Button
              title="Get Started"
              onPress={getStarted}
              fullWidth
            />
          ) : (
            <Button
              title="Next"
              onPress={goToNext}
              fullWidth
            />
          )}
        </View>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingTop: spacing.xxl,
  },
  logo: {
    ...textStyles.h3,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.primary[700],
  },
  skipText: {
    ...textStyles.bodyMedium,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  slideContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  title: {
    ...textStyles.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '700',
    lineHeight: 36,
  },
  description: {
    ...textStyles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.lg,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(139, 115, 85, 0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.primary[500],
    width: 20,
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
