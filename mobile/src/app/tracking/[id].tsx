import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

export default function TrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { orders } = useCart();
  const order = orders.find(o => o.id === id) || orders[0];

  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes default
  const [currentStep, setCurrentStep] = useState(0); // 0: Placed, 1: Packing, 2: Shipping, 3: Out for Delivery, 4: Delivered
  
  // Reanimated/Animated driver translation along path
  const courierAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!order) return;
    
    // Set initial countdown based on delivery type
    const initialSeconds = order.isFlado ? 600 : 3600 * 24 * 2; // 10 mins vs 2 days
    setSecondsLeft(initialSeconds);

    // Stepper timer simulation
    const stepsCount = 5;
    const intervalTime = order.isFlado ? 8000 : 30000; // Fast progression for Flado demo!
    
    const stepperInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < stepsCount - 1) {
          return prev + 1;
        }
        clearInterval(stepperInterval);
        return prev;
      });
    }, intervalTime);

    // Live countdown timer
    const countdownInterval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 0) return prev - 1;
        clearInterval(countdownInterval);
        return 0;
      });
    }, 1000);

    return () => {
      clearInterval(stepperInterval);
      clearInterval(countdownInterval);
    };
  }, [order]);

  // Translate courier along path based on currentStep
  useEffect(() => {
    Animated.spring(courierAnim, {
      toValue: currentStep * ((width - 64) / 4),
      useNativeDriver: true,
      tension: 20,
      friction: 6,
    }).start();
  }, [currentStep]);

  if (!order) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Order not found</Text>
        <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.homeBtnText}>Go to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Format countdown text
  const formatETA = () => {
    if (order.isFlado) {
      if (secondsLeft <= 0) return "Delivered!";
      const m = Math.floor(secondsLeft / 60);
      const s = secondsLeft % 60;
      return `${m}m ${s < 10 ? '0' : ''}${s}s`;
    } else {
      if (currentStep === 4) return "Delivered!";
      return "2-3 Days";
    }
  };

  const steps = [
    { label: 'Placed', icon: 'receipt-outline' },
    { label: 'Packing', icon: 'gift-outline' },
    { label: 'In Transit', icon: 'airplane-outline' },
    { label: 'Out for Delivery', icon: 'bicycle-outline' },
    { label: 'Arrived', icon: 'checkmark-circle-outline' }
  ];

  const brandColor = order.isFlado ? '#059669' : '#8B5CF6';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/profile')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Tracking</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ETA & Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.etaLabel}>{order.isFlado ? "⚡ FLADO 10m FAST-TRACK" : "🚚 AURAMART DELIVERY"}</Text>
          <Text style={[styles.etaValue, { color: brandColor }]}>{formatETA()}</Text>
          <Text style={styles.statusText}>
            Status: <Text style={{ fontWeight: 'bold', color: brandColor }}>{steps[currentStep].label}</Text>
          </Text>
        </View>

        {/* Dynamic Route Map Path Section */}
        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}>Route Path Display</Text>
          
          <View style={styles.mapContainer}>
            {/* Dark Store Node */}
            <View style={styles.mapNodeContainer}>
              <View style={[styles.mapNode, { backgroundColor: brandColor }]}>
                <Ionicons name="business" size={14} color="white" />
              </View>
              <Text style={styles.mapNodeText}>Store</Text>
            </View>

            {/* Connecting Track Line */}
            <View style={styles.trackLine}>
              <View style={[styles.trackLineProgress, { backgroundColor: brandColor, width: `${(currentStep / 4) * 100}%` }]} />
              
              {/* Animated Courier Icon */}
              <Animated.View style={[styles.courierIconIndicator, { transform: [{ translateX: courierAnim }] }]}>
                {order.isFlado ? (
                  <Ionicons name="bicycle" size={22} color={brandColor} />
                ) : (
                  <MaterialCommunityIcons name="truck-delivery" size={22} color={brandColor} />
                )}
              </Animated.View>
            </View>

            {/* Customer Home Node */}
            <View style={styles.mapNodeContainer}>
              <View style={[styles.mapNode, currentStep === 4 ? { backgroundColor: brandColor } : styles.nodePending]}>
                <Ionicons name="home" size={14} color={currentStep === 4 ? "white" : "#9CA3AF"} />
              </View>
              <Text style={styles.mapNodeText}>Home</Text>
            </View>
          </View>
        </View>

        {/* Delivery Progress Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.cardHeading}>Delivery Progress</Text>
          
          {steps.map((step, index) => {
            const isDone = index <= currentStep;
            const isCurrent = index === currentStep;
            
            return (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepIndicatorCol}>
                  <View style={[
                    styles.stepBullet, 
                    isDone ? { backgroundColor: brandColor } : styles.bulletPending
                  ]}>
                    {isDone ? (
                      <Ionicons name="checkmark" size={10} color="white" />
                    ) : (
                      <View style={styles.bulletDotPending} />
                    )}
                  </View>
                  {index < steps.length - 1 && (
                    <View style={[
                      styles.stepConnectorLine,
                      index < currentStep ? { backgroundColor: brandColor } : styles.linePending
                    ]} />
                  )}
                </View>
                
                <View style={[styles.stepTextCol, isCurrent && styles.currentStepTextCol]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name={step.icon as any} size={16} color={isDone ? brandColor : '#9CA3AF'} />
                    <Text style={[
                      styles.stepLabel, 
                      isDone ? styles.stepLabelDone : styles.stepLabelPending,
                      isCurrent && { fontWeight: 'bold', color: brandColor }
                    ]}>
                      {step.label}
                    </Text>
                  </View>
                  <Text style={styles.stepTimeText}>
                    {isDone ? 'Updated' : 'Pending'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Courier Details Card */}
        <View style={styles.courierCard}>
          <View style={styles.courierHeader}>
            <View style={styles.courierAvatar}>
              <Text style={styles.courierAvatarText}>RK</Text>
            </View>
            <View style={styles.courierInfo}>
              <Text style={styles.courierName}>Rahul Kumar</Text>
              <View style={styles.courierRatingRow}>
                <Ionicons name="star" size={12} color="#F59E0B" />
                <Text style={styles.courierRating}>4.9 (Courier Partner)</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.callBtn, { backgroundColor: brandColor }]}>
              <Ionicons name="call" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={styles.addressRow}>
            <Ionicons name="location" size={16} color="#6B7280" />
            <Text style={styles.deliveryAddrText} numberOfLines={2}>
              {order.address}
            </Text>
          </View>
        </View>

        {/* Order Items Bill List */}
        <View style={styles.itemsCard}>
          <Text style={styles.cardHeading}>Items in Order</Text>
          {order.items.map((item) => (
            <View key={item.itemId} style={styles.itemRow}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.itemQtyPrice}>
                x{item.quantity} • ₹{item.product.price * item.quantity}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.summaryTotalRow}>
            <Text style={styles.totalLabel}>Total paid</Text>
            <Text style={styles.totalValue}>₹{order.total}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.homeButton, { backgroundColor: brandColor }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.homeButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  homeBtn: {
    marginTop: 16,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  homeBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  etaValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#4B5563',
  },
  mapSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4B5563',
    marginBottom: 16,
  },
  mapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 60,
  },
  mapNodeContainer: {
    alignItems: 'center',
    width: 44,
  },
  mapNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nodePending: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  mapNodeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4B5563',
    marginTop: 4,
  },
  trackLine: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    position: 'relative',
    marginHorizontal: -8,
  },
  trackLineProgress: {
    height: '100%',
    borderRadius: 2,
  },
  courierIconIndicator: {
    position: 'absolute',
    top: -10,
    left: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    height: 56,
  },
  stepIndicatorCol: {
    alignItems: 'center',
    width: 24,
  },
  stepBullet: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  bulletPending: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  bulletDotPending: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  stepConnectorLine: {
    width: 2,
    flex: 1,
    zIndex: 1,
    marginVertical: -2,
  },
  linePending: {
    backgroundColor: '#E5E7EB',
  },
  stepTextCol: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'flex-start',
    paddingTop: 1,
  },
  currentStepTextCol: {
    opacity: 1,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  stepLabelDone: {
    color: '#1F2937',
  },
  stepLabelPending: {
    color: '#9CA3AF',
  },
  stepTimeText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  courierCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  courierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courierAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courierAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  courierInfo: {
    marginLeft: 12,
    flex: 1,
  },
  courierName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  courierRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  courierRating: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 3,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryAddrText: {
    fontSize: 12,
    color: '#4B5563',
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  itemName: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
    marginRight: 12,
  },
  itemQtyPrice: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '600',
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  homeButton: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
