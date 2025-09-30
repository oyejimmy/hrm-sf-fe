import React from 'react';
import { Row, Col } from 'antd';
import { FilePdfOutlined, FileExcelOutlined, TeamOutlined, CalendarOutlined, BarChartOutlined, UserAddOutlined } from '@ant-design/icons';
import { ChartContainer, QuickActionButton } from './styles';

export const QuickActions: React.FC = () => {
  const quickActions = [
    {
      title: 'Employee Handbook PDF',
      icon: <FilePdfOutlined />,
      color: '#f5222d',
    },
    {
      title: 'Payroll Report Excel',
      icon: <FileExcelOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Attendance Report PDF',
      icon: <FilePdfOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Add New Employee',
      icon: <UserAddOutlined />,
      color: '#722ed1',
    },
    {
      title: 'Leave Summary PDF',
      icon: <FilePdfOutlined />,
      color: '#faad14',
    },
    {
      title: 'Department Report',
      icon: <TeamOutlined />,
      color: '#13c2c2',
    },
  ];

  return (
    <ChartContainer title="Quick Actions">
      <Row gutter={[12, 12]}>
        {quickActions.map((action, index) => (
          <Col xs={12} sm={8} key={index}>
            <QuickActionButton
              type="primary"
              style={{ 
                backgroundColor: action.color, 
                borderColor: action.color,
                height: '60px',
                fontSize: '12px'
              }}
              icon={action.icon}
            >
              {action.title}
            </QuickActionButton>
          </Col>
        ))}
      </Row>
    </ChartContainer>
  );
};