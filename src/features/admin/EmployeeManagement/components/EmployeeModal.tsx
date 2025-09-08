import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Button, Row, Col, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Employee } from "../types";

const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Employee) => void;
  record: Employee | null | any;
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
  }
`;

const EmployeeModal: React.FC<Props> = ({ visible, onClose, onSave, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleOk = () => {
    form.validateFields().then((values: any) => {
      const file = values.profilePicture?.file?.originFileObj;
      const fakeUrl = file ? URL.createObjectURL(file) : record?.profilePicture || "";

      onSave({
        ...record,
        ...values,
        profilePicture: fakeUrl,
        id: record?.id ?? Date.now(),
      });
      onClose();
    });
  };

  return (
    <StyledModal
      open={visible}
      title={record ? "Edit Employee" : "Add Employee"}
      onCancel={onClose}
      footer={null}
      centered
      width={700}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select placeholder="Select gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="dob" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD-MM-YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="department" label="Department" rules={[{ required: true }]}>
              <Input placeholder="Enter department" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="designation" label="Designation" rules={[{ required: true }]}>
              <Input placeholder="Enter designation" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}>
              <Input placeholder="Enter employee ID" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select>
                <Option value="Admin">Admin</Option>
                <Option value="User">User</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            {!record && (
              <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password placeholder="Set password" />
              </Form.Item>
            )}
            {record && (
              <Form.Item label="Reset Password" name="resetPassword" valuePropName="checked">
                <Switch />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Form.Item name="address" label="Address">
          <Input.TextArea rows={2} placeholder="Enter address" />
        </Form.Item>

        <Form.Item name="emergencyContact" label="Emergency Contact">
          <Input placeholder="Enter emergency contact" />
        </Form.Item>

        <Form.Item name="profilePicture" label="Profile Picture">
          <Upload beforeUpload={() => false} maxCount={1}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Button type="primary" block onClick={handleOk}>
          {record ? "Update Employee" : "Add Employee"}
        </Button>
      </Form>
    </StyledModal>
  );
};

export default EmployeeModal;
