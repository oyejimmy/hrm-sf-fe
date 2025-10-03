export interface OnboardingData {
  title?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
  profile_picture?: string;
  department: string;
  position: string;
  hire_date: string;
  employment_type: string;
  employee_id?: string;
  manager?: string;
  employment_status: string;
  work_schedule: string;
  work_location: string;
  qualification: string;
  teamSize?: number;
  languagesKnown?: string[];
  gender: string;
  religion?: string;
  date_of_birth: string;
  marital_status: string;
  blood_group: string;
  nationality: string;
  personal_email: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_work_phone?: string;
  emergency_contact_relationship: string;
  emergency_contact_home_phone?: string;
  emergency_contact_phone: string;
  emergency_contact_address: string;
  university?: string;
  graduation_year?: number;
  certifications?: string;
  skills_summary?: string;
  technical_skills?: string[];
}

export interface UserInfoFormData {
  first_name: string;
  last_name: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  gender: string;
  marital_status: string;
  blood_group?: string;
}