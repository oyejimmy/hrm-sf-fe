import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Divider,
  Row,
  Col,
  Typography,
  InputNumber,
  Button,
  Alert,
  Grid
} from 'antd';
import {
  Laptop,
  Monitor,
  Smartphone,
  Headphones,
  Printer,
  Package,
  History,
  Send,
  CornerDownLeft,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Asset, ModalProps } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;
const { TextArea } = Input;

// Asset Details Modal Component
const AssetDetailsModal: React.FC<{asset: Asset | null, visible: boolean, onClose: () => void}> = ({ 
  asset, 
  visible, 
  onClose 
}) => {
  const screens = useBreakpoint();
  
  if (!asset) return null;

  return (
    <Modal
      title="Asset Details"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={screens.xs ? "90%" : 600}
    >
      <div style={{ display: 'flex', marginBottom: 16, flexDirection: screens.xs ? 'column' : 'row' }}>
        <div style={{
          width: 100,
          height: 100,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
          marginRight: screens.xs ? 0 : 16,
          marginBottom: screens.xs ? 16 : 0
        }}>
          {asset.asset_type === 'Laptop' && <Laptop size={48} color="#1890ff" />}
          {asset.asset_type === 'Monitor' && <Monitor size={48} color="#52c41a" />}
          {asset.asset_type === 'Phone' && <Smartphone size={48} color="#faad14" />}
          {asset.asset_type === 'Headphones' && <Headphones size={48} color="#722ed1" />}
          {asset.asset_type === 'Printer' && <Printer size={48} color="#f5222d" />}
          {!['Laptop', 'Monitor', 'Phone', 'Headphones', 'Printer'].includes(asset.asset_type) &&
            <Package size={48} color="#8c8c8c" />}
        </div>
        <div>
          <Title level={4}>{asset.name}</Title>
          <Tag color={asset.status === 'assigned' ? 'green' : asset.status === 'available' ? 'blue' : 'orange'}>
            {asset.status}
          </Tag>
        </div>
      </div>

      <Divider />

      <Title level={5}>Specifications</Title>
      <Text>{asset.specifications}</Text>

      <Divider />

      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Title level={5}>Identification</Title>
          <p><Text strong>Serial Number:</Text> {asset.serial_number}</p>
          <p><Text strong>Type:</Text> {asset.asset_type}</p>
        </Col>
        <Col xs={24} md={12}>
          <Title level={5}>Assignment</Title>
          {asset.status === 'assigned' ? (
            <>
              <p><Text strong>Assigned To:</Text> {asset.assigned_to ? `User ID: ${asset.assigned_to}` : 'N/A'}</p>
              <p><Text strong>Assignment Date:</Text> {asset.assignment_date ? new Date(asset.assignment_date).toLocaleDateString() : 'N/A'}</p>
            </>
          ) : (
            <Text>This asset is not currently assigned</Text>
          )}
        </Col>
      </Row>

      <Divider />

      <Title level={5}>History <History size={16} style={{ marginLeft: 8 }} color="#8c8c8c" /></Title>
      <div style={{ padding: '8px 0' }}>
        <p>• Assigned to John Smith on May 15, 2023</p>
        <p>• Purchased on April 10, 2023</p>
      </div>
    </Modal>
  );
};

// Request Asset Modal Component
const RequestAssetModal: React.FC<{
  visible: boolean, 
  onClose: () => void, 
  onRequest: (requestData: any) => void, 
  asset: Asset | null
}> = ({ visible, onClose, onRequest, asset }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onRequest({ ...values, asset: asset?.name || values.assetType });
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Request Asset"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" icon={<Send size={16} />} onClick={handleSubmit}>
          Submit Request
        </Button>
      ]}
      width={screens.xs ? "90%" : 600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          assetType: asset?.asset_type,
          quantity: 1
        }}
      >
        <Form.Item
          name="assetType"
          label="Asset Type"
          rules={[{ required: true, message: 'Please select an asset type' }]}
        >
          <Select placeholder="Select asset type">
            <Option value="Laptop">Laptop</Option>
            <Option value="Monitor">Monitor</Option>
            <Option value="Phone">Phone</Option>
            <Option value="Headphones">Headphones</Option>
            <Option value="Printer">Printer</Option>
            <Option value="Other">Other</Option>
          </Select>
        </Form.Item>

        {!asset && (
          <Form.Item
            name="assetName"
            label="Asset Name/Model"
            rules={[{ required: true, message: 'Please specify the asset name or model' }]}
          >
            <Input placeholder="e.g., MacBook Pro 16" />
          </Form.Item>
        )}

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true, message: 'Please enter quantity' }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason for Request"
          rules={[{ required: true, message: 'Please provide a reason for this request' }]}
        >
          <TextArea rows={4} placeholder="Please explain why you need this asset..." />
        </Form.Item>

        <Form.Item
          name="urgency"
          label="Urgency"
          rules={[{ required: true, message: 'Please select urgency level' }]}
        >
          <Select placeholder="How urgent is this request?">
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="neededBy"
          label="Needed By"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Return Asset Modal Component
const ReturnAssetModal: React.FC<{
  visible: boolean, 
  onClose: () => void, 
  onReturn: (returnData: any) => void, 
  asset: Asset | null
}> = ({ visible, onClose, onReturn, asset }) => {
  const [form] = Form.useForm();
  const screens = useBreakpoint();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onReturn({ ...values, asset: asset!.name });
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Return Asset"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" icon={<CornerDownLeft size={16} />} onClick={handleSubmit}>
          Submit Return
        </Button>
      ]}
      width={screens.xs ? "90%" : 520}
    >
      <div style={{ marginBottom: 16 }}>
        <Text>You are returning <Text strong>{asset?.name}</Text> ({asset?.serial_number})</Text>
      </div>

      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          name="condition"
          label="Asset Condition"
          rules={[{ required: true, message: 'Please select the asset condition' }]}
        >
          <Select placeholder="How is the asset condition?">
            <Option value="Excellent">Excellent - Like new</Option>
            <Option value="Good">Good - Minor wear</Option>
            <Option value="Fair">Fair - Some issues but functional</Option>
            <Option value="Poor">Poor - Needs repair</Option>
            <Option value="Broken">Broken - Not functional</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="reason"
          label="Reason for Return"
          rules={[{ required: true, message: 'Please provide a reason for returning this asset' }]}
        >
          <TextArea rows={4} placeholder="Why are you returning this asset?" />
        </Form.Item>

        <Form.Item
          name="notes"
          label="Additional Notes"
        >
          <TextArea rows={3} placeholder="Any additional information about the asset's condition or return..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Main Modal Component that combines all modals
const AssetModal: React.FC<ModalProps> = ({
  asset,
  detailsModalVisible,
  requestModalVisible,
  returnModalVisible,
  onCloseDetails,
  onCloseRequest,
  onCloseReturn,
  onRequest,
  onReturn
}) => {
  return (
    <>
      <AssetDetailsModal
        asset={asset}
        visible={detailsModalVisible}
        onClose={onCloseDetails}
      />

      <RequestAssetModal
        asset={asset}
        visible={requestModalVisible}
        onClose={onCloseRequest}
        onRequest={onRequest}
      />

      <ReturnAssetModal
        asset={asset}
        visible={returnModalVisible}
        onClose={onCloseReturn}
        onReturn={onReturn}
      />
    </>
  );
};

export default AssetModal;