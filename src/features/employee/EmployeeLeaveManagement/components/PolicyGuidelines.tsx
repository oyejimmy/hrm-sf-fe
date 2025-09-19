import React from "react";
import { Card, Typography, List, Tag, Row, Col, Collapse } from "antd";
import { FileTextOutlined, CheckCircleOutlined, ProfileOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const policies = [
  {
    type: 'Annual Leave',
    eligibility: 'All full-time employees are eligible for 20 days of paid annual leave per year, pro-rated from their start date. Leave must be requested at least 2 weeks in advance.',
    workflow: 'Requests are submitted via the HR portal. They require approval from your direct manager. For leaves longer than 5 days, a backup plan for your project work must be included in the request.',
    documentation: 'Company Leave Policy V2.1'
  },
  {
    type: 'Sick Leave',
    eligibility: 'All employees are eligible for 10 days of paid sick leave annually.',
    workflow: 'For absences of 1-3 days, self-certification is sufficient. For absences longer than 3 days, a valid doctor\'s note must be submitted within 48 hours of your return to work. Notify your team via Slack or Teams by 9 AM on the first day of absence.',
    documentation: 'Sick Leave Policy Addendum'
  },
  {
    type: 'Casual Leave',
    eligibility: 'All full-time employees are eligible for 5 days of casual leave per year.',
    workflow: 'Requires approval from your direct manager. Should be used for unforeseen personal emergencies and can be requested with short notice.',
    documentation: 'Casual Leave Guidelines'
  },
  {
    type: 'Maternity Leave',
    eligibility: 'Eligible for female employees after 1 year of continuous service. This includes 16 weeks of paid leave.',
    workflow: 'Employees must submit a formal request with a doctor\'s certificate at least 3 months prior to the expected date of delivery.',
    documentation: 'Maternity Leave Policy'
  },
  {
    type: 'Paternity Leave',
    eligibility: 'Eligible for male employees after 1 year of continuous service. This includes 4 weeks of paid leave to be taken within 6 months of the child\'s birth.',
    workflow: 'Employees must provide a formal request along with a copy of the birth certificate within 1 month of the child\'s birth.',
    documentation: 'Paternity Leave Policy'
  }
];

const PolicyGuidelines = () => {
  return (
    <Collapse accordion defaultActiveKey={['0']}>
      {policies.map((policy, index) => (
        <Panel
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileTextOutlined style={{ color: '#1a237e' }} />
              <Title level={5} style={{ margin: 0 }}>
                {policy.type}
              </Title>
            </div>
          }
          key={index.toString()}
        >
          <List
            itemLayout="horizontal"
            style={{ marginTop: '16px' }}
            dataSource={[
              {
                title: 'Eligibility',
                description: policy.eligibility,
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
              },
              {
                title: 'Workflow',
                description: policy.workflow,
                icon: <ProfileOutlined style={{ color: '#faad14' }} />
              },
            ]}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={item.icon}
                  title={item.title}
                  description={<Paragraph>{item.description}</Paragraph>}
                />
              </List.Item>
            )}
          />
          {policy.documentation && (
            <div style={{ marginTop: '16px', padding: '0 12px' }}>
              <span style={{ fontWeight: 'bold' }}>Documentation:</span>{' '}
              <Tag color="blue">{policy.documentation}</Tag>
            </div>
          )}
        </Panel>
      ))}
    </Collapse>
  );
};

export default PolicyGuidelines;
