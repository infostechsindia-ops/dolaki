import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';
import { AuthProvider, useAuthContext } from '../context/AuthContext';
import { SurfaceProvider } from '../context/SurfaceContext';
import { LoadingView } from '../components/common/StateViews';

import { LocationProvider } from '../context/LocationContext';
import { OfflineProvider, OfflineBanner } from '../context/OfflineContext';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

function InnerRootLayout() {
  const colorScheme = useColorScheme();
  const { isLoading } = useAuthContext();

  if (isLoading) {
    return <LoadingView message="Restoring AuraMart session..." />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <OfflineBanner />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="products/index" options={{ headerShown: false }} />
          <Stack.Screen name="products/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="tracking/[id]" options={{ headerShown: false }} />
          
          <Stack.Screen name="auth" options={{ headerShown: false, presentation: 'modal' }} />
          <Stack.Screen name="orders" options={{ headerShown: false }} />
          <Stack.Screen name="orders/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="account/addresses" options={{ headerShown: false }} />
          <Stack.Screen name="account/wallet" options={{ headerShown: false }} />
        </Stack>
      </CartProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SurfaceProvider>
          <OfflineProvider>
            <LocationProvider>
              <InnerRootLayout />
            </LocationProvider>
          </OfflineProvider>
        </SurfaceProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

