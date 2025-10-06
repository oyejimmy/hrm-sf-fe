import React from 'react';
import {
  Modal,
  Button,
  Descriptions,
  Tag,
  List,
  Row,
  Col,
  Divider,
  Typography,
  Spin,
  Empty,
} from 'antd';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import { Payslip } from '../../../../services/api/types';
import { useDownloadPayslipPDF } from '../../../../hooks/api/usePayroll';
import { pakCurrency } from '../../../../constants';

const { Title, Text } = Typography;

interface PayslipDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  payslip?: Payslip | null;
  loading?: boolean;
}

const PayslipDetailsModal: React.FC<PayslipDetailsModalProps> = ({
  visible,
  onCancel,
  payslip,
  loading = false,
}) => {
  const downloadPDF = useDownloadPayslipPDF();

  const handleDownload = () => {
    if (payslip) {
      downloadPDF.mutate(payslip.id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Modal
        title="Loading Payslip Details"
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
      >
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </Modal>
    );
  }

  if (!payslip) {
    return (
      <Modal
        title="Payslip Details"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Empty description="No payslip data available" />
      </Modal>
    );
  }

  const payPeriod = `${new Date(payslip.pay_period_start).toLocaleDateString()} - ${new Date(payslip.pay_period_end).toLocaleDateString()}`;
  const earnings = payslip.earnings || [];
  const deductions = payslip.deductions || [];

  return (
    <Modal
      title={`Payslip Details - ${payPeriod}`}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
          Print
        </Button>,
        <Button 
          key="download" 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          loading={downloadPDF.isPending}
        >
          Download PDF
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Close
        </Button>,
      ]}
      width={800}
      style={{ top: 20 }}
    >
      <div style={{ padding: '16px' }}>
        <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="Employee Name">{payslip.employee_name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Payslip Number">{payslip.payslip_number}</Descriptions.Item>
          <Descriptions.Item label="Pay Period">{payPeriod}</Descriptions.Item>
          <Descriptions.Item label="Pay Date">{new Date(payslip.pay_date).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Basic Salary">{pakCurrency}{payslip.basic_salary.toFixed(2)}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={payslip.status === 'paid' ? 'green' : payslip.status === 'approved' ? 'blue' : 'orange'}>
              {payslip.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} md={12}>
            <Card title="Earnings" size="small" style={{ borderRadius: '8px' }}>
              <List
                dataSource={earnings}
                renderItem={(item) => (
                  <List.Item>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Text>{item.type}</Text>
                      <Text>{pakCurrency}{item.amount.toFixed(2)}</Text>
                    </div>
                  </List.Item>
                )}
              />
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Total Earnings</Text>
                <Text strong>{pakCurrency}{payslip.total_earnings.toFixed(2)}</Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Deductions" size="small" style={{ borderRadius: '8px' }}>
              <List
                dataSource={deductions}
                renderItem={(item) => (
                  <List.Item>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Text>{item.type}</Text>
                      <Text>{pakCurrency}{item.amount.toFixed(2)}</Text>
                    </div>
                  </List.Item>
                )}
              />
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Total Deductions</Text>
                <Text strong>{pakCurrency}{payslip.total_deductions.toFixed(2)}</Text>
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="Summary" size="small" style={{ borderRadius: '8px' }}>
          <Descriptions column={1}>
            <Descriptions.Item label="Gross Earnings">
              <Text>{pakCurrency}{payslip.total_earnings.toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Total Deductions">
              <Text>{pakCurrency}{payslip.total_deductions.toFixed(2)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Net Pay">
              <Title level={4} style={{ color: '#52c41a' }}>{pakCurrency}{payslip.net_salary.toFixed(2)}</Title>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </Modal>
  );
};

export default PayslipDetailsModal;