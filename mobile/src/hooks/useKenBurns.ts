import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export function useKenBurns(duration: number = 4500, isActive: boolean = true) {
  const scaleValue = useRef(new Animated.Value(1.0)).current;

  useEffect(() => {
    if (isActive) {
      scaleValue.setValue(1.0);
      Animated.timing(scaleValue, {
        toValue: 1.08,
        duration: duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(1.0);
    }
  }, [isActive, duration]);

  return scaleValue;
}
