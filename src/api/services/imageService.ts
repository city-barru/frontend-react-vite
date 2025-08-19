import axios from "axios";
import api from "../config";

export interface ImageUploadResponse {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  trip_id: number | null;
  url: string;
  file_name: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number | null;
}

export interface MultipleImageUploadResponse {
  message: string;
  images: ImageUploadResponse[];
}

export interface CoverImageUploadResponse {
  message: string;
  image: ImageUploadResponse;
}

export interface ImageUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface Image {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  trip_id: number | null;
  url: string;
  file_name: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  uploaded_by: number | null;
}

class ImageService {
  // Upload image with progress tracking
  async uploadImage(file: File, tripId?: number, onProgress?: (progress: ImageUploadProgress) => void): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append("images", file);

    if (tripId) {
      formData.append("trip_id", tripId.toString());
    }

    try {
      const response = await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const loaded = progressEvent.loaded;
            const total = progressEvent.total;
            const percentage = Math.round((loaded * 100) / total);

            onProgress({
              loaded,
              total,
              percentage,
            });
          }
        },
      });

      // Return the first image from the array for single file uploads
      return response.data.images[0];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Failed to upload image");
      }
      throw new Error("An unexpected error occurred during image upload");
    }
  }

  // Upload multiple images with progress tracking
  async uploadMultipleImages(files: FileList | File[], tripId?: number, onProgress?: (progress: ImageUploadProgress) => void): Promise<ImageUploadResponse[]> {
    const formData = new FormData();

    // Add all files to the form data
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    if (tripId) {
      formData.append("trip_id", tripId.toString());
    }

    try {
      const response = await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const loaded = progressEvent.loaded;
            const total = progressEvent.total;
            const percentage = Math.round((loaded * 100) / total);

            onProgress({
              loaded,
              total,
              percentage,
            });
          }
        },
      });

      return response.data.images;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Failed to upload images");
      }
      throw new Error("An unexpected error occurred during image upload");
    }
  }

  // Get images by trip ID
  async getImagesByTrip(tripId: number): Promise<Image[]> {
    try {
      const response = await api.get(`/images/trip/${tripId}`);
      return response.data.images;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Failed to fetch trip images");
      }
      throw new Error("An unexpected error occurred while fetching trip images");
    }
  }

  // Get user's uploaded images
  async getMyImages(): Promise<Image[]> {
    try {
      const response = await api.get("/images/my-images");
      return response.data.images;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Failed to fetch your images");
      }
      throw new Error("An unexpected error occurred while fetching your images");
    }
  }

  // Delete image
  async deleteImage(imageId: number): Promise<void> {
    try {
      await api.delete(`/images/${imageId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Failed to delete image");
      }
      throw new Error("An unexpected error occurred while deleting image");
    }
  }

  // Get image URL for display
  getImageUrl(imageUrl: string): string {
    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // If it starts with /uploads/images/, extract filename and use API route
    if (imageUrl.startsWith("/uploads/images/")) {
      const filename = imageUrl.split("/").pop();
      return `http://localhost:8080/api/v1/images/${filename}`;
    }

    // If it starts with /uploads/covers/, extract filename and use API route
    if (imageUrl.startsWith("/uploads/covers/")) {
      const filename = imageUrl.split("/").pop();
      return `http://localhost:8080/api/v1/covers/${filename}`;
    }

    // If it starts with /uploads, try to determine the path
    if (imageUrl.startsWith("/uploads")) {
      return `http://localhost:8080${imageUrl}`;
    }

    // If it's just a filename, assume it's a regular image
    return `http://localhost:8080/api/v1/images/${imageUrl}`;
  }

  // Validate image file
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size too large. Maximum 10MB allowed.",
      };
    }

    return { isValid: true };
  }

  // Upload cover image with progress tracking
  async uploadCoverImage(file: File, onProgress?: (progress: ImageUploadProgress) => void): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append("cover_image", file);

    try {
      const response = await api.post("/images/upload-cover", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.total) {
            const loaded = progressEvent.loaded;
            const total = progressEvent.total;
            const percentage = Math.round((loaded * 100) / total);

            onProgress({
              loaded,
              total,
              percentage,
            });
          }
        },
      });

      return response.data.image;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "Failed to upload cover image");
      }
      throw new Error("An unexpected error occurred during cover image upload");
    }
  }

  // Get cover image URL for display
  getCoverImageUrl(imageUrl: string): string {
    // If it's already a full URL, return as is
    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    // If it starts with /uploads/covers/, extract filename and use API route
    if (imageUrl.startsWith("/uploads/covers/")) {
      const filename = imageUrl.split("/").pop();
      return `http://localhost:8080/api/v1/covers/${filename}`;
    }

    // If it starts with /uploads/images/, extract filename and use API route
    if (imageUrl.startsWith("/uploads/images/")) {
      const filename = imageUrl.split("/").pop();
      return `http://localhost:8080/api/v1/images/${filename}`;
    }

    // If it starts with /uploads, try to determine if it's cover or regular image
    if (imageUrl.startsWith("/uploads")) {
      return `http://localhost:8080${imageUrl}`;
    }

    // If it's just a filename, assume it's a cover image
    return `http://localhost:8080/api/v1/covers/${imageUrl}`;
  }
}

export const imageService = new ImageService();
export default imageService;
