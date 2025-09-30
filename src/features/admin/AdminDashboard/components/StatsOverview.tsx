import React from 'react';
import { Row, Col } from 'antd';
import { TeamOutlined, UserOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { StateCard } from '../../../../components/StateCard';
import { AdminDashboardStats } from '../../../../services/api/types';

interface StatsOverviewProps {
  stats: AdminDashboardStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} lg={6}>
        <StateCard
          label="Total Employees"
          value={stats.employees.total}
          icon={<TeamOutlined />}
          description={`${stats.employees.active} active`}
          tone="pastelBlue"
          iconSize={64}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StateCard
          label="Present Today"
          value={stats.attendance.present_today}
          icon={<UserOutlined />}
          description={`${stats.employees.on_leave_today} on leave`}
          tone="pastelGreen"
          iconSize={64}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StateCard
          label="Pending Leaves"
          value={stats.leaves.pending}
          icon={<CalendarOutlined />}
          description={`${stats.leaves.approved_this_month} approved this month`}
          tone="lightPeach"
          iconSize={64}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StateCard
          label="Pending Requests"
          value={stats.requests.pending}
          icon={<FileTextOutlined />}
          description={`${stats.complaints.pending} complaints pending`}
          tone="softLavender"
          iconSize={64}
        />
      </Col>
    </Row>
  );
};