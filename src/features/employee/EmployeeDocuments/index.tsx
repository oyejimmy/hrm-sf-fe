import React, { useState } from 'react';
import { Divider, Row, Col, Button, message, Spin, Input } from 'antd';
import { Plus, Search } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Wrapper } from '../../../components/Wrapper';
import { useTheme } from '../../../contexts/ThemeContext';
import HeaderComponent from '../../../components/PageHeader';
import { DocumentStats } from './components/DocumentStats';
import { DocumentTable } from './components/DocumentTable';
import { DocumentPreview } from './components/DocumentPreview';
import { CategoryList } from './components/CategoryList';

import { DocumentUploadModal } from './components/DocumentUploadModal';
import { fetchDocuments, fetchSharedDocuments, uploadDocument, Document } from './mockData';
import { DocumentCard } from './styles';

const EmployeeDocuments = () => {
  const { isDarkMode } = useTheme();
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All Documents');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments
  });

  const { data: sharedDocuments = [], isLoading: sharedLoading } = useQuery({
    queryKey: ['sharedDocuments'],
    queryFn: fetchSharedDocuments
  });

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      message.success('Document uploaded successfully!');
    },
    onError: () => {
      message.error('Failed to upload document');
    }
  });

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setPreviewVisible(true);
  };

  const handleClosePreview = () => {
    setPreviewVisible(false);
    setSelectedDocument(null);
  };

  const handleUpload = (files: any) => {
    files.forEach((file: any) => {
      uploadMutation.mutate({
        name: file.name,
        type: file.type?.includes('pdf') ? 'pdf' : 'word',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      });
    });
  };

  const filteredDocuments = documents
    .filter(doc => currentCategory === 'All Documents' || doc.category === currentCategory)
    .filter(doc => 
      doc.name.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchText.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchText.toLowerCase())
    );

  if (documentsLoading || sharedLoading) {
    return (
      <Wrapper isDarkMode={isDarkMode}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Document Management"
        subtitle="Manage and organize your documents efficiently"
        breadcrumbItems={[{ title: 'Home', href: '/' }]}
        extraButtons={[
          <Button
            key="upload"
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setUploadModalVisible(true)}
          >
            Upload Document
          </Button>
        ]}
      />
      
      <div style={{ marginBottom: 16 }}>
        <DocumentStats 
          documents={documents} 
          sharedCount={sharedDocuments.length} 
        />
      </div>
      
      <Divider />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={18}>
          <DocumentCard 
            title="My Documents" 
            isDarkMode={isDarkMode}
            extra={
              <Input
                placeholder="Search..."
                prefix={<Search size={16} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%', maxWidth: 250 }}
              />
            }
          >
            <DocumentTable 
              documents={filteredDocuments} 
              onViewDocument={handleViewDocument}
            />
            <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
              {searchText 
                ? `Search "${searchText}" from ${documents.length} items showing ${filteredDocuments.length} results`
                : `Showing ${filteredDocuments.length} of ${documents.length} items`
              }
            </div>
          </DocumentCard>
        </Col>
        <Col xs={24} xl={6}>
          <CategoryList
            currentCategory={currentCategory}
            onCategoryChange={setCurrentCategory}
          />
        </Col>
      </Row>
      

      
      <DocumentPreview
        document={selectedDocument}
        visible={previewVisible}
        onClose={handleClosePreview}
      />
      
      <DocumentUploadModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onUpload={handleUpload}
      />
    </Wrapper>
  );
};

export default EmployeeDocuments;