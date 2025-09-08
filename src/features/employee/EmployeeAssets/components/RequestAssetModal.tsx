import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const RequestAssetModal: React.FC<Props> = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal open={visible} title="Request New Asset" footer={null} onCancel={onClose}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select options={[{ value: "Laptop" }, { value: "Monitor" }, { value: "Phone" }]} />
        </Form.Item>
        <Form.Item label="Justification" name="justification" rules={[{ required: true }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Urgency" name="urgency">
          <Select options={[{ value: "Low" }, { value: "Medium" }, { value: "High" }]} />
        </Form.Item>
        <Form.Item label="Estimated Duration" name="duration">
          <Input placeholder="e.g. 6 months" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit Request
        </Button>
      </Form>
    </Modal>
  );
};

export default RequestAssetModal;
