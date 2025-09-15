import { ReactNode } from 'react';
import dayjs, { Dayjs } from 'dayjs';

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  experienceLevel: 'Entry' | 'Junior' | 'Mid' | 'Senior';
  salaryRange: [number, number];
  deadline: string;
  status: 'Active' | 'Inactive';
  requiredSkills: string[];
  jobDescription: string;
  applications: number;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface FilterOptions {
  department: string;
  employmentType: string;
  experienceLevel: string;
  status: string;
  location: string;
  dateRange: [Dayjs, Dayjs] | null;
}

export interface JobFormModalProps {
  visible: boolean;
  editingJob: JobPosting | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  form: any;
}

export interface JobPreviewModalProps {
  visible: boolean;
  job: JobPosting | null;
  onCancel: () => void;
  onEdit: () => void;
}

export interface RecruitmentStats {
  total: number;
  active: number;
  inactive: number;
  totalApplications: number;
}