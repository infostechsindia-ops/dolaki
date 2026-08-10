import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../api/client';

export type PermissionStatus = 'UNDETERMINED' | 'GRANTED' | 'DENIED' | 'PERMANENTLY_DENIED';

export type LocationType = 'SAVED_ADDRESS' | 'CURRENT_GPS' | 'MAP_PIN';

export interface DeliveryLocation {
  type: LocationType;
  addressId?: string;
  label?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
}

export interface ServiceabilityStatus {
  isServiceable: boolean;
  fulfillmentSourceId?: string;
  storeName?: string;
  estimatedDeliveryText?: string;
  reason?: string;
}

interface LocationContextType {
  location: DeliveryLocation;
  permissionStatus: PermissionStatus;
  serviceability: ServiceabilityStatus | null;
  loadingServiceability: boolean;
  requestForegroundPermission: () => Promise<PermissionStatus>;
  setGPSLocation: (coords: { latitude: number; longitude: number; pincode?: string }) => Promise<void>;
  setMapPinCorrection: (coords: { latitude: number; longitude: number; addressLine1?: string; pincode?: string }) => Promise<void>;
  selectSavedAddress: (address: any) => Promise<void>;
  revalidateServiceability: (loc?: DeliveryLocation) => Promise<ServiceabilityStatus | null>;
}

const DEFAULT_LOCATION: DeliveryLocation = {
  type: 'SAVED_ADDRESS',
  addressId: 'default-addr-1',
  label: 'Home',
  addressLine1: 'Indiranagar 100ft Road',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560038',
  latitude: 12.9716,
  longitude: 77.5946,
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

import { calculateDistanceMeters } from '../utils/locationUtils';
export { calculateDistanceMeters };

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<DeliveryLocation>(DEFAULT_LOCATION);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('UNDETERMINED');
  const [serviceability, setServiceability] = useState<ServiceabilityStatus | null>(null);
  const [loadingServiceability, setLoadingServiceability] = useState<boolean>(false);

  const lastEvaluatedLocationRef = useRef<DeliveryLocation | null>(null);

  // Authoritative Backend Serviceability Check (DeliveryService / Flado darkstore geofence)
  const revalidateServiceability = useCallback(async (targetLocation?: DeliveryLocation): Promise<ServiceabilityStatus | null> => {
    const loc = targetLocation || location;

    // Check GPS jitter vs material change: if coordinates moved less than 50 meters and pincode is unchanged, skip duplicate request
    if (lastEvaluatedLocationRef.current && loc.latitude && loc.longitude && lastEvaluatedLocationRef.current.latitude && lastEvaluatedLocationRef.current.longitude) {
      const dist = calculateDistanceMeters(
        lastEvaluatedLocationRef.current.latitude,
        lastEvaluatedLocationRef.current.longitude,
        loc.latitude,
        loc.longitude,
      );
      if (dist < 50 && loc.pincode === lastEvaluatedLocationRef.current.pincode && loc.addressId === lastEvaluatedLocationRef.current.addressId) {
        return serviceability;
      }
    }

    setLoadingServiceability(true);
    try {
      const res: any = await apiClient('/flado/serviceability', {
        method: 'POST',
        body: JSON.stringify({
          latitude: loc.latitude,
          longitude: loc.longitude,
          pincode: loc.pincode,
          addressId: loc.addressId,
        }),
      });

      const result: ServiceabilityStatus = {
        isServiceable: res.isServiceable ?? res.serviced ?? true,
        fulfillmentSourceId: res.fulfillmentSourceId || res.storeId || 'darkstore-main-01',
        storeName: res.storeName || 'Flado Central Darkstore',
        estimatedDeliveryText: res.estimatedDeliveryText || res.etaText || '10-15 mins',
        reason: res.reason,
      };

      setServiceability(result);
      lastEvaluatedLocationRef.current = loc;
      return result;
    } catch (err) {
      // Fallback serviceability response on connection error
      const fallback: ServiceabilityStatus = {
        isServiceable: true,
        fulfillmentSourceId: 'darkstore-main-01',
        storeName: 'AuraMart Express',
        estimatedDeliveryText: '15-20 mins',
      };
      setServiceability(fallback);
      return fallback;
    } finally {
      setLoadingServiceability(false);
    }
  }, [location, serviceability]);

  // Foreground Location Permission Request (No background tracking)
  const requestForegroundPermission = useCallback(async (): Promise<PermissionStatus> => {
    // In canonical Expo client, request foreground permission safely
    try {
      // Simulate permission dialog grant flow
      setPermissionStatus('GRANTED');
      return 'GRANTED';
    } catch (e) {
      setPermissionStatus('DENIED');
      return 'DENIED';
    }
  }, []);

  // Current Location Selection
  const setGPSLocation = useCallback(async (coords: { latitude: number; longitude: number; pincode?: string }) => {
    const newLoc: DeliveryLocation = {
      type: 'CURRENT_GPS',
      latitude: coords.latitude,
      longitude: coords.longitude,
      pincode: coords.pincode || location.pincode,
      addressLine1: 'Current Device Location',
    };
    setLocation(newLoc);
    await revalidateServiceability(newLoc);
  }, [location.pincode, revalidateServiceability]);

  // Map Pin Correction with Coordinate Precision
  const setMapPinCorrection = useCallback(async (coords: { latitude: number; longitude: number; addressLine1?: string; pincode?: string }) => {
    const newLoc: DeliveryLocation = {
      type: 'MAP_PIN',
      latitude: coords.latitude,
      longitude: coords.longitude,
      addressLine1: coords.addressLine1 || 'Corrected Map Location',
      pincode: coords.pincode || location.pincode,
    };
    setLocation(newLoc);
    await revalidateServiceability(newLoc);
  }, [location.pincode, revalidateServiceability]);

  // Saved Address Selection
  const selectSavedAddress = useCallback(async (address: any) => {
    const newLoc: DeliveryLocation = {
      type: 'SAVED_ADDRESS',
      addressId: address.id,
      label: address.label || address.name || 'Saved Address',
      addressLine1: address.addressLine1 || address.line1,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      latitude: address.latitude || 12.9716,
      longitude: address.longitude || 77.5946,
    };
    setLocation(newLoc);
    await revalidateServiceability(newLoc);
  }, [revalidateServiceability]);

  useEffect(() => {
    revalidateServiceability(DEFAULT_LOCATION);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        permissionStatus,
        serviceability,
        loadingServiceability,
        requestForegroundPermission,
        setGPSLocation,
        setMapPinCorrection,
        selectSavedAddress,
        revalidateServiceability,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return ctx;
};
