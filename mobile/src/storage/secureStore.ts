let Platform: any = { OS: 'web' };
try {
  Platform = require('react-native').Platform || { OS: 'web' };
} catch (e) {
  // Fallback in Node test context
}

// In-memory fallback map for Web & Node.js test environments
const inMemoryStore = new Map<string, string>();

let SecureStoreModule: any = null;
try {
  SecureStoreModule = require('expo-secure-store');
} catch (e) {
  // Expo SecureStore native module not loaded in fallback test context
}

export const SECURE_KEYS = {
  ACCESS_TOKEN: 'auramart_access_token',
  REFRESH_TOKEN: 'auramart_refresh_token',
  USER_SESSION: 'auramart_user_session',
} as const;

/**
 * Saves a sensitive string token to platform secure keychain/keystore.
 * Never uses unencrypted AsyncStorage for tokens.
 */
export async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS !== 'web' && SecureStoreModule && typeof SecureStoreModule.setItemAsync === 'function') {
    await SecureStoreModule.setItemAsync(key, value);
  } else {
    inMemoryStore.set(key, value);
  }
}

/**
 * Retrieves a sensitive string token from platform secure keychain/keystore.
 */
export async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS !== 'web' && SecureStoreModule && typeof SecureStoreModule.getItemAsync === 'function') {
    return await SecureStoreModule.getItemAsync(key);
  }
  return inMemoryStore.get(key) || null;
}

/**
 * Removes a sensitive string token from platform secure keychain/keystore.
 */
export async function removeSecureItem(key: string): Promise<void> {
  if (Platform.OS !== 'web' && SecureStoreModule && typeof SecureStoreModule.deleteItemAsync === 'function') {
    await SecureStoreModule.deleteItemAsync(key);
  } else {
    inMemoryStore.delete(key);
  }
}

/**
 * Clears all authentication tokens from secure storage during logout.
 */
export async function clearAuthSessionTokens(): Promise<void> {
  await removeSecureItem(SECURE_KEYS.ACCESS_TOKEN);
  await removeSecureItem(SECURE_KEYS.REFRESH_TOKEN);
  await removeSecureItem(SECURE_KEYS.USER_SESSION);
}
