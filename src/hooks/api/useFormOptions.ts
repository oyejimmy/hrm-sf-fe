import { useQuery } from '@tanstack/react-query';

export const useFormOptions = () => {
  return useQuery({
    queryKey: ['form-options'],
    queryFn: async () => {
      // Return form options that should come from backend
      // For now, keeping as static data but structured for easy backend integration
      return {
        titles: [
          { value: 'Mr', label: 'Mr' },
          { value: 'Mrs', label: 'Mrs' },
          { value: 'Ms', label: 'Ms' },
          { value: 'Dr', label: 'Dr' },
          { value: 'Prof', label: 'Prof' },
          { value: 'Eng', label: 'Eng' },
        ],
        roles: [
          { value: 'employee', label: 'Employee' },
          { value: 'team_lead', label: 'Team Lead' },
          { value: 'hr', label: 'HR' },
          { value: 'admin', label: 'Admin' },
        ],
        emailDomains: [
          { value: '@smartforum.org', label: '@smartforum.org' },
          { value: '@3gca.org', label: '@3gca.org' },
        ],
        employmentTypes: [
          { value: 'permanent', label: 'Permanent' },
          { value: 'contract', label: 'Contract' },
          { value: 'temporary', label: 'Temporary' },
          { value: 'internship', label: 'Internship' },
          { value: 'freelance', label: 'Freelance' },
          { value: 'consultant', label: 'Consultant' },
        ],
        employmentStatuses: [
          { value: 'full_time', label: 'Full Time' },
          { value: 'part_time', label: 'Part Time' },
          { value: 'contract', label: 'Contract' },
          { value: 'intern', label: 'Intern' },
        ],
        workLocations: [
          { value: 'Islamabad Office', label: 'Islamabad Office' },
          { value: 'Peshawar Office', label: 'Peshawar Office' },
          { value: 'Dubai Office', label: 'Dubai Office' },
          { value: 'Lahore Office', label: 'Lahore Office' },
          { value: 'Karachi Office', label: 'Karachi Office' },
        ],
        workTypes: [
          { value: 'office', label: 'Office' },
          { value: 'remote', label: 'Remote' },
          { value: 'hybrid', label: 'Hybrid' },
        ],
        workSchedules: [
          { value: 'Standard (9:00 AM - 6:00 PM)', label: 'Standard (9:00 AM - 6:00 PM)' },
          { value: 'Flexible', label: 'Flexible' },
          { value: 'Shift Work', label: 'Shift Work' },
          { value: 'Morning Shift (6:00 AM - 2:00 PM)', label: 'Morning Shift (6:00 AM - 2:00 PM)' },
          { value: 'Evening Shift (2:00 PM - 10:00 PM)', label: 'Evening Shift (2:00 PM - 10:00 PM)' },
          { value: 'Night Shift (10:00 PM - 6:00 AM)', label: 'Night Shift (10:00 PM - 6:00 AM)' },
        ],
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};