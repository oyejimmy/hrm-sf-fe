import React from 'react';
import { Card, Row, Col, Form, Upload, Select, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { DATE_FORMATS } from '../../../../constants';
import { COUNTRY_CODES } from '../../../../utils/constants';
import * as S from './styles';

const { Option } = Select;
const { TextArea } = Input;

interface PersonalInformationStepProps {
  imageUrl?: string;
  setImageUrl: (url: string) => void;
  form: any;
  TITLES: string[];
  GENDERS: { value: string; label: string }[];
  MARITAL_STATUS: { value: string; label: string }[];
  BLOOD_GROUPS: string[];
}

const PersonalInformationStep: React.FC<PersonalInformationStepProps> = ({
  imageUrl,
  setImageUrl,
  form,
  TITLES,
  GENDERS,
  MARITAL_STATUS,
  BLOOD_GROUPS
}) => {
  return (
    <Card>
      <S.AvatarUploader>
        <Form.Item name="profile_picture" rules={[{ required: true, message: 'Please upload a profile picture' }]}>
          <Upload name="avatar" listType="picture-circle" showUploadList={false} beforeUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              setImageUrl(e.target?.result as string);
              form.setFieldsValue({ profile_picture: e.target?.result });
            };
            reader.readAsDataURL(file);
            return false;
          }}>
            <S.AvatarContainer hasImage={!!imageUrl}>
              {imageUrl ? <S.AvatarImage src={imageUrl} alt="avatar" /> : <S.AvatarPlaceholder><UserOutlined /><div>Upload</div></S.AvatarPlaceholder>}
            </S.AvatarContainer>
          </Upload>
        </Form.Item>
      </S.AvatarUploader>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={6} md={4}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Select title' }]}>
            <Select placeholder="Select title">{TITLES.map(title => <Option key={title} value={title}>{title}</Option>)}</Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={9} md={10}>
          <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Enter first name' }]}>
            <Input placeholder="First name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={9} md={10}>
          <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Enter last name' }]}>
            <Input placeholder="Last name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Form.Item name="personal_email" label="Personal Email" rules={[{ required: true, message: 'Enter personal email' }, { type: 'email', message: 'Enter valid email' }]}>
            <Input placeholder="Personal email" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true, message: 'Enter phone number' }]}>
            <Input 
              addonBefore={
                <Form.Item name="country_code" noStyle initialValue="+92">
                  <Select style={{ width: 100 }}>
                    {COUNTRY_CODES.map(cc => <Option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</Option>)}
                  </Select>
                </Form.Item>
              }
              placeholder="Phone number" 
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Select gender' }]}>
            <Select placeholder="Select gender">{GENDERS.map(g => <Option key={g.value} value={g.value}>{g.label}</Option>)}</Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="date_of_birth" label="Date of Birth" rules={[{ required: true, message: 'Select date of birth' }]}>
            <S.FullWidthDatePicker placeholder="Select date of birth" format={DATE_FORMATS.DISPLAY} showToday={false} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="marital_status" label="Marital Status" rules={[{ required: true, message: 'Select marital status' }]}>
            <Select placeholder="Select marital status">{MARITAL_STATUS.map(ms => <Option key={ms.value} value={ms.value}>{ms.label}</Option>)}</Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="blood_group" label="Blood Group">
            <Select placeholder="Select blood group" allowClear>{BLOOD_GROUPS.map(bg => <Option key={bg} value={bg}>{bg}</Option>)}</Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="nationality" label="Nationality">
            <Input placeholder="Nationality" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="religion" label="Religion">
            <Input placeholder="Religion (optional)" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="address" label="Address">
            <TextArea rows={3} placeholder="Complete residential address" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default PersonalInformationStep;