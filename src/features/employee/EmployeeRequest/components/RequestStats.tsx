import React from 'react';
import { Row, Col } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { StateCard } from '../../../../components/StateCard';
import { Request } from '../types';

interface RequestStatsProps {
  requests: Request[];
  isDarkMode: boolean;
}

export const RequestStats: React.FC<RequestStatsProps> = ({ requests, isDarkMode }) => {
  const stats = {
    total: requests.length,
    pending: requests.filter((req) => req.status === 'pending').length,
    approved: requests.filter((req) => req.status === 'approved').length,
    rejected: requests.filter((req) => req.status === 'rejected').length,
    in_progress: requests.filter((req) => req.status === 'in_progress').length,
  };
  return (
    <div style={{
      marginBottom: '24px',
    }}>
    <Row gutter={[24, 24]}>
      <Col xs={12} sm={8} md={6} lg={4}>
        <StateCard
          label="Total"
          value={stats.total}
          icon={<FileTextOutlined />}
          tone="pastelBlue"
        />
      </Col>
      <Col xs={12} sm={8} md={6} lg={5}>
        <StateCard
          label="Approved"
          value={stats.approved}
          icon={<CheckCircleOutlined />}
          tone="pastelGreen"
        />
      </Col>
      <Col xs={12} sm={8} md={6} lg={5}>
        <StateCard
          label="In Progress"
          value={stats.in_progress}
          icon={<ClockCircleOutlined />}
          tone="lightPeach"
        />
      </Col>
      <Col xs={12} sm={12} md={3} lg={5}>
        <StateCard
          label="Pending"
          value={stats.pending}
          icon={<ClockCircleOutlined />}
          tone="softLavender"
        />
      </Col>
      <Col xs={24} sm={12} md={3} lg={5}>
        <StateCard
          label="Rejected"
          value={stats.rejected}
          icon={<CloseCircleOutlined />}
          tone="pastelPink"
        />
      </Col>
    </Row>
    </div>
  );
};