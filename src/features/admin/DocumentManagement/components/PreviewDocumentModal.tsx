import React from "react";
import { Modal, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { EmployeeDocument } from "../types";

interface Props {
    visible: boolean;
    onClose: () => void;
    record: EmployeeDocument | null;
}

const PreviewDocumentModal: React.FC<Props> = ({ visible, onClose, record }) => {
    if (!record) return null;

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = record.fileUrl;
        link.download = record.fileName;
        link.click();
    };

    const isImage = /\.(jpg|jpeg|png)$/i.test(record.fileName);
    const isPDF = /\.pdf$/i.test(record.fileName);

    return (
        <Modal
            open={visible}
            title={`View Document - ${record.employeeName}`}
            onCancel={onClose}
            footer={[
                <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
                    Download
                </Button>,
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
            ]}
            centered
            width={700}
        >
            {isImage && (
                <img
                    src={record.fileUrl}
                    alt={record.fileName}
                    style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
                />
            )}
            {isPDF && (
                <iframe
                    src={record.fileUrl}
                    title="PDF Preview"
                    style={{ width: "100%", height: "500px", border: "none" }}
                />
            )}
            {!isImage && !isPDF && <p>No preview available. Please download the file.</p>}
        </Modal>
    );
};

export default PreviewDocumentModal;
