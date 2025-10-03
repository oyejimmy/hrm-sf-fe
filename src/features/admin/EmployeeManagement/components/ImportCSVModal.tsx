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
  Alert,
  Tag,
  Divider,
} from 'antd';
import { Upload as UploadIcon, Download, CheckCircle, XCircle } from 'lucide-react';
import Papa from 'papaparse';
import { useImportEmployees, ImportResult } from '../../../../hooks/api/useImport';
import { downloadCSVTemplate } from '../../../../utils/csvTemplate';

const { Title, Text } = Typography;

interface ImportCSVModalProps {
  visible: boolean;
  onCancel: () => void;
  onImport: (employees: any[]) => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
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
  const [csvData, setCsvData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  
  const importEmployees = useImportEmployees();

  const validateCSVData = (data: any[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    const requiredFields = ['first_name', 'last_name', 'email', 'employee_id'];
    
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push({
            row: index + 1,
            field,
            message: `${field} is required`,
            value: row[field]
          });
        }
      });
      
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        errors.push({
          row: index + 1,
          field: 'email',
          message: 'Invalid email format',
          value: row.email
        });
      }
      
      if (row.hire_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.hire_date)) {
        errors.push({
          row: index + 1,
          field: 'hire_date',
          message: 'Date must be in YYYY-MM-DD format',
          value: row.hire_date
        });
      }
    });
    
    return errors;
  };

  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    setImportResult(null);
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!['csv'].includes(fileExtension || '')) {
      message.error('Please upload a CSV file');
      setIsProcessing(false);
      return false;
    }
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().replace(/\s+/g, '_'),
      complete: (results) => {
        const errors = validateCSVData(results.data as any[]);
        setCsvData(results.data as any[]);
        setValidationErrors(errors);
        setIsProcessing(false);
        
        if (errors.length > 0) {
          message.warning(`File parsed with ${errors.length} validation errors`);
        } else {
          message.success(`Successfully parsed ${results.data.length} records`);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        message.error('Failed to parse CSV file');
        setIsProcessing(false);
      }
    });
    
    return false;
  };

  const handleImport = async () => {
    if (csvData.length === 0) {
      message.warning('Please upload a file first');
      return;
    }
    
    if (validationErrors.length > 0) {
      message.error('Please fix validation errors before importing');
      return;
    }
    
    try {
      const result = await importEmployees.mutateAsync(csvData);
      setImportResult(result);
      
      if (result.failed === 0) {
        setTimeout(() => {
          handleCancel();
        }, 2000);
      }
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const handleCancel = () => {
    setFileList([]);
    setCsvData([]);
    setValidationErrors([]);
    setImportResult(null);
    setIsProcessing(false);
    setShowErrors(false);
    onCancel();
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
        validationErrors.length > 0 && (
          <Button 
            key="errors" 
            onClick={() => setShowErrors(!showErrors)}
          >
            {showErrors ? 'Hide' : 'Show'} Errors ({validationErrors.length})
          </Button>
        ),
        <Button 
          key="import" 
          type="primary" 
          onClick={handleImport}
          disabled={csvData.length === 0 || validationErrors.length > 0}
          loading={importEmployees.isPending}
        >
          Import {csvData.length > 0 && `(${csvData.length} records)`}
        </Button>,
      ]}
      width={700}
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          Import employee data from a CSV file. Download our template to ensure proper formatting.
        </Text>
      </div>
      
      <Alert
        message="Template Download"
        description={
          <div>
            <Text>Download the CSV template with the correct format and sample data.</Text>
            <br />
            <Button 
              type="link" 
              icon={<Download size={14} />} 
              onClick={downloadCSVTemplate}
              style={{ paddingLeft: 0 }}
            >
              Download Template
            </Button>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      <Upload.Dragger
        fileList={fileList}
        beforeUpload={handleFileUpload}
        onChange={({ fileList }) => setFileList(fileList)}
        accept=".csv"
        maxCount={1}
        onRemove={() => {
          setCsvData([]);
          setValidationErrors([]);
          setFileList([]);
        }}
      >
        <p className="ant-upload-drag-icon">
          <UploadIcon size={32} />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for CSV files
        </p>
      </Upload.Dragger>
      
      {isProcessing && (
        <div style={{ marginTop: 16 }}>
          <Progress percent={50} status="active" />
          <Text>Processing file...</Text>
        </div>
      )}
      
      {csvData.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={5}>
              Preview ({csvData.length} records)
              {validationErrors.length > 0 && (
                <Tag color="error" style={{ marginLeft: 8 }}>
                  {validationErrors.length} errors
                </Tag>
              )}
              {validationErrors.length === 0 && (
                <Tag color="success" style={{ marginLeft: 8 }}>
                  Valid
                </Tag>
              )}
            </Title>
          </div>
          
          {showErrors && validationErrors.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Alert
                message="Validation Errors"
                type="error"
                showIcon
                description={
                  <List
                    size="small"
                    dataSource={validationErrors.slice(0, 10)}
                    renderItem={(error: ValidationError) => (
                      <List.Item>
                        <Text code>Row {error.row}</Text>
                        <Text strong>{error.field}:</Text> {error.message}
                        {error.value && <Text type="secondary"> (got: "{error.value}")</Text>}
                      </List.Item>
                    )}
                  />
                }
              />
            </div>
          )}
          
          <div style={{ maxHeight: 200, overflow: 'auto', border: '1px solid #d9d9d9', padding: 8, borderRadius: 4 }}>
            <pre style={{ margin: 0, fontSize: 12 }}>
              {JSON.stringify(csvData.slice(0, 3), null, 2)}
              {csvData.length > 3 && '\n... and more'}
            </pre>
          </div>
        </div>
      )}
      
      {importResult && (
        <div style={{ marginTop: 16 }}>
          <Divider />
          <Alert
            message="Import Results"
            description={
              <div>
                <div style={{ marginBottom: 8 }}>
                  <CheckCircle size={16} style={{ color: '#52c41a', marginRight: 8 }} />
                  Successfully imported: {importResult.success} employees
                </div>
                {importResult.failed > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <XCircle size={16} style={{ color: '#ff4d4f', marginRight: 8 }} />
                    Failed to import: {importResult.failed} employees
                  </div>
                )}
                {importResult.errors.length > 0 && (
                  <List
                    size="small"
                    dataSource={importResult.errors.slice(0, 5)}
                    renderItem={(error: any) => (
                      <List.Item>
                        <Text code>Row {error.row}</Text>
                        <Text strong>{error.field}:</Text> {error.message}
                      </List.Item>
                    )}
                  />
                )}
              </div>
            }
            type={importResult.failed === 0 ? 'success' : 'warning'}
            showIcon
          />
        </div>
      )}
    </Modal>
  );
};