import React from "react";
import { Modal, Select, Input } from "antd";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  employeeName: string;
}

const { Option } = Select;

const DeleteConfirm: React.FC<Props> = ({ visible, onClose, onConfirm, employeeName }) => {
  let reason: string | undefined;

  return (
    <Modal
      open={visible}
      title="Delete Employee"
      onCancel={onClose}
      onOk={() => onConfirm(reason)}
      okText="Confirm"
      cancelText="Cancel"
      centered
    >
      <p>Are you sure you want to delete <b>{employeeName}</b>?</p>
      <Select
        style={{ width: "100%", marginBottom: "8px" }}
        placeholder="Reason for deletion (optional)"
        onChange={(val) => (reason = val)}
        allowClear
      >
        <Option value="Resigned">Resigned</Option>
        <Option value="Terminated">Terminated</Option>
        <Option value="Other">Other</Option>
      </Select>
      <Input.TextArea rows={2} placeholder="Additional notes (optional)" onChange={(e) => (reason = e.target.value)} />
    </Modal>
  );
};

export default DeleteConfirm;
