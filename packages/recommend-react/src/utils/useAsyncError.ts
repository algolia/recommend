import React from 'react';

export function useAsyncError() {
  const [, setAsyncError] = React.useState();

  const throwAsyncError = React.useCallback((error: Error) => {
    setAsyncError(() => {
      // This lets us catch the error in the upper <ErrorBoundary>
      throw error;
    });
  }, []);

  return throwAsyncError;
}
