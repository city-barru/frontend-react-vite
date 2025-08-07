export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: number;
  name: string;
  description: string;
  cover_image: string;
  price: number;
  duration: number;
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
  user_id: number;
  user: User;
  images?: Image[];
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: number;
  trip_id: number;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Role {
  value: string;
  label: string;
  description: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface CreateTripRequest {
  name: string;
  description: string;
  cover_image?: string;
  price: number;
  duration: number;
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
}

export interface UpdateTripRequest {
  name?: string;
  description?: string;
  cover_image?: string;
  price?: number;
  duration?: number;
  start_latitude?: number;
  start_longitude?: number;
  end_latitude?: number;
  end_longitude?: number;
}
