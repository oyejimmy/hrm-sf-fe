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