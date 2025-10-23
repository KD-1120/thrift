import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WelcomeStep from './WelcomeStep';
import ProfileStep from './ProfileStep';
import PortfolioStep from './PortfolioStep';
import ServicesStep from './ServicesStep';

const steps = ['Welcome', 'Profile', 'Portfolio', 'Services'];

import { useAppDispatch } from '../../../store/hooks';
import { setOnboardingCompleted } from '../../auth/authSlice';

const TailorOnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  const dispatch = useAppDispatch();

  const handleNext = (data = {}) => {
    setOnboardingData({ ...onboardingData, ...data });
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // In a real app, you would send the onboardingData to your API
      console.log('Onboarding complete:', onboardingData);
      dispatch(setOnboardingCompleted());
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return <ProfileStep onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <PortfolioStep onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <ServicesStep onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{renderStep()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default TailorOnboardingWizard;
