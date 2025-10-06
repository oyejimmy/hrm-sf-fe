import React from 'react';
import { Button, Space, Tag, Typography, Empty } from 'antd';
import { Eye, Download } from 'lucide-react';
import { Payslip } from '../../../../services/api/types';
import { StyledTable } from './styles';
import { pakCurrency } from '../../../../constants';

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
      key: 'pay_period',
      render: (record: Payslip) => {
        const startDate = new Date(record.pay_period_start).toLocaleDateString();
        const endDate = new Date(record.pay_period_end).toLocaleDateString();
        return `${startDate} - ${endDate}`;
      },
      sorter: (a: Payslip, b: Payslip) =>
        new Date(a.pay_period_start).getTime() - new Date(b.pay_period_start).getTime(),
    },
    {
      title: 'Payslip Number',
      dataIndex: 'payslip_number',
      key: 'payslip_number',
    },
    {
      title: 'Pay Date',
      dataIndex: 'pay_date',
      key: 'pay_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a: Payslip, b: Payslip) =>
        new Date(a.pay_date).getTime() - new Date(b.pay_date).getTime(),
    },
    {
      title: 'Gross Pay',
      dataIndex: 'gross_salary',
      key: 'gross_salary',
      render: (amount: number) => `${pakCurrency}${amount.toFixed(2)}`,
      sorter: (a: Payslip, b: Payslip) => a.gross_salary - b.gross_salary,
    },
    {
      title: 'Deductions',
      dataIndex: 'total_deductions',
      key: 'total_deductions',
      render: (amount: number) => `${pakCurrency}${amount.toFixed(2)}`,
      sorter: (a: Payslip, b: Payslip) => a.total_deductions - b.total_deductions,
    },
    {
      title: 'Net Pay',
      dataIndex: 'net_salary',
      key: 'net_salary',
      render: (amount: number) => <Text strong>{pakCurrency}{amount.toFixed(2)}</Text>,
      sorter: (a: Payslip, b: Payslip) => a.net_salary - b.net_salary,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'paid' ? 'green' : status === 'approved' ? 'blue' : 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
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
    },
  ];

  return (
    <StyledTable
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ 
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
      scroll={{ x: true }}
      loading={loading}
      locale={{
        emptyText: <Empty description="No payslips found" />,
      }}
    />
  );
};

export default PayslipTable;