// features/employee/Assets/components/ReturnAssetModal.tsx
import React, { useState } from "react";
import { Modal, Form, DatePicker, Select, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import type { Asset } from "../types";

const { TextArea } = Input;
const { Option } = Select;

interface ReturnPayload {
  assetId: string;
  returnDate?: string;
  condition: "Returned" | "Damaged" | "Needs Repair";
  notes?: string;
  photos?: File[]; // optional evidence
}

interface Props {
  visible: boolean;
  asset?: Asset | null;
  onClose: () => void;
  onSubmit: (payload: ReturnPayload) => void;
}

/**
 * ReturnAssetModal - used by employee to initiate a return
 * - collects return date, condition, notes and optional photos/evidence
 * - photos are not auto-uploaded (beforeUpload => false), caller receives File objects
 */
const ReturnAssetModal: React.FC<Props> = ({ visible, asset, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFinish = (values: any) => {
    if (!asset) {
      message.error("No asset selected.");
      return;
    }

    // convert date (dayjs/moment) to ISO string if present
    const returnDate = values.returnDate ? values.returnDate.toISOString() : undefined;

    const photos: File[] = (fileList || [])
      .map((f) => (f.originFileObj instanceof File ? (f.originFileObj as File) : undefined))
      .filter(Boolean) as File[];

    const payload: ReturnPayload = {
      assetId: asset.id,
      returnDate,
      condition: values.condition,
      notes: values.notes,
      photos,
    };

    onSubmit(payload);
    message.success("Return request submitted.");
    form.resetFields();
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      open={visible}
      title={asset ? `Return - ${asset.name}` : "Return Asset"}
      onCancel={() => {
        form.resetFields();
        setFileList([]);
        onClose();
      }}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item label="Asset" >
          <Input value={asset?.name ?? ""} disabled />
        </Form.Item>

        <Form.Item label="Expected Return Date" name="returnDate">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Condition on Return"
          name="condition"
          rules={[{ required: true, message: "Please select condition" }]}
          initialValue="Returned"
        >
          <Select>
            <Option value="Returned">Returned (Good)</Option>
            <Option value="Needs Repair">Needs Repair</Option>
            <Option value="Damaged">Damaged</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Notes (optional)" name="notes">
          <TextArea rows={3} placeholder="Describe condition, issues, or notes for admin" />
        </Form.Item>

        <Form.Item label="Attach photos (optional)">
          <Upload
            fileList={fileList}
            beforeUpload={() => false} // don't auto upload
            onChange={({ fileList: fl }) => setFileList(fl)}
            multiple
            accept="image/*"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Attach Photo(s)</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Submit Return Request
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReturnAssetModal;
