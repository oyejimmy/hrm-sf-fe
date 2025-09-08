import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import { Attendance, LeaveRequest } from "../types";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Attendance | LeaveRequest) => void;
  type: "attendance" | "leave";
  record: Attendance | LeaveRequest | null;
}

const AttendanceAndLeaveModal: React.FC<Props> = ({ visible, onClose, onSave, type, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      if (type === "leave" && "startDate" in record) {
        form.setFieldsValue({
          ...record,
          dateRange: [record.startDate, record.endDate],
        });
      } else {
        form.setFieldsValue(record);
      }
    } else {
      form.resetFields();
    }
  }, [record, form, type]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (type === "leave") {
        const leaveData: LeaveRequest = {
          ...values,
          startDate: values.dateRange[0],
          endDate: values.dateRange[1],
        };
        delete (leaveData as any).dateRange;
        onSave(leaveData);
      } else {
        const attendanceData: Attendance = {
          ...values,
        };
        onSave(attendanceData);
      }
      form.resetFields();
    });
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={type === "attendance" ? "Mark Attendance" : "Request Leave"}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="employeeName"
          label="Employee Name"
          rules={[{ required: true, message: "Please enter employee name" }]}
        >
          <Input placeholder="Enter employee name" />
        </Form.Item>

        {type === "attendance" ? (
          <>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select placeholder="Select status">
                <Option value="Present">Present</Option>
                <Option value="Absent">Absent</Option>
                <Option value="Leave">Leave</Option>
              </Select>
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              name="leaveType"
              label="Leave Type"
              rules={[{ required: true, message: "Please select leave type" }]}
            >
              <Select placeholder="Select leave type">
                <Option value="Sick">Sick</Option>
                <Option value="Casual">Casual</Option>
                <Option value="Annual">Annual</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Leave Duration"
              rules={[{ required: true, message: "Please select date range" }]}
            >
              <RangePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Reason"
              rules={[{ required: true, message: "Please provide reason" }]}
            >
              <Input.TextArea placeholder="Enter reason for leave" rows={3} />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" block onClick={handleOk}>
            {type === "attendance" ? "Save Attendance" : "Submit Leave Request"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AttendanceAndLeaveModal;
