export interface FladoDarkstore {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  etaSpeed: number; // minutes per km travel speed
  basePrepTime: number; // base packing time in minutes
  hours: string;
  skuCount: number;
  isActive: boolean;
}

export const fladoDarkstoresData: FladoDarkstore[] = [
  {
    id: 'store-muzaffarpur-station',
    name: 'Flado Express · Station Road (Muzaffarpur)',
    address: 'Station Road, Opposite Junction, Muzaffarpur 842001',
    lat: 26.1209,
    lng: 85.3647,
    etaSpeed: 1.5,
    basePrepTime: 3,
    hours: '6:00 AM - Midnight',
    skuCount: 4500,
    isActive: true
  },
  {
    id: 'store-muzaffarpur-ahiyapur',
    name: 'Flado Kirana Hub · Ahiyapur Mandi',
    address: 'Ahiyapur Main Road, Muzaffarpur 842001',
    lat: 26.1345,
    lng: 85.3891,
    etaSpeed: 1.8,
    basePrepTime: 3,
    hours: '5:00 AM - 11:00 PM',
    skuCount: 3800,
    isActive: true
  },
  {
    id: 'store-muzaffarpur-chata',
    name: 'Mithila Kirana & Organic Hub',
    address: 'Chata Chowk, Club Road, Muzaffarpur 842002',
    lat: 26.1180,
    lng: 85.3520,
    etaSpeed: 1.6,
    basePrepTime: 4,
    hours: '6:30 AM - 10:30 PM',
    skuCount: 3200,
    isActive: true
  },
  {
    id: 'store-muzaffarpur-kanti',
    name: 'Shree Ram General & Dairy Store',
    address: 'Kanti Factory Area, Muzaffarpur 843109',
    lat: 26.1850,
    lng: 85.2950,
    etaSpeed: 2.0,
    basePrepTime: 3,
    hours: '6:00 AM - 10:00 PM',
    skuCount: 2900,
    isActive: true
  },
  {
    id: 'store-mau-civil',
    name: 'Flado Superstore · Civil Lines (Mau)',
    address: 'Civil Lines Road, Maunath Bhanjan 275101',
    lat: 25.9500,
    lng: 83.5620,
    etaSpeed: 1.5,
    basePrepTime: 3,
    hours: '6:00 AM - 11:00 PM',
    skuCount: 4100,
    isActive: true
  },
  {
    id: 'store-mau-rekabganj',
    name: 'Mau Medical & Provisions Agency',
    address: 'Rekabganj Bazar, Maunath Bhanjan 275101',
    lat: 25.9432,
    lng: 83.5558,
    etaSpeed: 1.7,
    basePrepTime: 3,
    hours: '24 Hours Open',
    skuCount: 5000,
    isActive: true
  },
  {
    id: 'store-bandra',
    name: 'Flado Dark Store · Bandra West',
    address: 'Hill Road, Near Bandra Station, Mumbai 400050',
    lat: 19.0596,
    lng: 72.8295,
    etaSpeed: 2.0,
    basePrepTime: 3,
    hours: '6:00 AM - 11:00 PM',
    skuCount: 4200,
    isActive: true
  },
  {
    id: 'store-worli',
    name: 'Flado Dark Store · Worli Seaface',
    address: 'Dr Annie Besant Rd, Worli, Mumbai 400018',
    lat: 19.0178,
    lng: 72.8173,
    etaSpeed: 1.8,
    basePrepTime: 3,
    hours: '6:00 AM - Midnight',
    skuCount: 3800,
    isActive: true
  },
  {
    id: 'store-andheri',
    name: 'Flado Dark Store · Andheri East',
    address: 'Marol Naka, Off Andheri-Kurla Road, Mumbai 400059',
    lat: 19.1136,
    lng: 72.8697,
    etaSpeed: 2.5,
    basePrepTime: 4,
    hours: '24 Hours Open',
    skuCount: 5100,
    isActive: true
  }
];

export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export interface RouteStoreResult {
  store: FladoDarkstore;
  distance: number;
  eta: number;
}

export const findClosestStoreAndETA = (lat: number, lng: number): RouteStoreResult | null => {
  const activeStores = fladoDarkstoresData.filter(s => s.isActive);
  if (activeStores.length === 0) return null;

  let closestStore = activeStores[0];
  let minDistance = calculateDistance(lat, lng, closestStore.lat, closestStore.lng);

  for (let i = 1; i < activeStores.length; i++) {
    const d = calculateDistance(lat, lng, activeStores[i].lat, activeStores[i].lng);
    if (d < minDistance) {
      minDistance = d;
      closestStore = activeStores[i];
    }
  }

  // Calculate ETA (Base Prep Time + Travel Time)
  const travelTime = minDistance * closestStore.etaSpeed;
  const rawEta = Math.round(closestStore.basePrepTime + travelTime);
  const finalEta = Math.max(rawEta, 8); // Minimum 8 min SLA

  return {
    store: closestStore,
    distance: minDistance,
    eta: finalEta
  };
};
