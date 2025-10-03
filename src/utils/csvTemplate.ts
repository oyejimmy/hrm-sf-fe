// CSV template for employee import
export const CSV_TEMPLATE_HEADERS = [
  'title',
  'first_name',
  'last_name',
  'email',
  'phone',
  'employee_id',
  'department',
  'position',
  'employment_type',
  'employment_status',
  'work_location',
  'work_type',
  'work_schedule',
  'hire_date',
  'salary',
  'role'
];

export const CSV_TEMPLATE_SAMPLE_DATA = [
  {
    title: 'Mr',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@smartforum.org',
    phone: '+923001234567',
    employee_id: 'EMP001',
    department: 'Software Development',
    position: 'Software Engineer',
    employment_type: 'permanent',
    employment_status: 'full_time',
    work_location: 'Islamabad Office',
    work_type: 'office',
    work_schedule: 'Standard (9:00 AM - 6:00 PM)',
    hire_date: '2024-01-15',
    salary: '80000',
    role: 'employee'
  }
];

export const generateCSVTemplate = () => {
  const headers = CSV_TEMPLATE_HEADERS.join(',');
  const sampleRow = CSV_TEMPLATE_SAMPLE_DATA.map(row => 
    CSV_TEMPLATE_HEADERS.map(header => row[header as keyof typeof row] || '').join(',')
  ).join('\n');
  
  return `${headers}\n${sampleRow}`;
};

export const downloadCSVTemplate = () => {
  const csvContent = generateCSVTemplate();
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};