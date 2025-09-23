import React from "react";
import { Card, Row, Col, Typography, Badge, Modal, Button } from "antd";
import { SafetyOutlined, CloseOutlined } from "@ant-design/icons";
import { HealthInsurancePolicy, CoverageDetail } from "../types";
import { useHealthInsuranceData } from "../hooks/useHealthInsuranceOptimized";

const { Text } = Typography;

interface PakQatarCardProps {
  policy?: HealthInsurancePolicy;
  coverageDetails?: CoverageDetail[];
  isDarkMode: boolean;
}

interface MyCardModalProps {
  visible: boolean;
  onCancel: () => void;
  policy?: any;
  isDarkMode: boolean;
}

const MyCardModal: React.FC<MyCardModalProps> = ({
  visible,
  onCancel,
  policy,
  isDarkMode,
}) => {
  const { data } = useHealthInsuranceData();
  // const policy = propPolicy || data?.policy;

  const formatDate = (dateString: string) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
      .replace(/ /g, "-")
      .toUpperCase();
  };

  const calculateAge = (dob: string) => {
    if (!dob) return "--";
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return (age - 1).toString();
    }
    return age.toString();
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      closable={false}
      footer={
        <Button type="primary" onClick={onCancel} size="large">
          Cancel
        </Button>
      }
      width="90%"
      style={{ maxWidth: "700px" }}
      centered
    >
      <Card>
        <Row justify="space-between" align="top" style={{ marginBottom: 8 }}>
          <Col>
            <Typography.Title level={5} style={{ color: "#8B1538", margin: 0 }}>
              PAK-QATAR
            </Typography.Title>
            <Text style={{ fontSize: 10, color: "#8B1538" }}>
              FAMILY TAKAFUL
            </Text>
            <br />
            <Text style={{ fontSize: 8, color: "#666" }}>
              Participant's Medical Emergency Reimbursement Services
            </Text>
          </Col>
          <Col>
            <Badge count={<SafetyOutlined style={{ color: "#8B1538" }} />} />
          </Col>
        </Row>

        <Card
          size="small"
          style={{
            background: "#8B1538",
            color: "white",
            marginBottom: 12,
          }}
        >
          <Text strong style={{ color: "white", fontSize: 12 }}>
            Group Health Identification Card
          </Text>
        </Card>

        <Row gutter={[16, 8]} style={{ fontSize: 10 }}>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              Participant's Name:{" "}
            </Text>
            <Text>
              {policy?.participant_name || policy?.employee_name || "John Doe"}
            </Text>
          </Col>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              Employee Name:{" "}
            </Text>
            <Text>{policy?.company_name || "ABC Pakistan"}</Text>
          </Col>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              CNIC No:{" "}
            </Text>
            <Text>{policy?.cnic || "42101-1234567-8"}</Text>
          </Col>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              D.O.B:{" "}
            </Text>
            <Text>{formatDate(policy?.date_of_birth) || "05 May 77"}</Text>
          </Col>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              Cert No:{" "}
            </Text>
            <Text>{policy?.policy_number || "9300093238-54"}</Text>
          </Col>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              Family Member:{" "}
            </Text>
            <Text>{policy?.family_member_count || "01"}</Text>
          </Col>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              Emp No:{" "}
            </Text>
            <Text>
              {policy?.employee_id ||
                policy?.employee_number ||
                "9300093238-54"}
            </Text>
          </Col>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              Age:{" "}
            </Text>
            <Text>{calculateAge(policy?.date_of_birth)}</Text>
          </Col>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              Branch:{" "}
            </Text>
            <Text>{policy?.branch || "AAL 103"}</Text>
          </Col>
          <Col span={12}>
            <Text strong style={{ color: "#8B1538" }}>
              Cert:{" "}
            </Text>
            <Text>{policy?.certificate_number || "237"}</Text>
          </Col>
        </Row>

        <Row justify="space-between" style={{ marginTop: 12, fontSize: 10 }}>
          <Col>
            <Text strong style={{ color: "#8B1538" }}>
              Room Limit:{" "}
            </Text>
            <Text>{policy?.room_rent_limit || "4900"}</Text>
            <br />
            <Text strong style={{ color: "#8B1538" }}>
              Valid up to:{" "}
            </Text>
            <Text>{formatDate(policy?.end_date) || "31-DEC-2021"}</Text>
          </Col>
        </Row>

        <Typography.Paragraph
          style={{
            fontSize: 8,
            color: "#666",
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          This Card is Company's property and must be returned on demand. For
          treatment please contact Rs. {policy?.room_rent_limit || "4900"}/- on
          room rent basis.
        </Typography.Paragraph>
      </Card>
    </Modal>
  );
};

export default MyCardModal;
