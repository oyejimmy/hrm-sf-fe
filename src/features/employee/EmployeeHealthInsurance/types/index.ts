export interface HealthInsurancePolicy {
  id: number;
  policy_number: string;
  plan_type: string;
  coverage_amount: number;
  room_rent_limit: number;
  start_date: string;
  end_date: string;
  status: string;
}

export interface InsuranceClaim {
  id: number;
  claim_number: string;
  patient_name: string;
  patient_relationship: string;
  claim_type: string;
  treatment_date: string;
  diagnosis: string;
  total_bill_amount: number;
  claimed_amount: number;
  approved_amount?: number;
  status: string;
  submitted_date: string;
}

export interface InsuranceDependent {
  id: number;
  name: string;
  relationship: string;
  date_of_birth: string;
  gender: string;
  id_number?: string;
  is_active: boolean;
}

export interface PanelHospital {
  id: number;
  name: string;
  address: string;
  city: string;
  phone?: string;
  minimum_room_entitlement?: number;
  is_active: boolean;
}

export interface CoverageDetail {
  type: string;
  limit: number;
  used: number;
  remaining: number;
}