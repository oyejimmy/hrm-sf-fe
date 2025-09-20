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
} from 'antd';
import { PrinterOutlined, DownloadOutlined } from '@ant-design/icons';
import { Card } from 'antd';

const { Title, Text } = Typography;

// Mock data to make the component self-contained
const mockPayslip = {
  payPeriod: 'November 2024',
  issueDate: '23 November 2024',
  status: 'Paid',
  grossPay: 40000.00,
  deductions: 50000.00,
  netPay: 10000.00,
};

const mockEarnings = [
  { type: 'Basic Salary', amount: 10000.00 },
  { type: 'Allowances', amount: 10000.00 },
  { type: 'Other Benefits', amount: 10000.00 },
  { type: 'Bonus', amount: 10000.00 },
];

const mockDeductions = [
  { type: 'Income Tax', amount: 10000.00 },
  { type: 'EOBI Deduction', amount: 10000.00 },
  { type: 'Lunch Deduction', amount: 10000.00 },
  { type: 'Loan/Advance', amount: 10000.00 },
  { type: 'Provident Fund', amount: 10000.00 },
];

interface PayslipDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  payslip: any;
  earnings: any[];
  deductions: any[];
}

const PayslipDetailsModal: React.FC<PayslipDetailsModalProps> = ({
  visible = true,
  onCancel = () => {},
  payslip = mockPayslip,
  earnings = mockEarnings,
  deductions = mockDeductions,
}) => {
  return (
    <Modal
      title={payslip ? `Payslip Details - ${payslip.payPeriod}` : 'Payslip Details'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="print" icon={<PrinterOutlined />}>
          Print
        </Button>,
        <Button key="download" type="primary" icon={<DownloadOutlined />}>
          Download PDF
        </Button>,
      ]}
      width={800}
      style={{ top: 20 }}
    >
      {payslip && (
        <div style={{ padding: '16px' }}>
          <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
            <Descriptions.Item label="Employee Name">John Doe</Descriptions.Item>
            <Descriptions.Item label="Employee ID">EMP-12345</Descriptions.Item>
            <Descriptions.Item label="Pay Period">{payslip.payPeriod}</Descriptions.Item>
            <Descriptions.Item label="Issue Date">{payslip.issueDate}</Descriptions.Item>
            <Descriptions.Item label="Payment Method">Direct Deposit</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color="green">{payslip.status}</Tag>
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
                        <Text>PKR{item.amount.toFixed(2)}</Text>
                      </div>
                    </List.Item>
                  )}
                />
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Total Earnings</Text>
                  <Text strong>PKR{payslip.grossPay.toFixed(2)}</Text>
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
                        <Text>PKR{item.amount.toFixed(2)}</Text>
                      </div>
                    </List.Item>
                  )}
                />
                <Divider style={{ margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Total Deductions</Text>
                  <Text strong>PKR{payslip.deductions.toFixed(2)}</Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Card title="Summary" size="small" style={{ borderRadius: '8px' }}>
            <Descriptions column={1}>
              <Descriptions.Item label="Gross Earnings">
                <Text>PKR{payslip.grossPay.toFixed(2)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Total Deductions">
                <Text>PKR{payslip.deductions.toFixed(2)}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Net Pay">
                <Title level={4}>PKR{payslip.netPay.toFixed(2)}</Title>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>
      )}
    </Modal>
  );
};

export default PayslipDetailsModal;
