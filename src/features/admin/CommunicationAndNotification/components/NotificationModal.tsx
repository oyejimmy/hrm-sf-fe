import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker, Button } from "antd";
import { Notification } from "../types";

const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (data: Notification) => void;
  record: Notification | null;
}

const NotificationModal: React.FC<Props> = ({ visible, onClose, onSave, record }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave({ ...values, date: values.date.format("YYYY-MM-DD") });
      form.resetFields();
    });
  };

  return (
    <Modal
      open={visible}
      title={record ? "Edit Notification" : "Add Notification"}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input placeholder="Enter notification title" />
        </Form.Item>

        <Form.Item
          name="message"
          label="Message"
          rules={[{ required: true, message: "Please enter message" }]}
        >
          <Input.TextArea placeholder="Enter message" rows={4} />
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: "Please select priority" }]}
        >
          <Select placeholder="Select priority">
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" block onClick={handleOk}>
            {record ? "Update Notification" : "Add Notification"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NotificationModal;
