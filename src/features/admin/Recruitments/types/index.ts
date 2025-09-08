// Shared TypeScript types for Recruitments module

// Job posting type
export interface Job {
  id: number;
  title: string;
  department: string;
  location: "Remote" | "On-site" | "Hybrid";
  employmentType: "Full-time" | "Part-time" | "Contract";
  experienceLevel: "Junior" | "Mid" | "Senior";
  salaryRange?: string;
  description: string;
  skills: string[];
  deadline: string; // ISO Date string
  status: "Open" | "Closed" | "Draft";
  applicants: Candidate[];
}

// Candidate type
export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  coverLetter?: string;
  skills: string[];
  experience: string;
  status: "Applied" | "Interview" | "Hired" | "Rejected";
}
