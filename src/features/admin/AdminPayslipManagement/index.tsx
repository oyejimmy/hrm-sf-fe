import React, { useState, useMemo } from 'react';
import { Card, Button, Select, Input, Space, message, Spin, Alert, Row, Col } from 'antd';
import { Download, Eye, CheckCircle, Search } from 'lucide-react';
import { Wrapper } from '../../../components/Wrapper';
import HeaderComponent from '../../../components/PageHeader';
import { useTheme } from '../../../contexts/ThemeContext';
import { useAdminPayslips, useApprovePayslip, useDownloadPayslipPDF } from '../../../hooks/api/usePayroll';
import { Payslip } from '../../../services/api/types';
import AdminPayslipTable from './components/AdminPayslipTable';
import PayslipDetailsModal from '../../employee/EmployeePayslip/components/PayslipDetailsModal';
import { StateCard } from '../../../components/StateCard';
import { Wallet, DollarSign, CreditCard, Users } from 'lucide-react';

const { Option } = Select;

const AdminPayslipManagement: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [filters, setFilters] = useState({
    year: 2024,
    month: undefined as number | undefined,
    status: undefined as string | undefined,
    employee_id: undefined as number | undefined,
    search: '',
  });
  const [selectedPayslipId, setSelectedPayslipId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // API hooks
  const { data: payslips, isLoading, error } = useAdminPayslips(filters);
  const approvePayslip = useApprovePayslip();
  const downloadPDF = useDownloadPayslipPDF();

  // Filter payslips based on search
  const filteredPayslips = useMemo(() => {
    if (!payslips) return [];
    
    return payslips.filter(payslip => {
      const searchLower = filters.search.toLowerCase();
      return (
        payslip.payslip_number.toLowerCase().includes(searchLower) ||
        (payslip.employee_name && payslip.employee_name.toLowerCase().includes(searchLower))
      );
    });
  }, [payslips, filters.search]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!filteredPayslips.length) {
      return { totalPayslips: 0, totalAmount: 0, pendingApprovals: 0, avgSalary: 0 };
    }

    const totalPayslips = filteredPayslips.length;
    const totalAmount = filteredPayslips.reduce((sum, p) => sum + p.net_salary, 0);
    const pendingApprovals = filteredPayslips.filter(p => p.status === 'generated').length;
    const avgSalary = totalAmount / totalPayslips;

    return { totalPayslips, totalAmount, pendingApprovals, avgSalary };
  }, [filteredPayslips]);

  const handleView = (payslip: Payslip) => {
    setSelectedPayslipId(payslip.id);
    setIsModalVisible(true);
  };

  const handleDownload = (payslip: Payslip) => {
    downloadPDF.mutate(payslip.id);
  };

  const handleApprove = (payslip: Payslip) => {
    approvePayslip.mutate(payslip.id);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (error) {
    return (
      <Wrapper $isDarkMode={isDarkMode}>
        <Alert
          message="Error"
          description="Failed to load payslips. Please try again later."
          type="error"
          showIcon
        />
      </Wrapper>
    );
  }

  return (
    <Wrapper $isDarkMode={isDarkMode}>
      <HeaderComponent
        isDarkMode={isDarkMode}
        title="Payslip Management"
        subtitle="Manage employee payslips and approvals"
        breadcrumbItems={[
          { title: "Dashboard", href: "/admin/dashboard" },
          { title: "Payslip Management" },
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            icon={<Users />}
            label="Total Payslips"
            value={stats.totalPayslips.toString()}
            tone="pastelBlue"
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            icon={<DollarSign />}
            label="Total Amount"
            value={`$${stats.totalAmount.toFixed(2)}`}
            tone="pastelGreen"
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            icon={<CreditCard />}
            label="Pending Approvals"
            value={stats.pendingApprovals.toString()}
            tone="pastelPink"
            valueStyle={{ color: "#f5222d" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StateCard
            icon={<Wallet />}
            label="Average Salary"
            value={`$${stats.avgSalary.toFixed(2)}`}
            tone="softLavender"
            valueStyle={{ color: "#722ed1" }}
          />
        </Col>
      </Row>

      <Card title="Payslip Management">
        {/* Filters */}
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Input
              placeholder="Search by payslip number or employee name"
              prefix={<Search size={16} />}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Select Year"
              value={filters.year}
              onChange={(value) => handleFilterChange('year', value)}
              style={{ width: 120 }}
            >
              <Option value={2024}>2024</Option>
              <Option value={2023}>2023</Option>
              <Option value={2022}>2022</Option>
            </Select>
            <Select
              placeholder="Select Month"
              value={filters.month}
              onChange={(value) => handleFilterChange('month', value)}
              style={{ width: 120 }}
              allowClear
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Select Status"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: 150 }}
              allowClear
            >
              <Option value="generated">Generated</Option>
              <Option value="approved">Approved</Option>
              <Option value="paid">Paid</Option>
            </Select>
          </Space>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <AdminPayslipTable
            data={filteredPayslips}
            onView={handleView}
            onDownload={handleDownload}
            onApprove={handleApprove}
            loading={isLoading}
          />
        )}
      </Card>

      <PayslipDetailsModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedPayslipId(null);
        }}
        payslip={filteredPayslips.find(p => p.id === selectedPayslipId)}
      />
    </Wrapper>
  );
};

export default AdminPayslipManagement;