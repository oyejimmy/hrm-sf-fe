import React from "react";
import { Typography, Tag, Collapse, Space } from "antd";
import type { CollapseProps } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

type Policy = {
  type: string;
  eligibility: string;
  workflow: string;
  documentation: string;
};

const policies: Policy[] = [
  {
    type: "Annual Leave",
    eligibility:
      "All full-time employees are eligible for 20 days of paid annual leave per year, pro-rated from their start date. Leave must be requested at least 2 weeks in advance.",
    workflow:
      "Requests are submitted via the HR portal. They require approval from your direct manager. For leaves longer than 5 days, a backup plan for your project work must be included in the request.",
    documentation: "Company Leave Policy V2.1",
  },
  {
    type: "Sick Leave",
    eligibility:
      "All employees are eligible for 10 days of paid sick leave annually.",
    workflow:
      "For absences of 1–3 days, self-certification is sufficient. For absences longer than 3 days, a valid doctor's note must be submitted within 48 hours of your return to work. Notify your team via Slack or Teams by 9 AM on the first day of absence.",
    documentation: "Sick Leave Policy Addendum",
  },
  {
    type: "Casual Leave",
    eligibility:
      "All full-time employees are eligible for 5 days of casual leave per year.",
    workflow:
      "Requires approval from your direct manager. Should be used for unforeseen personal emergencies and can be requested with short notice.",
    documentation: "Casual Leave Guidelines",
  },
  {
    type: "Maternity Leave",
    eligibility:
      "Eligible for female employees after 1 year of continuous service. This includes 16 weeks of paid leave.",
    workflow:
      "Employees must submit a formal request with a doctor’s certificate at least 3 months prior to the expected date of delivery.",
    documentation: "Maternity Leave Policy",
  },
  {
    type: "Paternity Leave",
    eligibility:
      "Eligible for male employees after 1 year of continuous service. This includes 4 weeks of paid leave to be taken within 6 months of the child’s birth.",
    workflow:
      "Employees must provide a formal request along with a copy of the birth certificate within 1 month of the child’s birth.",
    documentation: "Paternity Leave Policy",
  },
];

function headerIconFor(type: string) {
  // You can customize icons per type if you want
  switch (type) {
    case "Annual Leave":
      return <ProfileOutlined style={{ color: "#1a237e" }} />;
    case "Sick Leave":
      return <CheckCircleOutlined style={{ color: "#1a237e" }} />;
    default:
      return <FileTextOutlined style={{ color: "#1a237e" }} />;
  }
}

function buildItems(data: Policy[]): CollapseProps["items"] {
  return data.map((policy) => ({
    key: policy.type,
    label: (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {headerIconFor(policy.type)}
        <Title level={5} style={{ margin: 0 }}>
          {policy.type}
        </Title>
      </div>
    ),
    children: (
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <section>
          <Title level={5} style={{ marginBottom: 6 }}>
            Eligibility
          </Title>
          <Paragraph style={{ margin: 0 }}>{policy.eligibility}</Paragraph>
        </section>

        <section>
          <Title level={5} style={{ marginBottom: 6 }}>
            Workflow
          </Title>
          <Paragraph style={{ margin: 0 }}>{policy.workflow}</Paragraph>
        </section>

        <section>
          <Title level={5} style={{ marginBottom: 6 }}>
            Documentation
          </Title>
          <Tag color="geekblue" style={{ fontSize: 12 }}>
            {policy.documentation}
          </Tag>
          <div style={{ marginTop: 6 }}>
            <Text type="secondary">
              Tip: Check the HR portal for the latest version.
            </Text>
          </div>
        </section>
      </Space>
    ),
  }));
}

const PolicyGuidelines: React.FC = () => {
  const items = React.useMemo(() => buildItems(policies), []);

  return (
    <Collapse
      accordion
      defaultActiveKey={policies.length ? policies[0].type : undefined}
      items={items}
      expandIconPosition="end"
      style={{ background: "#fff" }}
      bordered={false}
    />
  );
};

export default PolicyGuidelines;