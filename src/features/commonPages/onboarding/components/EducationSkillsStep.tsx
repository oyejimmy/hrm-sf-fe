import React from 'react';
import { Card, Row, Col, Form, Input, Select } from 'antd';
import { DATE_FORMATS } from '../../../../constants';
import * as S from './styles';

const { TextArea } = Input;
const { Option } = Select;

interface EducationSkillsStepProps {
  TECHNICAL_SKILLS: { id: number; name: string }[];
}

const EducationSkillsStep: React.FC<EducationSkillsStepProps> = ({ TECHNICAL_SKILLS }) => {
  return (
    <Card>
      <Row gutter={[16, 8]}>
        <Col xs={24} sm={12} md={12}>
          <Form.Item name="university" label="University/College" rules={[{ required: true, message: 'Enter university name' }]}>
            <Input placeholder="University/College name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Form.Item name="graduation_year" label="Graduation Year" rules={[{ required: true, message: 'Select graduation year' }]}>
            <Select placeholder="Select graduation year">
              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => 
                <Option key={year} value={year}>{year}</Option>
              )}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="certifications" label="Certifications">
            <TextArea rows={2} placeholder="e.g., AWS Certified, PMP, etc." />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="skills_summary" label="Skills Summary">
            <TextArea rows={3} placeholder="Brief summary of key skills and expertise" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="technical_skills" label="Technical Skills" rules={[{ required: true, message: 'Add at least one technical skill' }]}>
            <Select mode="tags" placeholder="Add technical skills (type and press enter)" showSearch filterOption={(input, option) => String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
              {TECHNICAL_SKILLS.map(skill => <Option key={skill.id} value={skill.id}>{skill.name}</Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default EducationSkillsStep;