// User Roles
export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  TEAM_LEAD = 'team_lead',
  EMPLOYEE = 'employee'
}

// User Status
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// Employment Status
export enum EmploymentStatus {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern'
}

// Attendance Status
export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  HALF_DAY = 'half_day',
  ON_LEAVE = 'on_leave'
}

// Leave Types
export enum LeaveType {
  SICK_LEAVE = 'sick_leave',
  ANNUAL_LEAVE = 'annual_leave',
  PERSONAL_LEAVE = 'personal_leave',
  MATERNITY_LEAVE = 'maternity_leave',
  PATERNITY_LEAVE = 'paternity_leave',
  EMERGENCY_LEAVE = 'emergency_leave',
  UNPAID_LEAVE = 'unpaid_leave'
}

// Leave Status
export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

// Performance Rating
export enum PerformanceRating {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  SATISFACTORY = 'satisfactory',
  NEEDS_IMPROVEMENT = 'needs_improvement',
  UNSATISFACTORY = 'unsatisfactory'
}

// Training Status
export enum TrainingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Document Types
export enum DocumentType {
  CONTRACT = 'contract',
  ID_PROOF = 'id_proof',
  ADDRESS_PROOF = 'address_proof',
  EDUCATIONAL_CERTIFICATE = 'educational_certificate',
  EXPERIENCE_CERTIFICATE = 'experience_certificate',
  MEDICAL_CERTIFICATE = 'medical_certificate',
  LEAVE_DOCUMENT = 'leave_document',
  PERFORMANCE_REVIEW = 'performance_review',
  TRAINING_CERTIFICATE = 'training_certificate',
  OTHER = 'other'
}

// Notification Types
export enum NotificationType {
  LEAVE_REQUEST = 'leave_request',
  LEAVE_APPROVAL = 'leave_approval',
  ATTENDANCE_REMINDER = 'attendance_reminder',
  TRAINING_ASSIGNMENT = 'training_assignment',
  PERFORMANCE_REVIEW = 'performance_review',
  ANNOUNCEMENT = 'announcement',
  SYSTEM_ALERT = 'system_alert'
}

// Notification Status
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

// Gender
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// Marital Status
export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated'
}

// Department
export enum Department {
  HUMAN_RESOURCES = 'human_resources',
  INFORMATION_TECHNOLOGY = 'information_technology',
  FINANCE = 'finance',
  MARKETING = 'marketing',
  SALES = 'sales',
  OPERATIONS = 'operations',
  CUSTOMER_SERVICE = 'customer_service',
  RESEARCH_DEVELOPMENT = 'research_development',
  LEGAL = 'legal',
  ADMINISTRATION = 'administration'
}

// Position Level
export enum PositionLevel {
  ENTRY_LEVEL = 'entry_level',
  JUNIOR = 'junior',
  MID_LEVEL = 'mid_level',
  SENIOR = 'senior',
  LEAD = 'lead',
  MANAGER = 'manager',
  DIRECTOR = 'director',
  EXECUTIVE = 'executive'
}

// Work Location
export enum WorkLocation {
  OFFICE = 'office',
  REMOTE = 'remote',
  HYBRID = 'hybrid',
  FIELD = 'field'
}

// Work Schedule
export enum WorkSchedule {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  FLEXIBLE = 'flexible',
  SHIFT_WORK = 'shift_work',
  CONTRACT = 'contract'
}
