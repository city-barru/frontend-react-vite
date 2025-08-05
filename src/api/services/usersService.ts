import api from "../config";
import type { User, ApiResponse } from "../../types";

export const usersService = {
  // Get all users (admin only)
  getAll: async (): Promise<User[]> => {
    const response = await api.get<ApiResponse<User[]>>("/users");
    return response.data.data;
  },

  // Get user by ID
  getById: async (id: number): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  // Update user
  update: async (id: number, userData: { name: string }): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, userData);
    return response.data.data;
  },

  // Delete user (admin only)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
