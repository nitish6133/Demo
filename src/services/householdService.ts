// services/householdService.ts
import axios from "axios";
import type { HouseholdPayload } from "../types/household";
import { serviceBaseUrl } from "../constants/appConstants";

interface ExtendedHouseholdPayload extends HouseholdPayload {
  userId?: string;
  userEmail?: string;
}

export class HouseholdService {
  private baseUrl: string;

  constructor(baseUrl: string = serviceBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // remove trailing slash
  }

  // Create household
  async saveHousehold(payload: ExtendedHouseholdPayload): Promise<string> {
    const response = await axios.post(`${this.baseUrl}/household`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    
    // Handle different response formats
    if (response.data.code && response.data.result) {
      return response.data.result.id || response.data.result;
    }
    return response.data.id || response.data;
  }

  // Get household by id
  async getHousehold(id: string): Promise<HouseholdPayload> {
    const response = await axios.get(`${this.baseUrl}/household/${id}`);
    
    if (response.data.code && response.data.result) {
      return response.data.result;
    }
    return response.data;
  }

  // Get household by user ID
  async getUserHousehold(userId: string): Promise<HouseholdPayload | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/household/user/${userId}`, {
        headers: { 'accept': 'application/json' }
      });
      
      if (response.data.code && response.data.result) {
        return response.data.result;
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No household found for user
      }
      throw error;
    }
  }
  // Update household
  async updateHousehold(id: string, payload: ExtendedHouseholdPayload): Promise<void> {
    await axios.put(`${this.baseUrl}/household/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Delete household
  async deleteHousehold(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/household/${id}`);
  }

  // List households
  async listHouseholds(): Promise<Array<{ id: string; familyDisplayName?: string; gotram: string }>> {
    const response = await axios.get(`${this.baseUrl}/households`);
    
    if (response.data.code && response.data.result) {
      return response.data.result;
    }
    return response.data;
  }
}

export const householdService = new HouseholdService();
