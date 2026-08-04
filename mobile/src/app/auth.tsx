import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, 
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  
  const [loading, setLoading] = useState(false);

  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const handleTabSwitch = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    Animated.spring(slideAnim, {
      toValue: tab === 'login' ? 0 : 1,
      useNativeDriver: false,
    }).start();
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      
      if (res.ok) {
        await AsyncStorage.setItem('aura_token', data.token || 'mock_token');
        await AsyncStorage.setItem('aura_user', JSON.stringify(data.user || { name: 'User', email: loginEmail }));
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (e) {
      // Fallback for demo
      await AsyncStorage.setItem('aura_token', 'mock_token_123');
      await AsyncStorage.setItem('aura_user', JSON.stringify({ name: 'Demo User', email: loginEmail }));
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPhone || !regPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (regPassword !== regConfirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, phone: regPhone, password: regPassword })
      });
      const data = await res.json();
      
      if (res.ok) {
        await AsyncStorage.setItem('aura_token', data.token || 'mock_token');
        await AsyncStorage.setItem('aura_user', JSON.stringify(data.user || { name: regName, email: regEmail }));
        router.replace('/(tabs)');
      } else {
        Alert.alert('Registration Failed', data.message || 'Error occurred');
      }
    } catch (e) {
      // Fallback for demo
      await AsyncStorage.setItem('aura_token', 'mock_token_123');
      await AsyncStorage.setItem('aura_user', JSON.stringify({ name: regName, email: regEmail }));
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  const indicatorPosition = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%']
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.logoText}>🛒 AuraMart</Text>
          <Text style={styles.tagline}>Shop Smart. Live Better.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={styles.tabBtn} onPress={() => handleTabSwitch('login')}>
              <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabBtn} onPress={() => handleTabSwitch('register')}>
              <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>Register</Text>
            </TouchableOpacity>
            <Animated.View style={[styles.tabIndicator, { left: indicatorPosition }]} />
          </View>

          {activeTab === 'login' ? (
            <View style={styles.formContainer}>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Email Address" 
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                />
              </View>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Password" 
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                />
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Login</Text>}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.secondaryBtn} onPress={() => Alert.alert('OTP', 'OTP sent to phone')}>
                <Ionicons name="call-outline" size={18} color="#10B981" style={{ marginRight: 8 }} />
                <Text style={styles.secondaryBtnText}>Login with Phone OTP</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Full Name" 
                  placeholderTextColor="#9CA3AF"
                  value={regName}
                  onChangeText={setRegName}
                />
              </View>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Email Address" 
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={regEmail}
                  onChangeText={setRegEmail}
                />
              </View>
              <View style={styles.inputWrap}>
                <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Phone Number" 
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={regPhone}
                  onChangeText={setRegPhone}
                />
              </View>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Password" 
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={regPassword}
                  onChangeText={setRegPassword}
                />
              </View>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.icon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Confirm Password" 
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={regConfirm}
                  onChangeText={setRegConfirm}
                />
              </View>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Register</Text>}
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.guestBtn} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#10b981',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    width: '50%',
    height: 3,
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  formContainer: {
    gap: 16,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  primaryBtn: {
    backgroundColor: '#10b981',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#9CA3AF',
    fontSize: 14,
  },
  secondaryBtn: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
  guestBtn: {
    marginTop: 'auto',
    marginBottom: 30,
    alignItems: 'center',
  },
  guestBtnText: {
    color: '#6B7280',
    fontSize: 15,
    textDecorationLine: 'underline',
  }
});
