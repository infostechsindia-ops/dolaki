export interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

export function getDerivedStateFromError(error: Error): ErrorBoundaryState {
  return {
    hasError: true,
    errorMessage: error.message || 'Unexpected application exception',
  };
}
