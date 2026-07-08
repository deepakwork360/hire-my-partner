export interface UserLocation {
  city: string;
  lat: number;
  lng: number;
  useCustom?: boolean;
  latitude?: number;
  longitude?: number;
  state?: string;
  country?: string;
}

export function getDeterministicCoordinates(str: string): { lat: number; lng: number } {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const latHash = Math.abs(hash & 0xFFFF) / 0xFFFF;
  const lngHash = Math.abs((hash >> 16) & 0xFFFF) / 0xFFFF;
  
  // Confine to realistic regions (lat -60 to 60, lng -180 to 180)
  const lat = -60 + latHash * 120;
  const lng = -180 + lngHash * 360;
  
  return { 
    lat: parseFloat(lat.toFixed(4)), 
    lng: parseFloat(lng.toFixed(4)) 
  };
}

export function resolveCoordinates(locationStr: string): { lat: number; lng: number } {
  if (!locationStr) return { lat: 19.0760, lng: 72.8777 }; // default to Mumbai
  
  const normalized = locationStr.toLowerCase().trim().replace(/[\/\s_-]+/g, "");
  
  const cityDict: Record<string, { lat: number; lng: number }> = {
    mumbai: { lat: 19.0760, lng: 72.8777 },
    delhi: { lat: 28.7041, lng: 77.1025 },
    delhincr: { lat: 28.7041, lng: 77.1025 },
    ncr: { lat: 28.7041, lng: 77.1025 },
    newdelhi: { lat: 28.7041, lng: 77.1025 },
    bangalore: { lat: 12.9716, lng: 77.5946 },
    bengaluru: { lat: 12.9716, lng: 77.5946 },
    dubai: { lat: 25.2048, lng: 55.2708 },
    losangeles: { lat: 34.0522, lng: -118.2437 },
    la: { lat: 34.0522, lng: -118.2437 },
    newyork: { lat: 40.7128, lng: -74.0060 },
    ny: { lat: 40.7128, lng: -74.0060 },
    nyc: { lat: 40.7128, lng: -74.0060 },
    tokyo: { lat: 35.6762, lng: 139.6503 },
    paris: { lat: 48.8566, lng: 2.3522 },
    london: { lat: 51.5074, lng: -0.1278 },
    sydney: { lat: -33.8688, lng: 151.2093 }
  };
  
  if (cityDict[normalized]) {
    return cityDict[normalized];
  }

  // Fallback to substring matching (e.g. "mumbaimaharashtra" contains "mumbai")
  for (const key of Object.keys(cityDict)) {
    if (normalized.includes(key)) {
      return cityDict[key];
    }
  }
  
  return getDeterministicCoordinates(locationStr);
}

export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return parseFloat(distance.toFixed(1));
}

export function getUserLocation(): UserLocation {
  if (typeof window === "undefined") {
    return { city: "Mumbai", lat: 19.0760, lng: 72.8777, latitude: 19.0760, longitude: 72.8777 };
  }
  
  try {
    const saved = localStorage.getItem("user_active_location");
    if (saved) {
      const parsed = JSON.parse(saved);
      const lat = parsed.lat !== undefined ? parsed.lat : (parsed.latitude !== undefined ? parsed.latitude : 19.0760);
      const lng = parsed.lng !== undefined ? parsed.lng : (parsed.longitude !== undefined ? parsed.longitude : 72.8777);
      return {
        ...parsed,
        lat,
        lng,
        latitude: lat,
        longitude: lng
      };
    }
  } catch (e) {
    console.error("Failed to parse user active location", e);
  }
  
  return { city: "Mumbai", lat: 19.0760, lng: 72.8777, latitude: 19.0760, longitude: 72.8777 };
}

export function setUserLocation(loc: UserLocation) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_active_location", JSON.stringify(loc));
    window.dispatchEvent(new Event("user_location_updated"));
  }
}
