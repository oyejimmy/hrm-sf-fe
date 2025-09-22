import React from 'react';
import { Row, Col } from 'antd';
import { FileText, CheckCircle, Clock, Users } from 'lucide-react';
import { StateCard } from '../../../../components/StateCard';
import { Document } from '../mockData';

interface DocumentStatsProps {
  documents: Document[];
  sharedCount: number;
}

export const DocumentStats: React.FC<DocumentStatsProps> = ({ documents, sharedCount }) => {
  const totalDocuments = documents.length;
  const approvedDocuments = documents.filter(doc => doc.status === 'Approved').length;
  const pendingDocuments = documents.filter(doc => doc.status === 'Pending Review').length;

  return (
    <Row gutter={16}>
      <Col xs={24} sm={12} md={6}>
        <StateCard
          label="Total Documents"
          value={totalDocuments}
          icon={<FileText />}
          tone="pastelBlue"
          colorKey="total-documents"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StateCard
          label="Approved"
          value={approvedDocuments}
          icon={<CheckCircle />}
          tone="pastelGreen"
          colorKey="approved-documents"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StateCard
          label="Pending Review"
          value={pendingDocuments}
          icon={<Clock />}
          tone="lightPeach"
          colorKey="pending-documents"
        />
      </Col>
      <Col xs={24} sm={12} md={6}>
        <StateCard
          label="Shared With Me"
          value={sharedCount}
          icon={<Users />}
          tone="softLavender"
          colorKey="shared-documents"
        />
      </Col>
    </Row>
  );
};