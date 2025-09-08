import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { EmployeeDocument } from "../types";

const { Option } = Select;

interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: (data: EmployeeDocument) => void;
    record: EmployeeDocument | null;
}

const DocumentModal: React.FC<Props> = ({ visible, onClose, onSave, record }) => {
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
            const file = values.file?.file?.originFileObj;
            const fakeUrl = file ? URL.createObjectURL(file) : record?.fileUrl || "";

            onSave({
                ...record,
                ...values,
                fileName: file ? file.name : record?.fileName || "",
                fileUrl: fakeUrl,
                uploadDate: new Date().toISOString().split("T")[0],
            });
            form.resetFields();
        });
    };

    return (
        <Modal
            open={visible}
            title={record ? "Edit Document" : "Add Document"}
            onCancel={onClose}
            footer={null}
            centered
            destroyOnClose
            width={500}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="employeeName"
                    label="Employee Name"
                    rules={[{ required: true, message: "Please enter employee name" }]}
                >
                    <Input placeholder="Enter employee name" />
                </Form.Item>

                <Form.Item
                    name="documentType"
                    label="Document Type"
                    rules={[{ required: true, message: "Please select document type" }]}
                >
                    <Select placeholder="Select document type">
                        <Option value="Recommendation">Recommendation</Option>
                        <Option value="NIC">NIC</Option>
                        <Option value="Employee Card">Employee Card</Option>
                        <Option value="Certificate">Certificate</Option>
                        <Option value="Transcript">Transcript</Option>
                        <Option value="Experience Letter">Experience Letter</Option>
                        <Option value="Other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="file"
                    label="Upload File"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                    rules={[{ required: !record, message: "Please upload a file" }]}
                >
                    <Upload beforeUpload={() => false} maxCount={1}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" block onClick={handleOk}>
                        {record ? "Update Document" : "Add Document"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DocumentModal;
