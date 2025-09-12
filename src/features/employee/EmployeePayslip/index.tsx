import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Badge,
  List,
  Avatar,
  Divider,
  Switch,
  Statistic,
  Descriptions,
  Tabs,
  Space,
  Dropdown,
  message,
  theme
} from 'antd';
import {
  Download,
  Eye,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Wallet,
  FileText,
  ChevronDown,
  Printer,
  X,
  ArrowDown,
  ArrowUp,
  CreditCard,
  Banknote,
  Coins,
  PieChart
} from 'lucide-react';
import styled from 'styled-components';
import { Wrapper } from '../../../components/Wrapper';
import HeaderComponent from '../../../components/PageHeader';
import { useTheme } from '../../../contexts/ThemeContext';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// Styled Components
const StyledCard = styled(Card)`
  border-radius: 8px;
  margin-bottom: 16px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 24px;
  border-radius: 8px;
`;

const IconWrapper = styled.span<{ $color?: string; $size?: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background: ${props => props.$color ? `${props.$color}15` : '#1890ff15'};
  color: ${props => props.$color || '#1890ff'};
  margin-right: 12px;
  width: ${props => props.$size || '40px'};
  height: ${props => props.$size || '40px'};
`;

const StatisticCard = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  height: 100%;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    
    .search-section {
      width: 100%;
      margin-bottom: 12px;
    }
    
    .filter-section {
      width: 100%;
    }
  }
`;

// Mock Data
const payslipData: any = [
  {
    key: '1',
    payPeriod: 'October 2023',
    issueDate: '2023-10-31',
    grossPay: 6500.00,
    netPay: 5200.50,
    status: 'Paid',
    deductions: 1299.50
  },
  {
    key: '2',
    payPeriod: 'September 2023',
    issueDate: '2023-09-30',
    grossPay: 6500.00,
    netPay: 5180.25,
    status: 'Paid',
    deductions: 1319.75
  },
  {
    key: '3',
    payPeriod: 'August 2023',
    issueDate: '2023-08-31',
    grossPay: 6500.00,
    netPay: 5215.75,
    status: 'Paid',
    deductions: 1284.25
  },
  {
    key: '4',
    payPeriod: 'July 2023',
    issueDate: '2023-07-31',
    grossPay: 6200.00,
    netPay: 4980.50,
    status: 'Paid',
    deductions: 1219.50
  },
  {
    key: '5',
    payPeriod: 'June 2023',
    issueDate: '2023-06-30',
    grossPay: 6200.00,
    netPay: 4972.25,
    status: 'Paid',
    deductions: 1227.75
  },
];

const earningsData: any = [
  { type: 'Basic Salary', amount: 5000.00 },
  { type: 'Overtime Pay', amount: 750.00 },
  { type: 'Bonus', amount: 750.00 },
  { type: 'Allowances', amount: 300.00 },
];

const deductionsData: any = [
  { type: 'Federal Tax', amount: 850.00 },
  { type: 'State Tax', amount: 250.00 },
  { type: 'Social Security', amount: 150.00 },
  { type: 'Health Insurance', amount: 180.00 },
  { type: 'Retirement Plan', amount: 200.00 },
];

// Main Component
const EmployeePayslip: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState<any>(false);
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any>(payslipData);
  const [searchYear, setSearchYear] = useState<any>('2023');
  const [searchText, setSearchText] = useState<any>('');

  const showModal = (record: any) => {
    setSelectedPayslip(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedPayslip(null);
  };

  const handleDownload = (record: any) => {
    message.success(`Downloading payslip for ${record.payPeriod}`);
    // Here you would typically download the PDF
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    filterData(value, searchYear);
  };

  const handleYearFilter = (value: string) => {
    setSearchYear(value);
    filterData(searchText, value);
  };

  const filterData = (text: string, year: string) => {
    const filtered: any = payslipData.filter((item: any) => {
      const matchesText = item.payPeriod.toLowerCase().includes(text.toLowerCase());
      const matchesYear = item.issueDate.includes(year);
      return matchesText && matchesYear;
    });
    setFilteredData(filtered);
  };

  const columns: any = [
    {
      title: 'Pay Period',
      dataIndex: 'payPeriod',
      key: 'payPeriod',
      sorter: (a: any, b: any) => a.payPeriod.localeCompare(b.payPeriod),
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      sorter: (a: any, b: any) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime(),
    },
    {
      title: 'Gross Pay',
      dataIndex: 'grossPay',
      key: 'grossPay',
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a: any, b: any) => a.grossPay - b.grossPay,
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a: any, b: any) => a.deductions - b.deductions,
    },
    {
      title: 'Net Pay',
      dataIndex: 'netPay',
      key: 'netPay',
      render: (amount: number) => <Text strong>${amount.toFixed(2)}</Text>,
      sorter: (a: any, b: any) => a.netPay - b.netPay,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Paid' ? 'green' : 'default'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space size="middle">
          <Button
            icon={<Eye size={14} />}
            size="small"
            onClick={() => showModal(record)}
          >
            View
          </Button>
          <Button
            icon={<Download size={14} />}
            size="small"
            onClick={() => handleDownload(record)}
          >
            Download
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    filterData(searchText, searchYear);
  }, []);

  return (
    <Wrapper isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Payslip Management"
        subtitle="Manage your all Documents"
        breadcrumbItems={[
          {
            title: 'Home',
            href: '/'
          },
        ]}
      />
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <IconWrapper $color="#52c41a">
              <Wallet size={20} />
            </IconWrapper>
            <Text type="secondary">Net Pay (Current)</Text>
            <Title level={3} style={{ margin: 0 }}>PKR5,200.50</Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <IconWrapper $color="#1890ff">
              <DollarSign size={20} />
            </IconWrapper>
            <Text type="secondary">Gross Pay</Text>
            <Title level={3} style={{ margin: 0 }}>PKR6,500.00</Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <IconWrapper $color="#faad14">
              <CreditCard size={20} />
            </IconWrapper>
            <Text type="secondary">Deductions</Text>
            <Title level={3} style={{ margin: 0 }}>PKR1,299.50</Title>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <IconWrapper $color="#ff4d4f">
              <Calendar size={20} />
            </IconWrapper>
            <Text type="secondary">Pay Period</Text>
            <Title level={3} style={{ margin: 0 }}>Oct 2023</Title>
          </Card>
        </Col>
      </Row>

      <StyledCard title="Payslip History" extra={<Button icon={<Download size={14} />}>Export All</Button>}>
        <FilterSection>
          <div className="search-section">
            <Input
              placeholder="Search pay periods..."
              prefix={<Search size={16} />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 250 }}
            />
          </div>
          <div className="filter-section">
            <Space>
              <Text>Year:</Text>
              <Select defaultValue="2023" style={{ width: 120 }} onChange={handleYearFilter}>
                <Option value="2023">2023</Option>
                <Option value="2022">2022</Option>
                <Option value="2021">2021</Option>
              </Select>
              <Button icon={<Filter size={14} />}>More Filters</Button>
            </Space>
          </div>
        </FilterSection>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
      </StyledCard>

      <Modal
        title={selectedPayslip ? `Payslip Details - ${selectedPayslip.payPeriod}` : 'Payslip Details'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="print" icon={<Printer size={14} />}>Print</Button>,
          <Button key="download" type="primary" icon={<Download size={14} />}>
            Download PDF
          </Button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {selectedPayslip && (
          <>
            <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="Employee Name">John Doe</Descriptions.Item>
              <Descriptions.Item label="Employee ID">EMP-12345</Descriptions.Item>
              <Descriptions.Item label="Pay Period">{selectedPayslip.payPeriod}</Descriptions.Item>
              <Descriptions.Item label="Issue Date">{selectedPayslip.issueDate}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">Direct Deposit</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="green">{selectedPayslip.status}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <StyledCard title="Earnings" size="small">
                  <List
                    dataSource={earningsData}
                    renderItem={(item: any) => (
                      <List.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Text>{item.type}</Text>
                          <Text>PKR{item.amount.toFixed(2)}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Total Earnings</Text>
                    <Text strong>PKR{selectedPayslip.grossPay.toFixed(2)}</Text>
                  </div>
                </StyledCard>
              </Col>
              <Col span={12}>
                <StyledCard title="Deductions" size="small">
                  <List
                    dataSource={deductionsData}
                    renderItem={(item: any) => (
                      <List.Item>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Text>{item.type}</Text>
                          <Text>PKR{item.amount.toFixed(2)}</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Total Deductions</Text>
                    <Text strong>PKR{selectedPayslip.deductions.toFixed(2)}</Text>
                  </div>
                </StyledCard>
              </Col>
            </Row>

            <StyledCard title="Summary" size="small">
              <Descriptions column={1}>
                <Descriptions.Item label="Gross Earnings">
                  <Text>PKR{selectedPayslip.grossPay.toFixed(2)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Total Deductions">
                  <Text>PKR{selectedPayslip.deductions.toFixed(2)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Net Pay">
                  <Title level={4}>PKR{selectedPayslip.netPay.toFixed(2)}</Title>
                </Descriptions.Item>
              </Descriptions>
            </StyledCard>
          </>
        )}
      </Modal>
    </Wrapper>
  );
};

export default EmployeePayslip;