import { api } from "@/lib/axios";
import { Partner } from "../types/partner.types";
import { partners as mockPartners } from "../data/partners";
import { getUserLocation, resolveCoordinates, calculateHaversineDistance } from "@/lib/location";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function enrichPartnerWithDynamicReviews(partner: any): Partner {
  let reviews = partner.reviews || [];
  if (typeof window !== "undefined") {
    try {
      const savedLegacy = localStorage.getItem(`partner_reviews_${partner.id}`);
      let legacyReviews = [];
      if (savedLegacy) {
        legacyReviews = JSON.parse(savedLegacy);
      }
      
      const savedGlobal = localStorage.getItem("hire_my_partner_reviews");
      let globalReviews = [];
      if (savedGlobal) {
        const globalList = JSON.parse(savedGlobal);
        globalReviews = globalList.filter((r: any) => 
          String(r.partnerId) === String(partner.id) && r.status === "APPROVED"
        );
      }
      
      const allReviewsMap = new Map();
      (partner.reviews || []).forEach((r: any) => {
        if (r && r.id) allReviewsMap.set(String(r.id), r);
      });
      legacyReviews.forEach((r: any) => {
        if (r && r.id) allReviewsMap.set(String(r.id), r);
      });
      globalReviews.forEach((r: any) => {
        if (r && r.id) allReviewsMap.set(String(r.id), r);
      });
      reviews = Array.from(allReviewsMap.values());
    } catch (e) {
      console.error("Failed to parse reviews for partner", partner.id, e);
    }
  }

  // Calculate average rating
  let ratingNum = 0;
  if (Array.isArray(reviews) && reviews.length > 0) {
    const sum = reviews.reduce((acc, r: any) => acc + (r.rating || 5), 0);
    ratingNum = parseFloat((sum / reviews.length).toFixed(1));
  } else {
    ratingNum = 0.0;
  }

  // Parse or compute dynamic distance
  let distanceNum = 0;
  if (typeof window !== "undefined") {
    try {
      const userLoc = getUserLocation();
      const partnerLat = partner.lat !== undefined ? partner.lat : undefined;
      const partnerLng = partner.lng !== undefined ? partner.lng : undefined;

      if (partnerLat !== undefined && partnerLng !== undefined) {
        distanceNum = calculateHaversineDistance(userLoc.lat, userLoc.lng, partnerLat, partnerLng);
      } else {
        const coords = resolveCoordinates(partner.location || partner.city);
        distanceNum = calculateHaversineDistance(userLoc.lat, userLoc.lng, coords.lat, coords.lng);
      }
    } catch (e) {
      console.error("Failed to dynamically compute distance", e);
      distanceNum = typeof partner.distance === "number"
        ? partner.distance
        : parseFloat(String(partner.distance || "0").replace(/[^0-9.]/g, "")) || 0;
    }
  } else {
    distanceNum = typeof partner.distance === "number"
      ? partner.distance
      : parseFloat(String(partner.distance || "0").replace(/[^0-9.]/g, "")) || 0;
  }

  return {
    ...partner,
    reviews,
    rating: ratingNum,
    distance: distanceNum,
  } as Partner;
}

export const PartnerService = {
  /**
   * Fetches all partners from the API.
   * Performs runtime checks on the response structure and falls back to mock data if parsing fails.
   */
  async getPartners(): Promise<Partner[]> {
    let localApproved: Partner[] = [];
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("approved_partners");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Keep only objects that conform to the new schema with pricing properties
            localApproved = parsed.filter((p: any) => p && typeof p === "object" && p.pricing && p.pricing.oneHour) as Partner[];
            
            // If the filtered list is smaller, save it back to clean the cache automatically
            if (localApproved.length !== parsed.length) {
              localStorage.setItem("approved_partners", JSON.stringify(localApproved));
            }
          }
        }
      } catch (e) {
        console.error("Failed to load approved partners", e);
      }
    }

    try {
      const response = await api.get("/partners");
      const data = response.data;
      
      // Standard list check
      if (Array.isArray(data)) {
        return [...localApproved, ...data].map(enrichPartnerWithDynamicReviews);
      }
      
      // Check for nested wrapper patterns (e.g., { data: [...] } or { partners: [...] })
      if (data && typeof data === "object") {
        if (Array.isArray((data as any).data)) {
          return [...localApproved, ...(data as any).data].map(enrichPartnerWithDynamicReviews);
        }
        if (Array.isArray((data as any).partners)) {
          return [...localApproved, ...(data as any).partners].map(enrichPartnerWithDynamicReviews);
        }
      }
      
      throw new Error("Invalid API response format (expected an array)");
    } catch (error) {
      console.warn("PartnerService.getPartners failed, falling back to mock data:", error);
      // Simulate network latency for a realistic loading experience
      await delay(800);
      return [...localApproved, ...mockPartners].map(enrichPartnerWithDynamicReviews);
    }
  },

  /**
   * Fetches a single partner profile by ID or name slug from the API.
   * Performs runtime checks and falls back to mock data if parsing fails.
   */
  async getPartnerById(id: string): Promise<Partner> {
    const decodedId = decodeURIComponent(id).toLowerCase();

    // Check localStorage first
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("approved_partners");
        if (saved) {
          const localList: Partner[] = JSON.parse(saved);
          const found = localList.find((p) => {
            const rawIdMatch = String(p.id).toLowerCase() === decodedId;
            const nameSlug = p.name.toLowerCase().replace(/\s+/g, "-");
            const slugMatch = nameSlug === decodedId;
            return rawIdMatch || slugMatch;
          });
          if (found) return enrichPartnerWithDynamicReviews(found);
        }
      } catch (e) {
        console.error("Failed to query local approved partners", e);
      }
    }

    try {
      const response = await api.get(`/partners/${id}`);
      const data = response.data;
      
      // Check if response contains a valid partner object
      if (data && typeof data === "object" && ("id" in data || "name" in data)) {
        return enrichPartnerWithDynamicReviews(data as Partner);
      }
      
      throw new Error("Invalid partner detail response format");
    } catch (error) {
      console.warn(`PartnerService.getPartnerById(${id}) failed, falling back to mock data:`, error);
      // Simulate network latency for a realistic loading experience
      await delay(600);
      
      let partner = mockPartners.find((p) => {
        const rawIdMatch = String(p.id).toLowerCase() === decodedId;
        const nameSlug = p.name.toLowerCase().replace(/\s+/g, "-");
        const slugMatch = nameSlug === decodedId;
        return rawIdMatch || slugMatch;
      });

      if (!partner && typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem("approved_partners");
          if (saved) {
            const localList: Partner[] = JSON.parse(saved);
            partner = localList.find((p) => {
              const rawIdMatch = String(p.id).toLowerCase() === decodedId;
              const nameSlug = p.name.toLowerCase().replace(/\s+/g, "-");
              const slugMatch = nameSlug === decodedId;
              return rawIdMatch || slugMatch;
            });
          }
        } catch (e) {
          console.error("Failed to query localStorage fallback in getPartnerById", e);
        }
      }

      if (!partner) {
        throw new Error("Partner not found");
      }
      return enrichPartnerWithDynamicReviews(partner);
    }
  }
};
