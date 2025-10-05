import React from 'react';
import { Card, Row, Col, Form, Input, Select } from 'antd';
import { COUNTRY_CODES } from '../../../../utils/constants';

const { TextArea } = Input;
const { Option } = Select;

const EmergencyContactStep: React.FC = () => {
  return (
    <Card>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={12}>
          <Form.Item name="emergency_contact_name" label="Contact Name" rules={[{ required: true, message: 'Enter contact name' }]}>
            <Input placeholder="Full name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Form.Item name="emergency_contact_relationship" label="Relationship" rules={[{ required: true, message: 'Select relationship' }]}>
            <Select placeholder="Select relationship">
              <Option value="spouse">Spouse</Option>
              <Option value="father">Father</Option>
              <Option value="mother">Mother</Option>
              <Option value="parent">Parent</Option>
              <Option value="sibling">Sibling</Option>
              <Option value="brother">Brother</Option>
              <Option value="sister">Sister</Option>
              <Option value="child">Child</Option>
              <Option value="son">Son</Option>
              <Option value="daughter">Daughter</Option>
              <Option value="friend">Friend</Option>
              <Option value="colleague">Colleague</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Form.Item name="emergency_contact_phone" label="Mobile Number" rules={[{ required: true, message: 'Enter mobile number' }]}>
            <Input 
              addonBefore={
                <Form.Item name="emergency_country_code" noStyle initialValue="+92">
                  <Select style={{ width: 100 }}>
                    {COUNTRY_CODES.map(cc => <Option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</Option>)}
                  </Select>
                </Form.Item>
              }
              placeholder="Mobile number" 
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Form.Item name="emergency_contact_home_phone" label="Home Phone">
            <Input 
              addonBefore={
                <Form.Item name="emergency_home_country_code" noStyle initialValue="+92">
                  <Select style={{ width: 100 }}>
                    {COUNTRY_CODES.map(cc => <Option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</Option>)}
                  </Select>
                </Form.Item>
              }
              placeholder="Home phone (optional)" 
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="emergency_contact_address" label="Address">
            <TextArea rows={3} placeholder="Complete address" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default EmergencyContactStep;