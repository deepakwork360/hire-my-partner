import { api } from "@/lib/axios";

export interface EstimateRequest {
  partner_id: string | number;
  start_time: string; // "YYYY-MM-DD HH:mm:ss" or date string
  booked_hours: number;
  addons?: string[];
}

export interface EstimateResponse {
  status: boolean;
  message: string;
  data: {
    base_amount: number;
    addons_amount: number;
    tax_amount: number;
    total_amount: number;
  };
}

export interface BookingRequest {
  partner_id: string | number;
  start_time: string; // "YYYY-MM-DD HH:mm:ss"
  booked_hours: number;
  addons?: string[];
  reason: string;
  total_amount?: number;
}

export interface BookingResponse {
  status: boolean;
  message: string;
  data: {
    id: string; // server booking ID (e.g. BK-XXXX)
    partner_id: number;
    start_time: string;
    booked_hours: number;
    total_amount: number;
    status: string;
  };
}

export const BookingService = {
  /**
   * Fetches booking price breakdown estimation from the backend.
   */
  async getEstimate(payload: EstimateRequest): Promise<EstimateResponse> {
    const { data } = await api.post<EstimateResponse>("/bookings/estimate", payload);
    return data;
  },

  /**
   * Creates a new booking on the backend.
   */
  async createBooking(payload: BookingRequest): Promise<BookingResponse> {
    const { data } = await api.post<BookingResponse>("/bookings", payload);
    return data;
  }
};
