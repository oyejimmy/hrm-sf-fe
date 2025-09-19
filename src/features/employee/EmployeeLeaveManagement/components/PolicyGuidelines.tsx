import { Typography, List, Tag, Collapse } from "antd";
import { FileTextOutlined, CheckCircleOutlined, ProfileOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography; // Destructure Title and Paragraph from Typography
const { Panel } = Collapse; // Destructure Panel from Collapse

// Define an array of leave policies
const policies = [
  {
    type: 'Annual Leave', // Type of leave
    eligibility: 'All full-time employees are eligible for 20 days of paid annual leave per year, pro-rated from their start date. Leave must be requested at least 2 weeks in advance.', // Eligibility criteria
    workflow: 'Requests are submitted via the HR portal. They require approval from your direct manager. For leaves longer than 5 days, a backup plan for your project work must be included in the request.', // Workflow for requesting leave
    documentation: 'Company Leave Policy V2.1' // Associated documentation
  },
  {
    type: 'Sick Leave', // Type of leave
    eligibility: 'All employees are eligible for 10 days of paid sick leave annually.', // Eligibility criteria
    workflow: 'For absences of 1-3 days, self-certification is sufficient. For absences longer than 3 days, a valid doctor\'s note must be submitted within 48 hours of your return to work. Notify your team via Slack or Teams by 9 AM on the first day of absence.', // Workflow for requesting leave
    documentation: 'Sick Leave Policy Addendum' // Associated documentation
  },
  {
    type: 'Casual Leave', // Type of leave
    eligibility: 'All full-time employees are eligible for 5 days of casual leave per year.', // Eligibility criteria
    workflow: 'Requires approval from your direct manager. Should be used for unforeseen personal emergencies and can be requested with short notice.', // Workflow for requesting leave
    documentation: 'Casual Leave Guidelines' // Associated documentation
  },
  {
    type: 'Maternity Leave', // Type of leave
    eligibility: 'Eligible for female employees after 1 year of continuous service. This includes 16 weeks of paid leave.', // Eligibility criteria
    workflow: 'Employees must submit a formal request with a doctor\'s certificate at least 3 months prior to the expected date of delivery.', // Workflow for requesting leave
    documentation: 'Maternity Leave Policy' // Associated documentation
  },
  {
    type: 'Paternity Leave', // Type of leave
    eligibility: 'Eligible for male employees after 1 year of continuous service. This includes 4 weeks of paid leave to be taken within 6 months of the child\'s birth.', // Eligibility criteria
    workflow: 'Employees must provide a formal request along with a copy of the birth certificate within 1 month of the child\'s birth.', // Workflow for requesting leave
    documentation: 'Paternity Leave Policy' // Associated documentation
  }
];

// PolicyGuidelines functional component
const PolicyGuidelines = () => {
  return (
    <Collapse accordion defaultActiveKey={['0']}> {/* Ant Design Collapse component with accordion mode */}
      {policies.map((policy, index) => ( // Map through each policy to render a Panel
        <Panel
          header={ // Custom header for each panel
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileTextOutlined style={{ color: '#1a237e' }} /> {/* Icon for the policy type */}
              <Title level={5} style={{ margin: 0 }}>
                {policy.type} {/* Display policy type */}
              </Title>
            </div>
          }
          key={index.toString()} // Unique key for each panel
        >
          <List
            itemLayout="horizontal"
            style={{ marginTop: '16px' }}
            dataSource={[
              {
                title: 'Eligibility', // Title for eligibility section
                description: policy.eligibility, // Eligibility description
                icon: <CheckCircleOutlined style={{ color: '#52c41a' }} /> // Icon for eligibility
              },
              {
                title: 'Workflow', // Title for workflow section
                description: policy.workflow, // Workflow description
                icon: <ProfileOutlined style={{ color: '#faad14' }} /> // Icon for workflow
              },
            ]}
            renderItem={item => ( // Render each item in the list
              <List.Item>
                <List.Item.Meta
                  avatar={item.icon} // Item icon
                  title={item.title} // Item title
                  description={<Paragraph>{item.description}</Paragraph>} // Item description
                />
              </List.Item>
            )}
          />
          {policy.documentation && ( // Conditionally render documentation if available
            <div style={{ marginTop: '16px', padding: '0 12px' }}>
              <span style={{ fontWeight: 'bold' }}>Documentation:</span>{' '}
              <Tag color="blue">{policy.documentation}</Tag> {/* Display documentation tag */}
            </div>
          )}
        </Panel>
      ))}
    </Collapse>
  );
};

export default PolicyGuidelines;
