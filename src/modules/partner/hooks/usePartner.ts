import { useState, useEffect, useCallback } from "react";
import { Partner } from "../types/partner.types";
import { PartnerService } from "../services/partner.service";
import { partners as mockPartners } from "../data/partners";

function findPartnerSync(id: string): Partner | null {
  if (!id) return null;
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

  // Fallback to mock data
  return mockPartners.find((p) => {
    const rawIdMatch = String(p.id).toLowerCase() === decodedId;
    const nameSlug = p.name.toLowerCase().replace(/\s+/g, "-");
    const slugMatch = nameSlug === decodedId;
    return rawIdMatch || slugMatch;
  }) || null;
}

export function usePartner(id: string) {
  const [partner, setPartner] = useState<Partner | null>(() => findPartnerSync(id));
  const [loading, setLoading] = useState<boolean>(() => !findPartnerSync(id));
  const [error, setError] = useState<Error | null>(null);
  const [prevId, setPrevId] = useState<string>(id);

  // Sync state if id changes
  if (id !== prevId) {
    const nextInitial = findPartnerSync(id);
    setPartner(nextInitial);
    setLoading(!nextInitial);
    setError(null);
    setPrevId(id);
  }

  const fetchPartner = useCallback(async () => {
    if (!id) return;
    // Only set loading to true if we don't have the partner data loaded yet
    if (!partner) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await PartnerService.getPartnerById(id);
      setPartner(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch partner: ${id}`));
    } finally {
      setLoading(false);
    }
  }, [id, partner]);

  useEffect(() => {
    fetchPartner();

    const handleUpdate = () => {
      fetchPartner();
    };

    window.addEventListener("reviews_updated", handleUpdate);
    window.addEventListener("partner_profile_updated", handleUpdate);
    return () => {
      window.removeEventListener("reviews_updated", handleUpdate);
      window.removeEventListener("partner_profile_updated", handleUpdate);
    };
  }, [fetchPartner]);

  return {
    partner,
    loading,
    error,
    refresh: fetchPartner,
  };
}
