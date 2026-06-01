import { useState, useEffect, useCallback } from "react";
import { Partner } from "../types/partner.types";
import { PartnerService } from "../services/partner.service";

export function usePartner(id: string) {
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPartner = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await PartnerService.getPartnerById(id);
      setPartner(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to fetch partner: ${id}`));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPartner();
  }, [fetchPartner]);

  return {
    partner,
    loading,
    error,
    refresh: fetchPartner,
  };
}
