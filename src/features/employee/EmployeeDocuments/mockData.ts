export interface Document {
  id: number;
  name: string;
  type: 'pdf' | 'image' | 'word' | 'excel' | 'archive';
  category: string;
  uploadDate: string;
  status: 'Approved' | 'Pending Review' | 'Rejected';
  size: string;
  sharedWith: string[];
  isImportant: boolean;
  isPrivate: boolean;
  versions: number;
}

export interface Category {
  name: string;
  count: number;
  icon: React.ReactNode;
}

export interface SharedDocument {
  id: number;
  name: string;
  sharedBy: string;
  sharedDate: string;
  type: string;
}

export const mockDocuments: Document[] = [
  {
    id: 1,
    name: 'Employment Contract.pdf',
    type: 'pdf',
    category: 'Employment',
    uploadDate: '2023-05-15',
    status: 'Approved',
    size: '2.4 MB',
    sharedWith: ['HR Department'],
    isImportant: true,
    isPrivate: true,
    versions: 2
  },
  {
    id: 2,
    name: 'ID Document.jpg',
    type: 'image',
    category: 'Personal',
    uploadDate: '2023-06-20',
    status: 'Approved',
    size: '1.2 MB',
    sharedWith: ['HR Department'],
    isImportant: true,
    isPrivate: true,
    versions: 1
  },
  {
    id: 3,
    name: 'Training Certificate.pdf',
    type: 'pdf',
    category: 'Training',
    uploadDate: '2023-07-10',
    status: 'Approved',
    size: '0.8 MB',
    sharedWith: ['Manager'],
    isImportant: false,
    isPrivate: false,
    versions: 1
  },
  {
    id: 4,
    name: 'Expense Report.xlsx',
    type: 'excel',
    category: 'Finance',
    uploadDate: '2023-08-05',
    status: 'Pending Review',
    size: '0.5 MB',
    sharedWith: ['Finance Department'],
    isImportant: false,
    isPrivate: false,
    versions: 1
  },
  {
    id: 5,
    name: 'Company Policy.pdf',
    type: 'pdf',
    category: 'HR',
    uploadDate: '2023-01-15',
    status: 'Approved',
    size: '5.7 MB',
    sharedWith: ['All Employees'],
    isImportant: true,
    isPrivate: false,
    versions: 3
  },
  {
    id: 6,
    name: 'Performance Review.docx',
    type: 'word',
    category: 'HR',
    uploadDate: '2023-09-12',
    status: 'Rejected',
    size: '0.3 MB',
    sharedWith: ['HR Department'],
    isImportant: false,
    isPrivate: true,
    versions: 1
  },
  {
    id: 7,
    name: 'Tax Documents.pdf',
    type: 'pdf',
    category: 'Finance',
    uploadDate: '2023-03-20',
    status: 'Approved',
    size: '1.8 MB',
    sharedWith: ['Finance Department'],
    isImportant: true,
    isPrivate: true,
    versions: 1
  },
  {
    id: 8,
    name: 'Safety Training.pdf',
    type: 'pdf',
    category: 'Training',
    uploadDate: '2023-04-10',
    status: 'Approved',
    size: '2.1 MB',
    sharedWith: ['Manager'],
    isImportant: false,
    isPrivate: false,
    versions: 2
  },
  {
    id: 9,
    name: 'Passport Copy.jpg',
    type: 'image',
    category: 'Personal',
    uploadDate: '2023-02-28',
    status: 'Approved',
    size: '0.9 MB',
    sharedWith: ['HR Department'],
    isImportant: true,
    isPrivate: true,
    versions: 1
  },
  {
    id: 10,
    name: 'Project Report.docx',
    type: 'word',
    category: 'Employment',
    uploadDate: '2023-11-15',
    status: 'Pending Review',
    size: '1.5 MB',
    sharedWith: ['Manager'],
    isImportant: false,
    isPrivate: false,
    versions: 1
  }
];

export const mockCategories: Category[] = [
  { name: 'All Documents', count: 10, icon: null },
  { name: 'Personal', count: 2, icon: null },
  { name: 'Employment', count: 2, icon: null },
  { name: 'HR', count: 2, icon: null },
  { name: 'Finance', count: 2, icon: null },
  { name: 'Training', count: 2, icon: null }
];

export const mockSharedDocuments: SharedDocument[] = [
  {
    id: 101,
    name: 'Team Meeting Notes.docx',
    sharedBy: 'Sarah Johnson',
    sharedDate: '2023-09-15',
    type: 'word'
  },
  {
    id: 102,
    name: 'Project Timeline.pdf',
    sharedBy: 'Michael Chen',
    sharedDate: '2023-09-10',
    type: 'pdf'
  },
  {
    id: 103,
    name: 'Company Event Photos.zip',
    sharedBy: 'HR Department',
    sharedDate: '2023-09-05',
    type: 'archive'
  },
  {
    id: 104,
    name: 'Budget Spreadsheet.xlsx',
    sharedBy: 'Finance Team',
    sharedDate: '2023-11-01',
    type: 'excel'
  },
  {
    id: 105,
    name: 'Training Materials.pdf',
    sharedBy: 'Training Dept',
    sharedDate: '2023-10-20',
    type: 'pdf'
  }
];

// TanStack Query functions
export const fetchDocuments = async (): Promise<Document[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockDocuments;
};

export const fetchSharedDocuments = async (): Promise<SharedDocument[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockSharedDocuments;
};

export const uploadDocument = async (documentData: any): Promise<Document> => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const newDoc: Document = {
    id: Date.now(),
    name: documentData.name,
    type: documentData.type || 'pdf',
    category: documentData.category || 'Personal',
    uploadDate: new Date().toISOString().split('T')[0],
    status: 'Pending Review',
    size: documentData.size || '1.0 MB',
    sharedWith: [],
    isImportant: false,
    isPrivate: true,
    versions: 1
  };
  return newDoc;
};