import React from 'react';
import { Row, Col, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const AnalyticsTab: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <Title level={4}>Complaint Analytics</Title>
      <Paragraph type="secondary">
        Detailed analytics and reports will be displayed here for HR and Admin users.
      </Paragraph>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Complaints by Category" size="small">
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paragraph type="secondary">Chart would be displayed here</Paragraph>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Resolution Timeline" size="small">
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Paragraph type="secondary">Chart would be displayed here</Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsTab;