// services/householdService.ts
import axios from "axios";
import type { HouseholdPayload } from "../types/household";
import { serviceBaseUrl } from "../constants/appConstants";


export class HouseholdService {
  private baseUrl: string;

  constructor(baseUrl: string = serviceBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // remove trailing slash
  }

  // Create household
  async saveHousehold(payload: HouseholdPayload): Promise<string> {
    const response = await axios.post(`${this.baseUrl}/household`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    // assuming backend returns { id: string, ... }
    return response.data.id;
  }

  // Get household by id
  async getHousehold(id: string): Promise<HouseholdPayload> {
    const response = await axios.get(`${this.baseUrl}/household/${id}`);
    return response.data;
  }

  // Update household
  async updateHousehold(id: string, payload: HouseholdPayload): Promise<void> {
    await axios.put(`${this.baseUrl}/household/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Delete household
  async deleteHousehold(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/household/${id}`);
  }

  // List households
  async listHouseholds(): Promise<Array<{ id: string; familyDisplayName: string; gotram: string }>> {
    const response = await axios.get(`${this.baseUrl}/households`);
    return response.data;
  }
}

export const householdService = new HouseholdService();
