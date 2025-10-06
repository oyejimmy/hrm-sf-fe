import React from 'react';
import { Button, Space, Tag, Typography, Empty, Table } from 'antd';
import { Eye, Download, CheckCircle } from 'lucide-react';
import { Payslip } from '../../../../services/api/types';

const { Text } = Typography;

interface AdminPayslipTableProps {
  data: Payslip[];
  loading?: boolean;
  onView: (record: Payslip) => void;
  onDownload: (record: Payslip) => void;
  onApprove: (record: Payslip) => void;
}

const AdminPayslipTable: React.FC<AdminPayslipTableProps> = ({
  data,
  loading = false,
  onView,
  onDownload,
  onApprove,
}) => {
  const columns: any = [
    {
      title: 'Employee',
      key: 'employee',
      render: (record: Payslip) => (
        <div>
          <Text strong>{record.employee_name || `Employee ${record.employee_id}`}</Text>
          <br />
          <Text type="secondary">ID: {record.employee_id}</Text>
        </div>
      ),
      responsive: ['xs', 'sm', 'md', 'lg'] as const,
    },
    {
      title: 'Payslip Number',
      dataIndex: 'payslip_number',
      key: 'payslip_number',
      responsive: ['sm', 'md', 'lg'] as const,
    },
    {
      title: 'Pay Period',
      key: 'pay_period',
      render: (record: Payslip) => {
        const startDate = new Date(record.pay_period_start).toLocaleDateString();
        const endDate = new Date(record.pay_period_end).toLocaleDateString();
        return `${startDate} - ${endDate}`;
      },
      sorter: (a: Payslip, b: Payslip) =>
        new Date(a.pay_period_start).getTime() - new Date(b.pay_period_start).getTime(),
      responsive: ['md', 'lg'] as const,
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basic_salary',
      key: 'basic_salary',
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a: Payslip, b: Payslip) => a.basic_salary - b.basic_salary,
      responsive: ['lg'] as const,
    },
    {
      title: 'Gross Pay',
      dataIndex: 'gross_salary',
      key: 'gross_salary',
      render: (amount: number) => `$${amount.toFixed(2)}`,
      sorter: (a: Payslip, b: Payslip) => a.gross_salary - b.gross_salary,
      responsive: ['md', 'lg'] as const,
    },
    {
      title: 'Net Pay',
      dataIndex: 'net_salary',
      key: 'net_salary',
      render: (amount: number) => <Text strong>${amount.toFixed(2)}</Text>,
      sorter: (a: Payslip, b: Payslip) => a.net_salary - b.net_salary,
      responsive: ['xs', 'sm', 'md', 'lg'] as const,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'paid' ? 'green' : status === 'approved' ? 'blue' : 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Generated', value: 'generated' },
        { text: 'Approved', value: 'approved' },
        { text: 'Paid', value: 'paid' },
      ],
      onFilter: (value: any, record: Payslip) => record.status === value,
      responsive: ['sm', 'md', 'lg'] as const,
    },
    {
      title: 'Pay Date',
      dataIndex: 'pay_date',
      key: 'pay_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Payslip, b: Payslip) =>
        new Date(a.pay_date).getTime() - new Date(b.pay_date).getTime(),
      responsive: ['lg'] as const,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Payslip) => (
        <Space size="small" wrap>
          <Button
            icon={<Eye size={14} />}
            size="small"
            onClick={() => onView(record)}
            title="View Details"
          >
            View
          </Button>
          <Button
            icon={<Download size={14} />}
            size="small"
            onClick={() => onDownload(record)}
            title="Download PDF"
          >
            PDF
          </Button>
          {record.status === 'generated' && (
            <Button
              icon={<CheckCircle size={14} />}
              size="small"
              type="primary"
              onClick={() => onApprove(record)}
              title="Approve Payslip"
            >
              Approve
            </Button>
          )}
        </Space>
      ),
      fixed: 'right' as const,
      width: 200,
      responsive: ['xs', 'sm', 'md', 'lg'] as const,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: 1200 }}
      loading={loading}
      locale={{
        emptyText: <Empty description="No payslips found" />,
      }}
      size="middle"
    />
  );
};

export default AdminPayslipTable;