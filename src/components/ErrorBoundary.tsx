import React, { Component, ErrorInfo, ReactNode } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import { FallbackComponent } from './FallbackComponent';
import * as Updates from 'expo-updates';

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
    crashlytics().recordError(error, errorInfo.componentStack);
  }

  private handleReset = () => {
    Updates.reloadAsync();
  };

  public render() {
    if (this.state.hasError) {
      return <FallbackComponent resetError={this.handleReset} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
