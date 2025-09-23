import React, { useState, useMemo } from "react";
import {
  Card,
  Button,
  Space,
  message,
  Row,
  Col,
  Tabs,
  Table,
  Input,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  MedicineBoxOutlined,
  FileProtectOutlined,
  TeamOutlined,
  BankOutlined,
  PhoneOutlined,
  SafetyOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { StateCard } from "../../../components/StateCard";
import HeaderComponent from "../../../components/PageHeader";
import NewClaimModal from "./components/NewClaimModal";
import ContactPakQatarModal from "./components/ContactPakQatarModal";
import {
  useHealthInsuranceData,
  useHospitals,
  useCreateClaim,
} from "./hooks/useHealthInsuranceOptimized";
import { Wrapper } from "../../../components/Wrapper";
import MyCardModal from "./components/PakQatarCard";

const { TabPane } = Tabs;

const breadcrumbItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Health Insurance",
  },
];

const EmployeeHealthInsurance: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { data, isLoading } = useHealthInsuranceData();
  const { data: hospitals, isLoading: hospitalsLoading } = useHospitals();
  const createClaimMutation = useCreateClaim();
  const [newClaimModalVisible, setNewClaimModalVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleNewClaim = async (values: any) => {
    try {
      await createClaimMutation.mutateAsync(values);
      message.success("Claim submitted successfully");
      setNewClaimModalVisible(false);
    } catch (error) {
      message.error("Failed to submit claim");
    }
  };

  const stats = data?.stats || {
    totalCoverage: 0,
    usedAmount: 0,
    remainingAmount: 0,
    approvedClaims: 0,
    totalClaims: 0,
  };
  const filteredHospitals = useMemo(() => {
    if (!hospitals || !Array.isArray(hospitals)) {
      return [];
    }
    
    if (!searchText.trim()) {
      return hospitals;
    }
    
    return hospitals.filter(
      (hospital: any) =>
        hospital.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        hospital.city?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [hospitals, searchText]);

  const hospitalColumns = [
    {
      title: "Hospital Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      sorter: (a: any, b: any) => a.city.localeCompare(b.city),
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Room Entitlement",
      dataIndex: "minimum_room_entitlement",
      key: "minimum_room_entitlement",
      render: (amount: number) =>
        amount ? `PKR ${amount.toLocaleString()}` : "N/A",
    },
    {
      title: "Status",
      dataIndex: "is_non_reimbursable",
      key: "is_non_reimbursable",
      render: (isNonReimbursable: boolean) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "white",
            backgroundColor: isNonReimbursable ? "#ff4d4f" : "#52c41a",
          }}
        >
          {isNonReimbursable ? "Non-Reimbursable" : "Panel Hospital"}
        </span>
      ),
      filters: [
        { text: "Panel Hospital", value: false },
        { text: "Non-Reimbursable", value: true },
      ],
      onFilter: (value: any, record: any) => record.is_non_reimbursable === value,
    },
  ];

  const claimColumns = [
    { title: "Claim Number", dataIndex: "claim_number", key: "claim_number" },
    { title: "Patient", dataIndex: "patient_name", key: "patient_name" },
    { title: "Type", dataIndex: "claim_type", key: "claim_type" },
    {
      title: "Amount",
      dataIndex: "claimed_amount",
      key: "claimed_amount",
      render: (amount: number) => `PKR ${amount?.toLocaleString()}`,
    },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Date", dataIndex: "submitted_date", key: "submitted_date" },
  ];

  const dependentColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Relationship", dataIndex: "relationship", key: "relationship" },
    {
      title: "Date of Birth",
      dataIndex: "date_of_birth",
      key: "date_of_birth",
    },
    { title: "Gender", dataIndex: "gender", key: "gender" },
  ];

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        title="Health Insurance"
        subtitle="Manage your health insurance policy, claims, and coverage details"
        breadcrumbItems={breadcrumbItems}
        isDarkMode={isDarkMode}
        extraButtons={[
          <Button
            key="card"
            icon={<FileProtectOutlined />}
            onClick={() => setCardModalVisible(true)}
            size="large"
          >
            My Card
          </Button>,
          <Button
            key="contact"
            icon={<PhoneOutlined />}
            onClick={() => setContactModalVisible(true)}
            size="large"
          >
            Contact PakQatar
          </Button>,
          <Button
            key="claim"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setNewClaimModalVisible(true)}
            size="large"
          >
            New Claim
          </Button>,
        ]}
      />
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Total Coverage"
            value={`PKR ${stats.totalCoverage.toLocaleString()}`}
            icon={SafetyOutlined}
            tone="pastelBlue"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Amount Used"
            value={`PKR ${stats.usedAmount.toLocaleString()}`}
            icon={DollarOutlined}
            tone="lightPeach"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Remaining Coverage"
            value={`PKR ${stats.remainingAmount.toLocaleString()}`}
            icon={FileProtectOutlined}
            tone="pastelGreen"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Claims Approved"
            value={`${stats.approvedClaims || 0}/${stats.totalClaims || 0}`}
            icon={MedicineBoxOutlined}
            tone="softLavender"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Room Rent"
            value="PKR 15,000"
            icon={MedicineBoxOutlined}
            tone="pastelBlue"
            description="Per day room rent coverage"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Used"
            value={`PKR ${stats.usedAmount.toLocaleString()}`}
            icon={MedicineBoxOutlined}
            tone="pastelGreen"
            description="25% of total coverage utilized"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Available"
            value={`PKR ${stats.remainingAmount.toLocaleString()}`}
            icon={MedicineBoxOutlined}
            tone="lightPeach"
            description="75% coverage still available"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            label="Policy Status"
            value="Active"
            icon={SafetyOutlined}
            tone="pastelGreen"
            description="Policy is currently active"
          />
        </Col>
      </Row>

      <Card loading={hospitalsLoading} style={{marginTop: 20}}>
        <Tabs defaultActiveKey="2" size="large">
          <TabPane
            tab={
              <Space>
                <BankOutlined />
                Panel Hospitals
              </Space>
            }
            key="2"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 16,
              }}
            >
              <Input
                placeholder="Search hospitals by name or city"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 280 }}
              />
            </div>
            <Table
              columns={hospitalColumns}
              dataSource={filteredHospitals}
              loading={hospitalsLoading}
              rowKey={(record) => record.id || record.name}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} hospitals`,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              scroll={{ x: 800 }}
              size="middle"
            />
          </TabPane>
          <TabPane
            tab={
              <Space>
                <FileProtectOutlined />
                My Claims
              </Space>
            }
            key="1"
          >
            <Table
              columns={claimColumns}
              dataSource={data?.claims || []}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          <TabPane
            tab={
              <Space>
                <TeamOutlined />
                Dependents
              </Space>
            }
            key="3"
          >
            <Table
              columns={dependentColumns}
              dataSource={data?.dependents || []}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>

      <NewClaimModal
        visible={newClaimModalVisible}
        onCancel={() => setNewClaimModalVisible(false)}
        onSubmit={handleNewClaim}
        loading={createClaimMutation.isPending}
        hospitals={hospitals || []}
      />

      <MyCardModal 
        visible={cardModalVisible}
        onCancel={() => setCardModalVisible(false)}
        policy={data?.policy}
        isDarkMode={isDarkMode}
      />

      <ContactPakQatarModal
        visible={contactModalVisible}
        onCancel={() => setContactModalVisible(false)}
      />
    </Wrapper>
  );
};

export default EmployeeHealthInsurance;
