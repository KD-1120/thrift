// Main App Entry Point

import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store/store';
import OnboardingNavigator from './src/store/OnboardingNavigator';
import { useAuthRestore } from './src/hooks/useAuthRestore';
import { useFirebaseAuthObserver } from './src/hooks/useFirebaseAuthObserver';
import { colors } from './src/design-system/colors';
import ErrorBoundary from './src/components/ErrorBoundary';

function AppContent() {
  const { isRestoring } = useAuthRestore();
  
  // Keep Redux in sync with Firebase auth state
  useFirebaseAuthObserver();

  if (isRestoring) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  return <OnboardingNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar style="auto" />
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
});
