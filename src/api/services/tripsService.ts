import api from "../config";
import type { Trip, CreateTripRequest, UpdateTripRequest, ApiResponse } from "../../types";

export const tripsService = {
  // Get all trips
  getAll: async (): Promise<Trip[]> => {
    const response = await api.get<ApiResponse<Trip[]>>("/trips");
    return response.data.data;
  },

  // Get trip by ID
  getById: async (id: number): Promise<Trip> => {
    const response = await api.get<ApiResponse<Trip>>(`/trips/${id}`);
    return response.data.data;
  },

  // Create new trip
  create: async (tripData: CreateTripRequest): Promise<Trip> => {
    const response = await api.post<ApiResponse<Trip>>("/trips", tripData);
    return response.data.data;
  },

  // Update trip
  update: async (id: number, tripData: UpdateTripRequest): Promise<Trip> => {
    const response = await api.put<ApiResponse<Trip>>(`/trips/${id}`, tripData);
    return response.data.data;
  },

  // Delete trip
  delete: async (id: number): Promise<void> => {
    await api.delete(`/trips/${id}`);
  },
};
