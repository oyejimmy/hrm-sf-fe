import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, InputNumber, Button, Upload, Row, Col, Typography, Divider, Card, Space, List } from 'antd';
import { UploadOutlined, DeleteOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface NewClaimModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  hospitals?: any[];
}

const NewClaimModal: React.FC<NewClaimModalProps> = ({ visible, onCancel, onSubmit, loading, hospitals }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleSubmit = (values: any) => {
    const formData = {
      ...values,
      documents: fileList.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))
    };
    onSubmit(formData);
    form.resetFields();
    setFileList([]);
  };

  const handleUpload = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const removeFile = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid));
  };

  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined style={{ color: '#2958C4' }} />
          Reimbursement Claim Form
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div style={{ marginBottom: 32 }}>
          <Typography.Title level={5} style={{ color: '#2958C4', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #f0f0f0' }}>
            Patient Information
          </Typography.Title>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="patient_name"
                label="Patient Name"
                rules={[{ required: true, message: 'Please enter patient name' }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="patient_relationship"
                label="Relationship"
                rules={[{ required: true, message: 'Please select relationship' }]}
              >
                <Select placeholder="Select relationship">
                  <Option value="self">Self</Option>
                  <Option value="spouse">Spouse</Option>
                  <Option value="child">Child</Option>
                  <Option value="parent">Parent</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="patient_cnic"
                label="Patient CNIC"
                rules={[{ required: true, message: 'Please enter CNIC' }]}
              >
                <Input placeholder="42101-1234567-8" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="patient_age"
                label="Patient Age"
                rules={[{ required: true, message: 'Please enter age' }]}
              >
                <InputNumber placeholder="Age" min={0} max={120} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 32 }}>
          <Typography.Title level={5} style={{ color: '#2958C4', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #f0f0f0' }}>
            Treatment Details
          </Typography.Title>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="claim_type"
                label="Claim Type"
                rules={[{ required: true, message: 'Please select claim type' }]}
              >
                <Select placeholder="Select claim type">
                  <Option value="medical">Medical</Option>
                  <Option value="dental">Dental</Option>
                  <Option value="optical">Optical</Option>
                  <Option value="maternity">Maternity</Option>
                  <Option value="emergency">Emergency</Option>
                  <Option value="pharmacy">Pharmacy</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="treatment_date"
                label="Treatment Date"
                rules={[{ required: true, message: 'Please select treatment date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="hospital_id"
                label="Hospital/Clinic"
                rules={[{ required: true, message: 'Please select hospital' }]}
              >
                <Select placeholder="Select hospital/clinic" showSearch>
                  {hospitals?.map(hospital => (
                    <Option key={hospital.id} value={hospital.id}>
                      {hospital.name} - {hospital.city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="doctor_name"
                label="Doctor Name"
                rules={[{ required: true, message: 'Please enter doctor name' }]}
              >
                <Input placeholder="Dr. Name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="diagnosis"
            label="Diagnosis/Treatment Description"
            rules={[{ required: true, message: 'Please enter diagnosis' }]}
          >
            <TextArea rows={3} placeholder="Describe the medical condition and treatment received" />
          </Form.Item>
        </div>

        <div style={{ marginBottom: 32 }}>
          <Typography.Title level={5} style={{ color: '#2958C4', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #f0f0f0' }}>
            Financial Information
          </Typography.Title>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="total_bill_amount"
                label="Total Bill Amount (PKR)"
                rules={[{ required: true, message: 'Please enter bill amount' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="claimed_amount"
                label="Claimed Amount (PKR)"
                rules={[{ required: true, message: 'Please enter claimed amount' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="payment_method"
                label="Payment Method"
                rules={[{ required: true, message: 'Please select payment method' }]}
              >
                <Select placeholder="How was the bill paid?">
                  <Option value="cash">Cash</Option>
                  <Option value="card">Credit/Debit Card</Option>
                  <Option value="bank_transfer">Bank Transfer</Option>
                  <Option value="insurance_direct">Direct Insurance Payment</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="additional_notes"
                label="Additional Notes"
              >
                <Input placeholder="Optional notes" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 32 }}>
          <Typography.Title level={5} style={{ color: '#2958C4', marginBottom: 16, paddingBottom: 8, borderBottom: '2px solid #f0f0f0' }}>
            Required Documents
          </Typography.Title>
          <Card style={{ background: 'rgba(41, 88, 196, 0.02)', border: '1px solid rgba(41, 88, 196, 0.1)' }}>
            <Text type="secondary" style={{ marginBottom: 16, display: 'block' }}>
              Please upload the following documents (PDF, JPG, PNG - Max 5MB each):
            </Text>
            <List
              size="small"
              dataSource={[
                'Original medical bills/receipts',
                'Prescription (if applicable)',
                'Medical reports/test results',
                'Discharge summary (for hospitalization)',
                'CNIC copy of patient',
                'Bank account details (for reimbursement)'
              ]}
              renderItem={item => <List.Item style={{ padding: '4px 0', color: '#6b7280', fontSize: 14 }}>{item}</List.Item>}
            />
            
            <Upload
              multiple
              fileList={fileList}
              onChange={handleUpload}
              beforeUpload={() => false}
              accept=".pdf,.jpg,.jpeg,.png"
            >
              <Button 
                style={{
                  width: '100%',
                  height: 48,
                  border: '2px dashed #2958C4',
                  color: '#2958C4',
                  fontWeight: 500,
                  margin: '16px 0'
                }}
                icon={<UploadOutlined />}
              >
                Upload Documents
              </Button>
            </Upload>

            {fileList.length > 0 && (
              <List
                style={{ marginTop: 16, maxHeight: 200, overflowY: 'auto' }}
                dataSource={fileList}
                renderItem={file => (
                  <List.Item
                    style={{
                      padding: '8px 12px',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: 6,
                      marginBottom: 8
                    }}
                    actions={[
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeFile(file)}
                        danger
                      />
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined style={{ color: '#2958C4' }} />}
                      title={file.name}
                      description={`${Math.round((file.size || 0) / 1024)} KB`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>



        <Divider />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={onCancel} size="large">
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading} 
            size="large"
            icon={<PlusOutlined />}
          >
            Submit Claim
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default NewClaimModal;