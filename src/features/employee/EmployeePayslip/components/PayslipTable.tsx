// components/EmployeePayslip/components/PayslipTable.tsx
import React from 'react';
import { Button, Space, Tag, Typography, Empty } from 'antd';
import { Eye, Download } from 'lucide-react';
import { Payslip } from '../types';
import { StyledTable } from './styles';

const { Text } = Typography;

interface PayslipTableProps {
  data: Payslip[];
  loading?: boolean;
  onView: (record: Payslip) => void;
  onDownload: (record: Payslip) => void;
}

const PayslipTable: React.FC<PayslipTableProps> = ({
  data,
  loading = false,
  onView,
  onDownload,
}) => {
  const columns: any = [
    {
      title: 'Pay Period',
      dataIndex: 'payPeriod',
      key: 'payPeriod',
      sorter: (a: Payslip, b: Payslip) =>
        a.payPeriod.localeCompare(b.payPeriod),
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      sorter: (a: Payslip, b: Payslip) =>
        new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime(),
      responsive: ['sm', 'md'],
    },
    {
      title: 'Gross Pay',
      dataIndex: 'grossPay',
      key: 'grossPay',
      render: (amount: number) => `PKR${amount.toFixed(2)}`,
      sorter: (a: Payslip, b: Payslip) => a.grossPay - b.grossPay,
      responsive: ['md'],
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
      render: (amount: number) => `PKR${amount.toFixed(2)}`,
      sorter: (a: Payslip, b: Payslip) => a.deductions - b.deductions,
      responsive: ['lg'],
    },
    {
      title: 'Net Pay',
      dataIndex: 'netPay',
      key: 'netPay',
      render: (amount: number) => <Text strong>PKR{amount.toFixed(2)}</Text>,
      sorter: (a: Payslip, b: Payslip) => a.netPay - b.netPay,
      responsive: ['sm', 'md', 'lg'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Paid' ? 'green' : 'default'}>{status}</Tag>
      ),
      responsive: ['md', 'lg'],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Payslip) => (
        <Space size="middle">
          <Button
            icon={<Eye size={14} />}
            size="small"
            onClick={() => onView(record)}
          >
            View
          </Button>
          <Button
            icon={<Download size={14} />}
            size="small"
            onClick={() => onDownload(record)}
          >
            Download
          </Button>
        </Space>
      ),
      responsive: ['xs', 'sm', 'md', 'lg'],
    },
  ];

  return (
    <StyledTable
      columns={columns}
      dataSource={data}
      pagination={{ pageSize: 5 }}
      scroll={{ x: true }}
      loading={loading}
      locale={{
        emptyText: <Empty description="No payslips found" />,
      }}
    />
  );
};

export default PayslipTable;