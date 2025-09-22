export interface Complaint {
  id: string;
  subject: string;
  type: string;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High';
  description: string;
  dateSubmitted: string;
  dateOfIncident?: string;
  assignedTo?: string;
  resolution?: string;
}

export const mockComplaints: Complaint[] = [
  {
    id: '1',
    subject: 'Workplace Harassment',
    type: 'HR',
    status: 'Pending',
    priority: 'High',
    description: 'Detailed description of harassment incident.',
    dateSubmitted: '2023-11-15',
    dateOfIncident: '2023-11-10'
  },
  {
    id: '2',
    subject: 'Policy Violation',
    type: 'Management',
    status: 'Resolved',
    priority: 'Medium',
    description: 'Policy violation regarding work hours.',
    dateSubmitted: '2023-10-20',
    assignedTo: 'HR Manager',
    resolution: 'Issue resolved after discussion.'
  },
  {
    id: '3',
    subject: 'Unsafe Working Conditions',
    type: 'Safety',
    status: 'In Progress',
    priority: 'High',
    description: 'Safety concerns in warehouse area.',
    dateSubmitted: '2023-11-01',
    assignedTo: 'Safety Officer'
  },
  {
    id: '4',
    subject: 'Discrimination Complaint',
    type: 'HR',
    status: 'Pending',
    priority: 'High',
    description: 'Discriminatory practices in promotion decisions.',
    dateSubmitted: '2023-11-12'
  },
  {
    id: '5',
    subject: 'Equipment Malfunction',
    type: 'Technical',
    status: 'Resolved',
    priority: 'Low',
    description: 'Computer equipment not working properly.',
    dateSubmitted: '2023-10-15',
    resolution: 'Equipment replaced.'
  }
];

// TanStack Query functions (commented for future API integration)
export const fetchComplaints = async (): Promise<Complaint[]> => {
  // Replace with actual API call
  // return await api.get('/complaints');
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockComplaints;
};

export const submitComplaint = async (complaintData: Partial<Complaint>): Promise<Complaint> => {
  // Replace with actual API call
  // return await api.post('/complaints', complaintData);
  await new Promise(resolve => setTimeout(resolve, 2000));
  const newComplaint: Complaint = {
    id: Date.now().toString(),
    subject: complaintData.subject || '',
    type: complaintData.type || '',
    status: 'Pending',
    priority: complaintData.priority || 'Medium',
    description: complaintData.description || '',
    dateSubmitted: new Date().toISOString().split('T')[0],
    dateOfIncident: complaintData.dateOfIncident
  };
  return newComplaint;
};