import React from 'react';
import { Row, Col } from 'antd';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { StateCard } from '../../../../components/StateCard';
import { Complaint } from '../mockData';

interface ComplaintStatsProps {
  complaints: Complaint[];
}

export const ComplaintStats: React.FC<ComplaintStatsProps> = ({ complaints }) => {
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} sm={6}>
        <StateCard
          label="Total Complaints"
          value={totalComplaints}
          icon={<FileText />}
          tone="pastelBlue"
        />
      </Col>
      <Col xs={12} sm={6}>
        <StateCard
          label="Pending"
          value={pendingComplaints}
          icon={<Clock />}
          tone="lightPeach"
        />
      </Col>
      <Col xs={12} sm={6}>
        <StateCard
          label="In Progress"
          value={inProgressComplaints}
          icon={<Clock />}
          tone="softLavender"
        />
      </Col>
      <Col xs={12} sm={6}>
        <StateCard
          label="Resolved"
          value={resolvedComplaints}
          icon={<CheckCircle />}
          tone="pastelGreen"
        />
      </Col>
    </Row>
  );
};