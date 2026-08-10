import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { getDerivedStateFromError } from './errorUtils';

interface Props {
  children: ReactNode;
  fallbackText?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  errorMessage: string | null;
}

export class MerchantErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return getDerivedStateFromError(error);
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Redact sensitive details in production crash logging
    const sanitizedMsg = (error.message || '').replace(/bearer\s+[^\s]+/gi, '[REDACTED_TOKEN]');
    console.error('[MerchantErrorBoundary] Caught crash:', sanitizedMsg, errorInfo.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.icon}>⚠️</Text>
            <Text style={styles.title}>Merchant Ops Recovery</Text>
            <Text style={styles.message}>
              {this.props.fallbackText || 'Quick Merchant Ops encountered a temporary UI rendering issue.'}
            </Text>
            {this.state.errorMessage && (
              <Text style={styles.errorDetails} numberOfLines={2}>
                Details: {this.state.errorMessage}
              </Text>
            )}
            <TouchableOpacity style={styles.resetButton} onPress={this.handleReset} activeOpacity={0.8}>
              <Text style={styles.resetButtonText}>Reload Merchant Dashboard</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  errorDetails: {
    fontSize: 12,
    color: '#EF4444',
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
    width: '100%',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
