import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';
import { AnimatedSplashOverlay } from '@/components/animated-icon';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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

