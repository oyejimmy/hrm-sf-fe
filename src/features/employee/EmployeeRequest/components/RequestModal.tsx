import React from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Divider, Row, Col } from 'antd';
import {
    FileText,
    Calendar,
    Laptop,
    Car,
    Trophy,
    DollarSign,
    Plus,
    X
} from 'lucide-react';

import { StyledModal, FormContainer, SecondaryButton, PrimaryButton } from './styles';

const { Option } = Select;
const { TextArea } = Input;

interface RequestModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    isDarkMode: boolean;
}

const RequestModal = ({
    isVisible,
    onCancel,
    onSubmit,
    isDarkMode
}: RequestModalProps) => {
    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        onSubmit(values);
        form.resetFields();
    };

    const requestTypes = [
        { value: 'loan', label: 'Loan Request', icon: <DollarSign size={16} />, color: '#1890ff' },
        { value: 'document', label: 'Document Request', icon: <FileText size={16} />, color: '#52c41a' },
        { value: 'leave', label: 'Leave Request', icon: <Calendar size={16} />, color: '#faad14' },
        { value: 'equipment', label: 'Equipment Request', icon: <Laptop size={16} />, color: '#722ed1' },
        { value: 'travel', label: 'Travel Request', icon: <Car size={16} />, color: '#13c2c2' },
        { value: 'recognition', label: 'Recognition Request', icon: <Trophy size={16} />, color: '#f5222d' },
    ];

    return (
        <StyledModal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Plus size={20} />
                    Create New Request
                </div>
            }
            open={isVisible}
            onCancel={onCancel}
            footer={null}
            width={700}
            centered
            isDarkMode={isDarkMode}
            styles={{
                body: { padding: '24px' }
            }}
        >
            <FormContainer isDarkMode={isDarkMode}>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        name="type"
                        label="Request Type"
                        rules={[{ required: true, message: 'Please select a request type' }]}
                    >
                        <Select
                            placeholder="Select request type"
                            size="large"
                            optionLabelProp="label"
                        >
                            {requestTypes.map((type) => (
                                <Option
                                    key={type.value}
                                    value={type.value}
                                    label={
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {type.icon}
                                            {type.label}
                                        </div>
                                    }
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ color: type.color }}>{type.icon}</div>
                                        {type.label}
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="subject"
                        label="Subject"
                        rules={[{ required: true, message: 'Please enter a subject' }]}
                    >
                        <Input
                            placeholder="Enter request subject"
                            size="large"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
                        {({ getFieldValue }) => (
                            <>
                                {getFieldValue('type') === 'loan' && (
                                    <Form.Item
                                        name="amount"
                                        label="Loan Amount"
                                        rules={[{ required: true, message: 'Please enter the loan amount' }]}
                                    >
                                        <InputNumber
                                            min={0}
                                            style={{ width: '100%', borderRadius: '8px' }}
                                            size="large"
                                            placeholder="Enter amount"
                                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                )}

                                {getFieldValue('type') === 'document' && (
                                    <Form.Item
                                        name="documentType"
                                        label="Document Type"
                                        rules={[{ required: true, message: 'Please specify the document type' }]}
                                    >
                                        <Input
                                            placeholder="e.g., Salary Slip, Employment Letter"
                                            size="large"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Item>
                                )}

                                {getFieldValue('type') === 'leave' && (
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="startDate"
                                                label="Start Date"
                                                rules={[{ required: true, message: 'Please select start date' }]}
                                            >
                                                <DatePicker
                                                    style={{ width: '100%', borderRadius: '8px' }}
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="endDate"
                                                label="End Date"
                                                rules={[{ required: true, message: 'Please select end date' }]}
                                            >
                                                <DatePicker
                                                    style={{ width: '100%', borderRadius: '8px' }}
                                                    size="large"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                )}

                                {getFieldValue('type') === 'equipment' && (
                                    <Form.Item
                                        name="equipmentType"
                                        label="Equipment Type"
                                        rules={[{ required: true, message: 'Please specify the equipment type' }]}
                                    >
                                        <Input
                                            placeholder="e.g., Laptop, Monitor, Headphones"
                                            size="large"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Item>
                                )}

                                {getFieldValue('type') === 'travel' && (
                                    <Form.Item
                                        name="destination"
                                        label="Destination"
                                        rules={[{ required: true, message: 'Please enter destination' }]}
                                    >
                                        <Input
                                            placeholder="Enter travel destination"
                                            size="large"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Item>
                                )}

                                {getFieldValue('type') === 'recognition' && (
                                    <Form.Item
                                        name="recognitionType"
                                        label="Recognition Type"
                                        rules={[{ required: true, message: 'Please specify recognition type' }]}
                                    >
                                        <Input
                                            placeholder="e.g., Employee of the Month, Excellence Award"
                                            size="large"
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </Form.Item>
                                )}
                            </>
                        )}
                    </Form.Item>

                    <Form.Item
                        name="details"
                        label="Details"
                        rules={[{ required: true, message: 'Please provide details' }]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Please provide detailed information about your request..."
                            size="large"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item name="priority" label="Priority">
                        <Select
                            placeholder="Select priority"
                            size="large"
                            defaultValue="medium"
                            style={{ borderRadius: '8px' }}
                        >
                            <Option value="low">Low Priority</Option>
                            <Option value="medium">Medium Priority</Option>
                            <Option value="high">High Priority</Option>
                        </Select>
                    </Form.Item>

                    <Divider />

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <SecondaryButton
                            isDarkMode={isDarkMode}
                            onClick={onCancel}
                            style={{ borderRadius: '8px' }}
                        >
                            <X size={16} />
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            htmlType="submit"
                            style={{ borderRadius: '8px' }}
                        >
                            <Plus size={16} />
                            Submit Request
                        </PrimaryButton>
                    </div>
                </Form>
            </FormContainer>
        </StyledModal>
    );
};

export default RequestModal;