
import { CreatePujaSegmentRequest, PujaSegmentResponse } from "../types/puja";
import axios from "axios";


export const StripeService = {

  // Stripe: create PaymentIntent
  createStripePaymentIntent: async (payload: {
    amount: number; // base unit (e.g., 12.34 -> 12.34)
    currency: string; // 'USD' | 'GBP'
    receipt: string;
    notes?: Record<string, string>;
  }) => {
    const response = await axios.post(
      `${serviceBaseUrl}/payment-intent/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data.result;
  },

  // Stripe: verify PaymentIntent
  verifyStripePaymentIntent: async (paymentIntentId: string) => {
    const response = await axios.post(
      `${serviceBaseUrl}/payment-intent/verify`,
      null,
      { params: { paymentIntentId }, withCredentials: true }
    );
    return response.data.result;
  },

getOrderDetails: async (orderId: string) => {
  const response = await axios.get(`${serviceBaseUrl}/orders/${orderId}`, {
    headers: { accept: "application/json" },
    withCredentials: true,
  });
  return response.data.result; // or handle error accordingly
}
}