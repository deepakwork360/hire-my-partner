import { api } from "@/lib/axios";
import { Partner } from "../types/partner.types";
import { partners as mockPartners } from "../data/partners";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
        return [...localApproved, ...data] as Partner[];
      }
      
      // Check for nested wrapper patterns (e.g., { data: [...] } or { partners: [...] })
      if (data && typeof data === "object") {
        if (Array.isArray((data as any).data)) {
          return [...localApproved, ...(data as any).data] as Partner[];
        }
        if (Array.isArray((data as any).partners)) {
          return [...localApproved, ...(data as any).partners] as Partner[];
        }
      }
      
      throw new Error("Invalid API response format (expected an array)");
    } catch (error) {
      console.warn("PartnerService.getPartners failed, falling back to mock data:", error);
      // Simulate network latency for a realistic loading experience
      await delay(800);
      return [...localApproved, ...mockPartners];
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
          if (found) return found;
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
        return data as Partner;
      }
      
      throw new Error("Invalid partner detail response format");
    } catch (error) {
      console.warn(`PartnerService.getPartnerById(${id}) failed, falling back to mock data:`, error);
      // Simulate network latency for a realistic loading experience
      await delay(600);
      
      const partner = mockPartners.find((p) => {
        const rawIdMatch = String(p.id).toLowerCase() === decodedId;
        const nameSlug = p.name.toLowerCase().replace(/\s+/g, "-");
        const slugMatch = nameSlug === decodedId;
        return rawIdMatch || slugMatch;
      });

      if (!partner) {
        throw new Error("Partner not found");
      }
      return partner;
    }
  }
};
