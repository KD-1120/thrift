import React from 'react';
import { useAppSelector } from './hooks';
import TailorOnboardingWizard from '../features/onboarding/tailor/TailorOnboardingWizard';
import CustomerWelcomeScreen from '../features/onboarding/customer/CustomerWelcomeScreen';
import { RootNavigator } from './navigation';
import { useAppDispatch } from './hooks';
import { setOnboardingCompleted } from '../features/auth/authSlice';

const OnboardingNavigator = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  if (!user) {
    // This should not happen if the user is authenticated, but as a fallback
    return <RootNavigator />;
  }

  const handleOnboardingComplete = () => {
    // Here you would also make an API call to update the user's profile on the backend
    dispatch(setOnboardingCompleted());
  };

  if (!user.hasCompletedOnboarding) {
    if (user.role === 'tailor') {
      // TODO: Call handleOnboardingComplete when the tailor wizard is finished
      return <TailorOnboardingWizard />;
    } else {
      return <CustomerWelcomeScreen onDismiss={handleOnboardingComplete} />;
    }
  }

  return <RootNavigator />;
};

export default OnboardingNavigator;
