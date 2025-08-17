export interface Preference {
  ID: number;
  name: string;
}

export interface CreatePreferenceRequest {
  name: string;
}

export interface UpdatePreferenceRequest {
  name: string;
}

export interface AssignPreferenceRequest {
  preferences: Preference[];
}

export interface PreferenceResponse {
  message: string;
  error: string | null;
  data: Preference[];
}
