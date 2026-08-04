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
    id: 'store-bandra',
    name: 'Flado Dark Store · Bandra West',
    address: 'Hill Road, Near Bandra Station, Mumbai, Maharashtra 400050',
    lat: 19.0596,
    lng: 72.8295,
    etaSpeed: 2.0, // 2 mins per km
    basePrepTime: 3, // 3 mins prep
    hours: '6:00 AM - 11:00 PM',
    skuCount: 4200,
    isActive: true
  },
  {
    id: 'store-andheri',
    name: 'Flado Dark Store · Andheri East',
    address: 'Marol Naka, Off Andheri-Kurla Road, Mumbai, Maharashtra 400059',
    lat: 19.1136,
    lng: 72.8697,
    etaSpeed: 2.5,
    basePrepTime: 4,
    hours: '24 Hours Open',
    skuCount: 5100,
    isActive: true
  },
  {
    id: 'store-worli',
    name: 'Flado Dark Store · Worli Seaface',
    address: 'Dr Annie Besant Rd, Worli, Mumbai, Maharashtra 400018',
    lat: 19.0178,
    lng: 72.8173,
    etaSpeed: 1.8,
    basePrepTime: 3,
    hours: '6:00 AM - Midnight',
    skuCount: 3800,
    isActive: true
  },
  {
    id: 'store-powai',
    name: 'Flado Dark Store · Powai Lakes',
    address: 'Hiranandani Gardens, Powai, Mumbai, Maharashtra 400076',
    lat: 19.1176,
    lng: 72.9060,
    etaSpeed: 2.2,
    basePrepTime: 4,
    hours: '6:00 AM - 11:00 PM',
    skuCount: 4600,
    isActive: true
  },
  {
    id: 'store-colaba',
    name: 'Flado Dark Store · Colaba Fort',
    address: 'Colaba Causeway, Near Gateway of India, Mumbai, Maharashtra 400001',
    lat: 18.9067,
    lng: 72.8147,
    etaSpeed: 1.5,
    basePrepTime: 3,
    hours: '7:00 AM - 10:00 PM',
    skuCount: 3500,
    isActive: true
  },
  {
    id: 'store-borivali',
    name: 'Flado Dark Store · Borivali West',
    address: 'SV Road, Borivali West, Mumbai, Maharashtra 400092',
    lat: 19.2307,
    lng: 72.8567,
    etaSpeed: 2.5,
    basePrepTime: 4,
    hours: '6:00 AM - 11:00 PM',
    skuCount: 3900,
    isActive: false // Closed temporarily
  }
];

// Helper to calculate Haversine distance in km
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
};

// Find closest darkstore to coordinates and return store + computed ETA (in minutes)
export const findClosestStoreAndETA = (
  userLat: number,
  userLng: number
): { store: FladoDarkstore; distance: number; eta: number } | null => {
  const activeStores = fladoDarkstoresData.filter(s => s.isActive);
  if (activeStores.length === 0) return null;

  let closestStore = activeStores[0];
  let minDistance = calculateDistance(userLat, userLng, closestStore.lat, closestStore.lng);

  for (let i = 1; i < activeStores.length; i++) {
    const d = calculateDistance(userLat, userLng, activeStores[i].lat, activeStores[i].lng);
    if (d < minDistance) {
      minDistance = d;
      closestStore = activeStores[i];
    }
  }

  // ETA = Prep Time + Travel Time (distance * minutes per km speed)
  const eta = Math.round(closestStore.basePrepTime + minDistance * closestStore.etaSpeed);
  return {
    store: closestStore,
    distance: minDistance,
    eta: eta < 8 ? 8 : eta // minimum 8 min delivery guarantee
  };
};
