import React, { useState } from "react";
import DocumentUploadPanel from "./components/DocumentUploadPanel";
import DocumentsTable from "./components/DocumentsTable";
import DocumentPreviewModal from "./components/DocumentPreviewModal";
import { Document } from "./types";
import styled from "styled-components";

const PageWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EmployeeDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const handleUpload = (doc: Document) => {
    setDocuments((prev) => [...prev, doc]);
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <PageWrapper>
      <DocumentUploadPanel onUpload={handleUpload} />
      <DocumentsTable documents={documents} onView={setPreviewDoc} onDelete={handleDelete} />
      <DocumentPreviewModal visible={!!previewDoc} doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </PageWrapper>
  );
};

export default EmployeeDocuments;
