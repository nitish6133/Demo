import axios from "axios";
import type { SchoolProfile, SchoolProfileResponse } from "../types/schoolProfile";
import { serviceBaseUrl } from "../constants/appConstants";


export const schoolProfileService = {
  async createSchoolProfile(profile: SchoolProfile): Promise<SchoolProfileResponse> {
    const res = await axios.post(`${serviceBaseUrl}/schoolProfile`, profile, {
      headers: { "Content-Type": "application/json" }
    });
    return res.data;
  },

  async getAllSchoolProfiles(): Promise<SchoolProfileResponse> {
    const res = await axios.get(`${serviceBaseUrl}/schoolProfile`);
    return res.data;
  },

  async getSchoolProfile(): Promise<SchoolProfileResponse> {
    const res = await axios.get(`${serviceBaseUrl}/schoolProfile`, {
    });
    return res.data;
  },

  async updateSchoolProfile(schoolId: string, profile: Partial<SchoolProfile>): Promise<SchoolProfileResponse> {
    const res = await axios.put(`${serviceBaseUrl}/schoolProfile/update`, profile, {
      params: { schoolId },
      headers: { "Content-Type": "application/json" }
    });
    return res.data;
  },

  async deleteSchoolProfile(schoolId: string): Promise<SchoolProfileResponse> {
    const res = await axios.delete(`${serviceBaseUrl}/schoolProfile/delete`, {
      params: { schoolId }
    });
    return res.data;
  }  
};