import { api } from './api';

export interface HealthInsuranceData {
  policy: any;
  claims: any[];
  dependents: any[];
  stats: {
    totalCoverage: number;
    usedAmount: number;
    remainingAmount: number;
    approvedClaims: number;
    totalClaims: number;
  };
}

export const healthInsuranceApi = {
  getInsuranceData: async (): Promise<HealthInsuranceData> => {
    const response = await api.get('/health-insurance/data');
    return response.data;
  },

  getHospitals: async (params?: { search?: string; city?: string }) => {
    const response = await api.get('/health-insurance/hospitals', { params });
    return response.data;
  },

  createClaim: async (claimData: any) => {
    const response = await api.post('/health-insurance/claims', claimData);
    return response.data;
  },

  getProviderInfo: async (policyId: number) => {
    const response = await api.get(`/health-insurance/provider/${policyId}`);
    return response.data;
  }
};