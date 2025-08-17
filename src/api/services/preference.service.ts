import api from "../config";
import type { ApiResponse } from "../../types";
import type { CreatePreferenceRequest, Preference, UpdatePreferenceRequest } from "../../types/preference.types";

export const preferencesService = {
  // Get all preferences
  getAll: async (): Promise<Preference[]> => {
    const response = await api.get<ApiResponse<Preference[]>>("/preferences");
    return response.data.data;
  },

  // Get preference by ID
  getById: async (id: number): Promise<Preference> => {
    const response = await api.get<ApiResponse<Preference>>(`/preferences/${id}`);
    return response.data.data;
  },

  // Create new preference (admin only)
  create: async (prefData: CreatePreferenceRequest): Promise<Preference> => {
    const response = await api.post<ApiResponse<Preference>>("/preferences", prefData);
    return response.data.data;
  },

  // Update preference (admin only)
  update: async (id: number, prefData: UpdatePreferenceRequest): Promise<Preference> => {
    const response = await api.put<ApiResponse<Preference>>(`/preferences/${id}`, prefData);
    return response.data.data;
  },

  // Delete preference (admin only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/preferences/${id}`);
  },

  // Assign preferences to logged-in user
  assign: async (prefs: Preference[]): Promise<ApiResponse<Preference[]>> => {
    const response = await api.post<ApiResponse<Preference[]>>("/preferences/assign", prefs);
    return response.data;
  },
};
