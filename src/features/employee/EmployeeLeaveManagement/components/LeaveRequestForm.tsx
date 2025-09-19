import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  Button,
  Space,
  Radio,
  Divider,
  Avatar,
  message,
  Row,
  Col
} from 'antd';
import { Send, Upload as UploadIcon, User, Mail, Building, X } from 'lucide-react';
import styled from 'styled-components';
import { DurationType, Employee } from '../types';

const { RangePicker } = DatePicker; // Destructure RangePicker from DatePicker
const { TextArea } = Input; // Destructure TextArea from Input
const { Option } = Select; // Destructure Option from Select

// Styled component for recipient card
const RecipientCard = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin: 4px 0;
  background: var(--surface);
`;

// Styled component for recipient information
const RecipientInfo = styled.div`
  margin-left: 8px;
  flex: 1;
`;

// Styled component for the modal to apply custom styles
const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 20px;
  }
  
  @media (max-width: 576px) {
    .ant-modal-body {
      padding: 16px;
    }
  }
`;

// Interface for LeaveRequestForm component props
interface LeaveRequestFormProps {
  visible: boolean; // Controls modal visibility
  onCancel: () => void; // Callback for modal cancellation
  onSubmit: (values: any) => void; // Callback for form submission
  loading?: boolean; // Loading state for the form
  employees: Employee[]; // List of employees for recipient selection
}

// LeaveRequestForm functional component
const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  employees
}) => {
  const [form] = Form.useForm(); // Initialize Ant Design form hook
  const [selectedRecipients, setSelectedRecipients] = useState<Employee[]>([]); // State for selected recipients
  const [durationType, setDurationType] = useState<DurationType>('Full Day'); // State for leave duration type

  // Handler for form submission
  const handleSubmit = (values: any) => {
    if (selectedRecipients.length === 0) {
      message.error('Please select at least one recipient'); // Show error if no recipients selected
      return;
    }

    // Prepare form data for submission
    const formData = {
      ...values,
      recipients: selectedRecipients.map(r => r.id), // Map selected recipients to their IDs
      recipientDetails: selectedRecipients, // Include full recipient details
      durationType,
      appliedAt: new Date().toISOString(), // Set application date to current ISO string
      status: 'Pending' // Set initial status to Pending
    };

    onSubmit(formData); // Call onSubmit prop with prepared data
  };

  // Handler for recipient selection change
  const handleRecipientChange = (recipientIds: string[]) => {
    const recipients = employees.filter(emp => recipientIds.includes(emp.id)); // Filter employees based on selected IDs
    setSelectedRecipients(recipients); // Update selected recipients state
  };

  // Handler to remove a recipient
  const removeRecipient = (id: string) => {
    setSelectedRecipients(prev => prev.filter(r => r.id !== id)); // Remove recipient from state
    const currentRecipients = form.getFieldValue('recipients') || []; // Get current form recipients
    form.setFieldsValue({
      recipients: currentRecipients.filter((r: string) => r !== id) // Update form field value
    });
  };

  // Handler for modal cancellation
  const handleCancel = () => {
    form.resetFields(); // Reset form fields
    setSelectedRecipients([]); // Clear selected recipients
    setDurationType('Full Day'); // Reset duration type
    onCancel(); // Call onCancel prop
  };

  return (
    <StyledModal
      title="Submit Leave Request" // Modal title
      open={visible} // Control modal visibility
      onCancel={handleCancel} // Handle modal close
      footer={[
        <Button onClick={handleCancel}>Cancel</Button>, // Cancel button
        <Button type="primary" htmlType="submit" icon={<Send size={16} />} loading={loading}> // Submit button
          Submit Request
        </Button>,
      ]}
      width={700} // Modal width
      centered // Center modal on screen
      style={{ maxWidth: '90vw' }} // Max width for responsiveness
      closeIcon={null} // Hide default close icon
    >
      <Form
        form={form} // Pass form instance
        layout="vertical" // Form layout
        onFinish={handleSubmit} // Handle form submission
      >
        <Row gutter={16}> {/* Row for layout with gutter */}
          <Col xs={24} sm={12}> {/* Column for responsive layout */}
            <Form.Item
              label="Leave Type" // Label for leave type input
              name="type" // Name of the form item
              rules={[{ required: true, message: 'Please select leave type' }]} // Validation rules
            >
              <Select placeholder="Select leave type"> {/* Select component for leave type */}
                <Option value="Annual">Annual Leave</Option> // Option for Annual Leave
                <Option value="Sick">Sick Leave</Option> // Option for Sick Leave
                <Option value="Casual">Casual Leave</Option> // Option for Casual Leave
                <Option value="Maternity">Maternity Leave</Option> // Option for Maternity Leave
                <Option value="Paternity">Paternity Leave</Option> // Option for Paternity Leave
                <Option value="Unpaid">Unpaid Leave</Option> // Option for Unpaid Leave
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}> {/* Column for responsive layout */}
            <Form.Item label="Duration Type"> {/* Label for duration type radio group */}
              <Radio.Group
                value={durationType}
                onChange={(e) => setDurationType(e.target.value)} // Handle duration type change
                buttonStyle="solid" // Solid button style
              >
                <Radio.Button value="Full Day">Full Day</Radio.Button> // Full Day option
                <Radio.Button value="Half Day - Morning">Half Day AM</Radio.Button> // Half Day Morning option
                <Radio.Button value="Half Day - Afternoon">Half Day PM</Radio.Button> // Half Day Afternoon option
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Date Range" // Label for date range picker
          name="dates" // Name of the form item
          rules={[{ required: true, message: 'Please select dates' }]} // Validation rules
        >
          <RangePicker style={{ width: '100%' }} /> {/* Date range picker component */}
        </Form.Item>

        <Form.Item
          label="Reason" // Label for reason textarea
          name="reason" // Name of the form item
          rules={[{ required: true, message: 'Please provide reason' }]} // Validation rules
        >
          <TextArea rows={3} placeholder="Please provide details for your leave request" /> {/* Textarea for reason */}
        </Form.Item>

        <Form.Item label="Attachment (Optional)"> {/* Label for attachment upload */}
          <Upload> {/* Upload component */}
            <Button icon={<UploadIcon size={16} />}>Upload Document</Button> // Upload button
          </Upload>
        </Form.Item>

        <Divider>Select Recipients</Divider> {/* Divider for recipient selection section */}

        <Form.Item
          label="Notify Recipients" // Label for recipient selection
          name="recipients" // Name of the form item
          rules={[{ required: true, message: 'Please select at least one recipient' }]} // Validation rules
          help="Select HR managers, team leads, or other Team member who should be notified" // Help text
        >
          <Select
            mode="multiple" // Allow multiple selections
            placeholder="Select recipients to notify" // Placeholder text
            onChange={handleRecipientChange} // Handle recipient change
            style={{ width: '100%' }} // Full width select
          >
            {employees.map(emp => ( // Map through employees to create options
              <Option key={emp.id} value={emp.id}> {/* Option for each employee */}
                <Space>
                  <Avatar size="small" icon={<User size={14} />} /> {/* Employee avatar */}
                  {emp.name} - {emp.role}
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedRecipients.length > 0 && ( // Conditionally render selected recipients section
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Selected Recipients:</div>
            {selectedRecipients.map(recipient => ( // Map through selected recipients
              <RecipientCard key={recipient.id}> {/* Recipient card component */}
                <Avatar size="small" icon={<User size={14} />} /> {/* Recipient avatar */}
                <RecipientInfo> {/* Recipient information */}
                  <div style={{ fontWeight: 500 }}>{recipient.name}</div> {/* Recipient name */}
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <Mail size={12} style={{ marginRight: 4 }} /> {/* Mail icon */}
                    {recipient.email}
                    <Building size={12} style={{ marginLeft: 8, marginRight: 4 }} /> {/* Building icon */}
                    {recipient.department}
                  </div>
                </RecipientInfo>
                <Button
                  type="text"
                  icon={<X size={14} />} // Close icon for removing recipient
                  onClick={() => removeRecipient(recipient.id)} // Handle recipient removal
                  size="small"
                />
              </RecipientCard>
            ))}
          </div>
        )}

        <Form.Item>
          <Space>

          </Space>
        </Form.Item>
      </Form>
    </StyledModal>
  );
};

export default LeaveRequestForm; 