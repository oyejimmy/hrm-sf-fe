// Types for Training Management Module

export interface Training {
  id: string;
  employeeName: string;
  department: string;
  track: string;
  status: "Not Started" | "In Progress" | "Completed";
  progress: number; // percentage
  deadline?: string;
}

export interface RoadmapTrack {
  id: string;
  title: string;
  description: string;
  milestones: RoadmapModule[];
}

export interface RoadmapModule {
  id: string;
  topic: string;
  description: string;
  resources: string[];
  estimatedTime: string;
  completed: boolean;
}
