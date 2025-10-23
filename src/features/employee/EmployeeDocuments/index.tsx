import React, { useState } from "react";
import { Divider, Row, Col, Button, message, Spin, Input } from "antd";
import { Plus, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Wrapper } from "../../../components/Wrapper";
import { useTheme } from "../../../contexts/ThemeContext";
import HeaderComponent from "../../../components/PageHeader";
import { DocumentStats } from "./components/DocumentStats";
import { DocumentTable } from "./components/DocumentTable";
import { DocumentPreview } from "./components/DocumentPreview";
import { CategoryList } from "./components/CategoryList";
import { DocumentUploadModal } from "./components/DocumentUploadModal";
import { DocumentCard } from "./styles";
import { useUploadDocument } from "../../../hooks/api/useDocuments";
import { Document, mockDocuments } from "./mockData";

const EmployeeDocuments = () => {
  const { isDarkMode } = useTheme();
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("All Documents");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const documents = mockDocuments;
  const documentsLoading = false;
  const uploadMutation = useUploadDocument();

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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', file.type?.includes("pdf") ? "pdf" : "document");
      formData.append('category', currentCategory !== "All Documents" ? currentCategory : "Personal");
      uploadMutation.mutate(formData);
    });
  };

  const filteredDocuments = documents
    .filter(
      (doc) =>
        currentCategory === "All Documents" || doc.category === currentCategory
    )
    .filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchText.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchText.toLowerCase())
    );

  if (documentsLoading) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Spin size="large" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Document Management"
        subtitle="Manage and organize your documents efficiently"
        breadcrumbItems={[
          { title: "Dashboard", href: "/" },
          { title: "Document Management" },
        ]}
        extraButtons={[
          <Button
            key="upload"
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setUploadModalVisible(true)}
          >
            Upload Document
          </Button>,
        ]}
      />

      <div style={{ marginBottom: 16 }}>
        <DocumentStats
          documents={documents}
          sharedCount={0}
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
                style={{ width: "100%", maxWidth: 250 }}
              />
            }
          >
            <DocumentTable
              documents={filteredDocuments}
              onViewDocument={handleViewDocument}
            />
            <div style={{ marginTop: 8, color: "#666", fontSize: "12px" }}>
              {searchText
                ? `Search "${searchText}" from ${documents.length} items showing ${filteredDocuments.length} results`
                : `Showing ${filteredDocuments.length} of ${documents.length} items`}
            </div>
          </DocumentCard>
        </Col>
        <Col xs={24} xl={6}>
          <CategoryList
            currentCategory={currentCategory}
            onCategoryChange={setCurrentCategory}
            documents={documents}
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
