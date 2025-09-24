// components/EmployeePayslip/components/PayslipTable.tsx
import React from 'react';
import { Button, Space, Tag, Typography, Empty } from 'antd';
import { Eye, Download } from 'lucide-react';
import { Payslip } from '../../../../services/api/types';
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
      dataIndex: 'pay_period',
      key: 'pay_period',
      sorter: (a: Payslip, b: Payslip) =>
        a.pay_period.localeCompare(b.pay_period),
      responsive: ['xs', 'sm', 'md'],
    },
    {
      title: 'Issue Date',
      dataIndex: 'generated_at',
      key: 'generated_at',
      sorter: (a: Payslip, b: Payslip) =>
        new Date(a.generated_at).getTime() - new Date(b.generated_at).getTime(),
      responsive: ['sm', 'md'],
    },
    {
      title: 'Gross Pay',
      dataIndex: 'gross_pay',
      key: 'gross_pay',
      render: (amount: number) => `PKR${amount.toFixed(2)}`,
      sorter: (a: Payslip, b: Payslip) => a.gross_pay - b.gross_pay,
      responsive: ['md'],
    },
    {
      title: 'Deductions',
      dataIndex: 'total_deductions',
      key: 'total_deductions',
      render: (amount: number) => `PKR${amount.toFixed(2)}`,
      sorter: (a: Payslip, b: Payslip) => a.total_deductions - b.total_deductions,
      responsive: ['lg'],
    },
    {
      title: 'Net Pay',
      dataIndex: 'net_pay',
      key: 'net_pay',
      render: (amount: number) => <Text strong>PKR{amount.toFixed(2)}</Text>,
      sorter: (a: Payslip, b: Payslip) => a.net_pay - b.net_pay,
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
      rowKey="id"
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