import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Space,
  Radio,
  message,
  Row,
  Col,
  Alert,
  Grid,
  Avatar,
  Typography,
} from "antd";
import { Send, User, X } from "lucide-react";
import styled from "styled-components";
import { DurationType, Employee } from "../types";
import { DATE_FORMATS } from "../../../../constants";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useMyEmployeeDetails } from "../../../../hooks/api/useEmployees";
import { generateLeavePDF } from "./helper";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const StyledModal = styled(Modal)<{ $isDarkMode: boolean }>`
  .ant-modal-content {
    background: ${(props) =>
      props.$isDarkMode ? "var(--surface)" : "#ffffff"};
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-modal-header {
    background: ${(props) =>
      props.$isDarkMode ? "var(--surface)" : "#ffffff"};
    border-bottom: 1px solid
      ${(props) => (props.$isDarkMode ? "var(--border)" : "#f0f0f0")};
    padding: 20px 24px;
  }

  .ant-modal-body {
    padding: 24px;
    background: ${(props) =>
      props.$isDarkMode ? "var(--surface)" : "#ffffff"};
  }

  .ant-modal-footer {
    background: ${(props) =>
      props.$isDarkMode ? "var(--surface)" : "#ffffff"};
    border-top: 1px solid
      ${(props) => (props.$isDarkMode ? "var(--border)" : "#f0f0f0")};
    padding: 16px 24px;
  }

  @media (max-width: 768px) {
    .ant-modal-body {
      padding: 16px;
    }

    .ant-modal-header {
      padding: 16px;
    }

    .ant-modal-footer {
      padding: 12px 16px;
    }
  }
`;

const RecipientCard = styled.div<{ $isDarkMode: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid
    ${(props) => (props.$isDarkMode ? "var(--border)" : "#d9d9d9")};
  border-radius: 8px;
  margin: 8px 0;
  background: ${(props) => (props.$isDarkMode ? "var(--surface)" : "#ffffff")};
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary);
    box-shadow: 0 2px 8px rgba(41, 88, 196, 0.1);
  }
`;

interface LeaveRequestFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
  employees: Employee[];
  leaveBalances?: Array<{
    type: string;
    remaining: number;
    totalAllocated: number;
  }>;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  employees,
  leaveBalances = [],
}) => {
  const { isDarkMode } = useTheme();
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const { data: employeeDetails } = useMyEmployeeDetails();
  const [selectedRecipients, setSelectedRecipients] = useState<Employee[]>([]);
  const [durationType, setDurationType] = useState<DurationType>("Full Day");
  const [selectedDates, setSelectedDates] = useState<any[]>([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>("");
  const [calculatedDuration, setCalculatedDuration] = useState<number>(0);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  // Calculate duration when dates change
  useEffect(() => {
    if (selectedDates && selectedDates.length === 2) {
      const start = dayjs(selectedDates[0]);
      const end = dayjs(selectedDates[1]);
      const duration = end.diff(start, "days") + 1;
      setCalculatedDuration(duration);
    }
  }, [selectedDates]);

  // Update available balance when leave type changes
  useEffect(() => {
    if (selectedLeaveType && leaveBalances && leaveBalances.length > 0) {
      const balance = leaveBalances.find((b) => b.type === selectedLeaveType);
      setAvailableBalance(balance?.remaining || 0);
    } else {
      setAvailableBalance(0);
    }
  }, [selectedLeaveType, leaveBalances]);

  const handleSubmit = (values: any) => {
    console.log("Form submitted with values:", values);

    if (selectedRecipients.length === 0) {
      message.error("Please select at least one recipient");
      return;
    }

    if (
      selectedLeaveType !== "Unpaid" &&
      leaveBalances &&
      leaveBalances.length > 0 &&
      calculatedDuration > availableBalance
    ) {
      message.error(
        `Insufficient leave balance. Available: ${availableBalance} days, Requested: ${calculatedDuration} days`
      );
      return;
    }

    const formData = {
      ...values,
      recipients: selectedRecipients.map((r) => r.id),
      recipientDetails: selectedRecipients,
      durationType,
      duration: calculatedDuration,
      appliedAt: new Date().toISOString(),
      status: "Pending",
    };

    console.log("Calling onSubmit with:", formData);
    onSubmit(formData);
    handleCancel();
  };

  const handleRecipientChange = (recipientIds: string[]) => {
    const recipients = employees.filter((emp) => recipientIds.includes(emp.id));
    setSelectedRecipients(recipients);
    form.setFieldsValue({ recipients: recipientIds });
  };

  const removeRecipient = (id: string) => {
    const newRecipients = selectedRecipients.filter((r) => r.id !== id);
    setSelectedRecipients(newRecipients);
    form.setFieldsValue({ recipients: newRecipients.map((r) => r.id) });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedRecipients([]);
    setDurationType("Full Day");
    setSelectedDates([]);
    setSelectedLeaveType("");
    setCalculatedDuration(0);
    setAvailableBalance(0);
    onCancel();
  };

  const handleDateChange = (dates: any) => {
    setSelectedDates(dates);
    form.setFieldsValue({ dates });
  };

  const handleLeaveTypeChange = (type: string) => {
    setSelectedLeaveType(type);
    form.setFieldsValue({ type });
  };

  const isFormValid = () => {
    const values = form.getFieldsValue();
    return (
      values.type &&
      values.dates &&
      values.reason &&
      selectedRecipients.length > 0
    );
  };

  const handleDownloadPDF = async () => {
    const values = form.getFieldsValue();
    const formData = {
      type: values.type,
      dates: selectedDates,
      reason: values.reason,
      recipients: selectedRecipients,
      durationType,
      duration: calculatedDuration,
    };
    
    await generateLeavePDF(formData, employeeDetails, leaveBalances);
  };

  return (
    <StyledModal
      title="Submit Leave Request"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key="cancel"
          onClick={handleCancel}
          size={screens.xs ? "small" : "middle"}
        >
          Cancel
        </Button>,
        selectedLeaveType === "Annual" && (
          <Button
            key="download"
            onClick={handleDownloadPDF}
            disabled={!isFormValid()}
            size={screens.xs ? "small" : "middle"}
          >
            Download Form
          </Button>
        ),
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => {
            console.log("Submit button clicked");
            form.submit();
          }}
          size={screens.xs ? "small" : "middle"}
        >
          {screens.xs ? "Submit" : "Submit Request"}
        </Button>,
      ].filter(Boolean)}
      width={800}
      centered
      $isDarkMode={isDarkMode}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        scrollToFirstError
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Leave Type"
                name="type"
                rules={[
                  { required: true, message: "Please select leave type" },
                ]}
              >
                <Select
                  placeholder="Select leave type"
                  onChange={handleLeaveTypeChange}
                  size={screens.xs ? "small" : "middle"}
                  loading={!leaveBalances}
                >
                  {leaveBalances && leaveBalances.length > 0
                    ? leaveBalances.map((balance) => (
                        <Option key={balance.type} value={balance.type}>
                          <span>
                            {balance.type} Leave ({balance.remaining} days left)
                          </span>
                        </Option>
                      ))
                    : [
                        "Annual",
                        "Sick",
                        "Casual",
                        "Maternity",
                        "Paternity",
                      ].map((type) => (
                        <Option key={type} value={type}>
                          <span>{type} Leave</span>
                        </Option>
                      ))}
                  <Option value="Unpaid">
                    <span>Unpaid Leave</span>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Duration Type">
                <Radio.Group
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value)}
                  buttonStyle="solid"
                  size={screens.xs ? "small" : "middle"}
                >
                  <Radio.Button value="Full Day">Full Day</Radio.Button>
                  <Radio.Button value="Half Day - Morning">AM</Radio.Button>
                  <Radio.Button value="Half Day - Afternoon">PM</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {selectedLeaveType && selectedLeaveType !== "Unpaid" && (
            <Alert
              message={
                leaveBalances && leaveBalances.length > 0
                  ? `Available ${selectedLeaveType} Leave Balance: ${availableBalance} days`
                  : `Leave balance information loading...`
              }
              type={
                leaveBalances &&
                leaveBalances.length > 0 &&
                availableBalance > 0
                  ? "info"
                  : "warning"
              }
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Form.Item
            label="Date Range"
            name="dates"
            rules={[{ required: true, message: "Please select dates" }]}
          >
            <RangePicker
              style={{ width: "100%" }}
              format={DATE_FORMATS.DISPLAY}
              onChange={handleDateChange}
              size={screens.xs ? "small" : "middle"}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
            />
          </Form.Item>

          {calculatedDuration > 0 && (
            <div
              style={{
                padding: 16,
                background: isDarkMode ? "var(--surface)" : "#f8f9fa",
                border: `1px solid ${isDarkMode ? "var(--border)" : "#e9ecef"}`,
                borderRadius: 8,
                marginTop: 16,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <span>
                    <strong>
                      Duration: {calculatedDuration} day
                      {calculatedDuration !== 1 ? "s" : ""}
                    </strong>
                  </span>
                </Col>
                <Col span={12}>
                  <span>
                    <strong>Type: {durationType}</strong>
                  </span>
                </Col>
              </Row>
              {selectedLeaveType !== "Unpaid" &&
                leaveBalances &&
                leaveBalances.length > 0 &&
                calculatedDuration > availableBalance && (
                  <Alert
                    message="Insufficient leave balance"
                    description={`You are requesting ${calculatedDuration} days but only have ${availableBalance} days available.`}
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: "Please provide reason" }]}
          >
            <TextArea
              rows={4}
              placeholder="Please provide detailed reason for your leave request"
              maxLength={500}
              showCount
            />
          </Form.Item>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Form.Item
            label="Notify Recipients"
            name="recipients"
            rules={[
              {
                required: true,
                message: "Please select at least one recipient",
              },
            ]}
            help="Select managers, HR personnel, or team leads who should be notified"
          >
            <Select
              mode="multiple"
              placeholder="Select recipients to notify"
              onChange={handleRecipientChange}
              style={{ width: "100%" }}
              size={screens.xs ? "small" : "middle"}
              value={selectedRecipients.map((r) => r.id)}
            >
              {employees.map((emp) => (
                <Option key={emp.id} value={emp.id}>
                  <Space>
                    <Avatar size="small" icon={<User size={14} />} />
                    <span>{emp.name}</span>
                    <Text type="secondary">- {emp.role}</Text>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          {selectedRecipients.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                Selected Recipients:
              </div>
              {selectedRecipients.map((recipient) => (
                <RecipientCard key={recipient.id} $isDarkMode={isDarkMode}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{recipient.name}</div>
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>
                      {recipient.email} • {recipient.department}
                    </div>
                  </div>
                  <Button
                    type="text"
                    icon={<X size={14} />}
                    onClick={() => removeRecipient(recipient.id)}
                    size="small"
                    danger
                  />
                </RecipientCard>
              ))}
            </div>
          )}
        </div>
      </Form>
    </StyledModal>
  );
};

export default LeaveRequestForm;
