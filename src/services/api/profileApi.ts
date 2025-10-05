import { api } from './api';

export interface UpdateProfileImagesRequest {
  avatar?: string | null;
  coverImage?: string | null;
  coverOffset?: number;
  profileCrop?: { scale: number; offsetX: number; offsetY: number };
}

export interface ProfileImageResponse {
  success: boolean;
  message: string;
  data?: {
    avatar?: string;
    coverImage?: string;
  };
}

export const profileApi = {
  // Update profile images
  updateProfileImages: async (data: UpdateProfileImagesRequest): Promise<ProfileImageResponse> => {
    try {
      const response = await api.put('/api/employees/me/profile-images', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile images');
    }
  },

  // Get current profile data
  getProfile: async () => {
    try {
      const response = await api.get('/api/employees/me/profile');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile data');
    }
  },

  // Upload image file (if you want to handle file uploads separately)
  uploadImage: async (file: File, type: 'avatar' | 'cover'): Promise<{ url: string }> => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', type);
      
      const response = await api.post('/api/employees/me/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  },
};

export default profileApi;