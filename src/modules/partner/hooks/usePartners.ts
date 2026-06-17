import { useState, useEffect, useCallback } from "react";
import { Partner } from "../types/partner.types";
import { PartnerService } from "../services/partner.service";

export function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await PartnerService.getPartners();
      setPartners(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch partners"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();

    const handleUpdate = () => {
      fetchPartners();
    };

    window.addEventListener("reviews_updated", handleUpdate);
    return () => window.removeEventListener("reviews_updated", handleUpdate);
  }, [fetchPartners]);

  return {
    partners,
    loading,
    error,
    refresh: fetchPartners,
  };
}
