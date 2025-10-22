import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import api from '../../services/api/api';
import { API_ENDPOINTS } from '../../services/api/endpoints';
import { Asset, AssetRequest, PaginationParams, FilterParams } from '../../services/api/types';

export const useAssets = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['assets', params],
    queryFn: async (): Promise<Asset[]> => {
      const response = await api.get(API_ENDPOINTS.ASSETS.BASE, { params });
      return response.data;
    },
  });
};

export const useAsset = (id: string) => {
  return useQuery({
    queryKey: ['asset', id],
    queryFn: async (): Promise<Asset> => {
      const response = await api.get(API_ENDPOINTS.ASSETS.BY_ID(id));
      return response.data;
    },
    enabled: !!id,
  });
};

export const useAssetRequests = (params?: PaginationParams & FilterParams) => {
  return useQuery({
    queryKey: ['asset-requests', params],
    queryFn: async (): Promise<AssetRequest[]> => {
      const response = await api.get(API_ENDPOINTS.ASSETS.REQUESTS, { params });
      return response.data;
    },
  });
};

export const useCreateAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (assetData: Partial<Asset>) => {
      const response = await api.post(API_ENDPOINTS.ASSETS.BASE, assetData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      message.success('Asset created successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to create asset');
    },
  });
};

export const useCreateAssetRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (requestData: Partial<AssetRequest>) => {
      const response = await api.post(API_ENDPOINTS.ASSETS.REQUESTS, requestData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-requests'] });
      message.success('Asset request submitted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to submit asset request');
    },
  });
};

export const useApproveAssetRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put(API_ENDPOINTS.ASSETS.APPROVE_REQUEST(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-requests'] });
      message.success('Asset request approved successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to approve asset request');
    },
  });
};

export const useRejectAssetRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put(API_ENDPOINTS.ASSETS.REJECT_REQUEST(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset-requests'] });
      message.success('Asset request rejected successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to reject asset request');
    },
  });
};

// Employee-specific hooks
export const useMyAssets = () => {
  return useQuery({
    queryKey: ['my-assets'],
    queryFn: async (): Promise<Asset[]> => {
      const response = await api.get(API_ENDPOINTS.ASSETS.MY_ASSETS);
      return response.data;
    },
  });
};

export const useMyAssetRequests = () => {
  return useQuery({
    queryKey: ['my-asset-requests'],
    queryFn: async (): Promise<AssetRequest[]> => {
      const response = await api.get(API_ENDPOINTS.ASSETS.MY_REQUESTS);
      return response.data;
    },
  });
};

export const useReturnAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { asset_id: number; reason: string }) => {
      const response = await api.post(API_ENDPOINTS.ASSETS.RETURN, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-assets'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      message.success('Asset return request submitted successfully');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to submit return request');
    },
  });
};

export const useAssetStats = () => {
  return useQuery({
    queryKey: ['asset-stats'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ASSETS.STATS);
      return response.data;
    },
  });
};

export const useAssetActivity = () => {
  return useQuery({
    queryKey: ['asset-activity'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ASSETS.ACTIVITY);
      return response.data;
    },
  });
};



export const useAvailableAssets = () => {
  return useQuery({
    queryKey: ['available-assets'],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.ASSETS.AVAILABLE);
      return response.data;
    },
  });
};