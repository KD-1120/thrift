import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FallbackComponent } from './FallbackComponent';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only record error to crashlytics if Firebase is initialized and crashlytics is available
    try {
      // Dynamically import crashlytics to avoid initialization issues
      const crashlytics = require('@react-native-firebase/crashlytics');
      
      if (crashlytics && typeof crashlytics.default === 'function') {
        const crashlyticsInstance = crashlytics.default();
        if (crashlyticsInstance && typeof crashlyticsInstance.recordError === 'function') {
          crashlyticsInstance.recordError(error, errorInfo.componentStack ?? undefined);
        }
      }
    } catch (firebaseError) {
      // Firebase crashlytics not available or not initialized, just log to console
      console.error('Crashlytics not available, logging error to console:', error);
    }
  }

  private handleReset = () => {
    // Only reload using Updates in production, otherwise just refresh the page/component
    if (Constants.expoConfig?.extra?.eas?.projectId && !__DEV__) {
      Updates.reloadAsync();
    } else {
      // In development, just reset the error state to re-render
      this.setState({ hasError: false });
    }
  };

  public render() {
    if (this.state.hasError) {
      return <FallbackComponent resetError={this.handleReset} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
