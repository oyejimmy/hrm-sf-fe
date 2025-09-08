import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const LeaveRequestModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Request New Leave"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="type" label="Leave Type" rules={[{ required: true }]}>
          <Select
            options={[
              { value: "Annual", label: "Annual" },
              { value: "Sick", label: "Sick" },
              { value: "Casual", label: "Casual" },
              { value: "Compensatory", label: "Compensatory" },
            ]}
          />
        </Form.Item>
        <Form.Item name="fromDate" label="From" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="toDate" label="To" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="attachment" label="Attachment">
          <Upload>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Request
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LeaveRequestModal;
