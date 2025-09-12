import React, { useState } from 'react';
import {
  Modal,
  Upload,
  Button,
  message,
  Typography,
  Space,
  Progress,
  List,
} from 'antd';
import { Upload as UploadIcon, Download, X } from 'lucide-react';
// import Papa from 'papaparse';
import { Employee } from '../types/types';

const { Title, Text } = Typography;

interface ImportCSVModalProps {
  visible: boolean;
  onCancel: () => void;
  onImport: (employees: Employee[]) => void;
}

interface CSVRow {
  name: string;
  email: string;
  position: string;
  department: string;
  status: string;
  joinDate: string;
  leaveDate?: string;
}

export const ImportCSVModal: React.FC<ImportCSVModalProps> = ({
  visible,
  onCancel,
  onImport,
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<Employee[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const beforeUpload = (file: File) => {
    const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
    if (!isCSV) {
      message.error('You can only upload CSV files!');
    }
    return isCSV;
  };

  const handleUpload = (info: any) => {
    if (info.file.status === 'done') {
      setParsing(true);
      
    //   Papa.parse(info.file.originFileObj, {
    //     complete: (results: any) => {
    //       const { data, errors } = results;
          
    //       if (errors.length > 0) {
    //         setErrors(errors.map((e: any) => `Row ${e.row}: ${e.message}`));
    //         message.error('Error parsing CSV file');
    //         setParsing(false);
    //         return;
    //       }
          
    //       // Skip header row and process data
    //       const rows = data.slice(1) as any[];
    //       const employees: Employee[] = [];
    //       const newErrors: string[] = [];
          
    //       rows.forEach((row, index) => {
    //         if (row.length >= 6) {
    //           try {
    //             const employee: Employee = {
    //               id: `imported-${Date.now()}-${index}`,
    //               name: row[0]?.trim(),
    //               email: row[1]?.trim(),
    //               position: row[2]?.trim(),
    //               department: row[3]?.trim(),
    //               status: row[4]?.trim() as 'active' | 'on_leave' | 'inactive',
    //               joinDate: row[5]?.trim(),
    //               leaveDate: row[6]?.trim() || undefined,
    //             };
                
    //             // Basic validation
    //             if (!employee.name || !employee.email || !employee.position || 
    //                 !employee.department || !employee.status || !employee.joinDate) {
    //               newErrors.push(`Row ${index + 2}: Missing required fields`);
    //               return;
    //             }
                
    //             employees.push(employee);
    //           } catch (error) {
    //             newErrors.push(`Row ${index + 2}: Invalid data format`);
    //           }
    //         }
    //       });
          
    //       setParsedData(employees);
    //       setErrors(newErrors);
    //       setParsing(false);
    //       if (newErrors.length === 0) {
    //         message.success(`Successfully parsed ${employees.length} employees`);
    //       } else {
    //         message.warning(`Parsed with ${newErrors.length} errors`);
    //       }
    //     },
    //     error: (error: any) => {
    //       setErrors([error.message]);
    //       setParsing(false);
    //       message.error('Error parsing CSV file');
    //     },
    //     header: false,
    //   });
    }
  };

  const handleImport = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setFileList([]);
    setParsedData([]);
    setErrors([]);
    onCancel();
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
      setParsedData([]);
      setErrors([]);
    },
    beforeUpload: beforeUpload,
    onChange: handleUpload,
    fileList,
    maxCount: 1,
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Name,Email,Position,Department,Status,Join Date,Leave Date\n" +
      "John Doe,john.doe@example.com,Software Engineer,Engineering,active,2023-01-15,\n" +
      "Jane Smith,jane.smith@example.com,Product Manager,Product,on_leave,2022-08-23,2023-10-15";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      title="Import Employees from CSV"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button 
          key="import" 
          type="primary" 
          onClick={handleImport}
          disabled={parsedData.length === 0 || errors.length > 0}
        >
          Import {parsedData.length > 0 ? `(${parsedData.length})` : ''}
        </Button>,
      ]}
      width={700}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Text>
            Import employee data from a CSV file. Download our template to ensure proper formatting.
          </Text>
          <Button 
            type="link" 
            icon={<Download size={14} />} 
            onClick={downloadTemplate}
            style={{ paddingLeft: 8 }}
          >
            Download Template
          </Button>
        </div>

        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <UploadIcon size={32} />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single CSV file upload</p>
        </Upload.Dragger>

        {parsing && (
          <div>
            <Text>Parsing CSV file...</Text>
            <Progress percent={100} status="active" showInfo={false} />
          </div>
        )}

        {parsedData.length > 0 && (
          <div>
            <Title level={5}>Preview ({parsedData.length} employees)</Title>
            <List
              size="small"
              dataSource={parsedData.slice(0, 5)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={`${item.position} - ${item.department}`}
                  />
                </List.Item>
              )}
            />
            {parsedData.length > 5 && (
              <Text type="secondary">+ {parsedData.length - 5} more employees</Text>
            )}
          </div>
        )}

        {errors.length > 0 && (
          <div>
            <Title level={5} type="danger">Errors ({errors.length})</Title>
            <List
              size="small"
              dataSource={errors.slice(0, 5)}
              renderItem={(error) => (
                <List.Item>
                  <Text type="danger">{error}</Text>
                </List.Item>
              )}
            />
            {errors.length > 5 && (
              <Text type="secondary">+ {errors.length - 5} more errors</Text>
            )}
          </div>
        )}
      </Space>
    </Modal>
  );
};