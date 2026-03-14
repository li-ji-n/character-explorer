import * as React from 'react';
import { StatusBar } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from './api/client';
import { RootNavigator } from './navigation/RootNavigator';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <RootNavigator />
    </QueryClientProvider>
  );
}
