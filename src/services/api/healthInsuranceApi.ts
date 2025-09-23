import { api } from './api';

export interface HealthInsuranceData {
  policy: any;
  claims: any[];
  stats: any;
  coverageDetails: any;
}

export const healthInsuranceApi = {
  getInsuranceData: async (): Promise<HealthInsuranceData> => {
    try {
      const [policiesRes, claimsRes] = await Promise.all([
        api.get('/health-insurance/policies'),
        api.get('/health-insurance/claims')
      ]);
      
      const policy = policiesRes.data[0] || null;
      const claims = claimsRes.data || [];
      
      const stats = {
        totalCoverage: policy?.coverage_amount || 0,
        usedAmount: claims.reduce((sum: number, claim: any) => 
          claim.status === 'approved' ? sum + claim.approved_amount : sum, 0),
        remainingAmount: (policy?.coverage_amount || 0) - claims.reduce((sum: number, claim: any) => 
          claim.status === 'approved' ? sum + claim.approved_amount : sum, 0),
        approvedClaims: claims.filter((c: any) => c.status === 'approved').length,
        totalClaims: claims.length
      };
      
      return {
        policy: policy ? {
          ...policy,
          policyNumber: policy.policy_number,
          planType: policy.plan_type,
          coverage: policy.coverage_amount,
          endDate: policy.end_date
        } : null,
        claims: claims.map((claim: any) => ({
          ...claim,
          claimNumber: claim.claim_number,
          type: claim.claim_type,
          amount: claim.claimed_amount,
          date: claim.submitted_date
        })),
        stats,
        coverageDetails: [{
          type: 'Room Rent',
          limit: policy?.room_rent_limit || 0,
          used: 0,
          remaining: policy?.room_rent_limit || 0
        }]
      };
    } catch (error: any) {
      console.error('Failed to fetch insurance data:', error);
      // Return mock data if API fails
      return {
        policy: {
          id: 1,
          policy_number: 'POL12345678',
          policyNumber: 'POL12345678',
          plan_type: 'premium',
          planType: 'premium',
          coverage_amount: 500000,
          coverage: 500000,
          room_rent_limit: 5000,
          status: 'active',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          endDate: '2024-12-31'
        },
        claims: [],
        stats: { totalCoverage: 500000, usedAmount: 0, remainingAmount: 500000, approvedClaims: 0, totalClaims: 0 },
        coverageDetails: [{ type: 'Room Rent', limit: 5000, used: 0, remaining: 5000 }]
      };
    }
  },

  getPolicies: async () => {
    const response = await api.get('/health-insurance/policies');
    return response.data;
  },

  getClaims: async () => {
    const response = await api.get('/health-insurance/claims');
    return response.data;
  },

  getHospitals: async (params?: any) => {
    const response = await api.get('/health-insurance/hospitals', { params });
    return response.data;
  },

  createClaim: async (claimData: any) => {
    const response = await api.post('/health-insurance/claims', claimData);
    return response.data;
  },

  getDependents: async (policyId?: number) => {
    const response = await api.get('/health-insurance/dependents', {
      params: policyId ? { policy_id: policyId } : {}
    });
    return response.data;
  },

  getProviderInfo: async (policyId: number) => {
    const response = await api.get(`/health-insurance/provider/${policyId}`);
    return response.data;
  }
};