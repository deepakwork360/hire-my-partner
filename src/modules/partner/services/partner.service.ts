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
    try {
      const response = await api.get("/partners");
      const data = response.data;
      
      // Standard list check
      if (Array.isArray(data)) {
        return data as Partner[];
      }
      
      // Check for nested wrapper patterns (e.g., { data: [...] } or { partners: [...] })
      if (data && typeof data === "object") {
        if (Array.isArray((data as any).data)) {
          return (data as any).data as Partner[];
        }
        if (Array.isArray((data as any).partners)) {
          return (data as any).partners as Partner[];
        }
      }
      
      throw new Error("Invalid API response format (expected an array)");
    } catch (error) {
      console.warn("PartnerService.getPartners failed, falling back to mock data:", error);
      // Simulate network latency for a realistic loading experience
      await delay(800);
      return mockPartners;
    }
  },

  /**
   * Fetches a single partner profile by ID or name slug from the API.
   * Performs runtime checks and falls back to mock data if parsing fails.
   */
  async getPartnerById(id: string): Promise<Partner> {
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
      
      const decodedId = decodeURIComponent(id).toLowerCase();
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
