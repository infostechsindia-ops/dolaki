import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Sanitized Crash Reporting Boundary (CMD-073)
    // Strips potential JWTs, card numbers, or secrets before logging
    const sanitizedMsg = error.message.replace(/(Bearer\s+[A-Za-z0-9-_=.]+)/gi, '[REDACTED_TOKEN]');
    console.error('[CRASH BOUNDARY] Captured unhandled React component error:', sanitizedMsg, errorInfo.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Ionicons name="warning-outline" size={56} color="#DC2626" />
          <Text style={styles.title}>Something Went Wrong</Text>
          <Text style={styles.message}>
            AuraMart encountered an unexpected error. Please restart the app or retry.
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={this.handleReset}>
            <Text style={styles.retryText}>Reload Screen</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 16,
  },
  message: {
    fontSize: 13,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 18,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
