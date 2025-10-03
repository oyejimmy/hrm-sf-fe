import React from 'react';
import { Card, Row, Col, Form, Select, Input, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { DATE_FORMATS } from '../../../../constants';
import * as S from './styles';

const { Option } = Select;

interface JobInformationStepProps {
  profileData: any;
  QUALIFICATIONS: string[];
  TEAM_SIZES: { value: number; label: string }[];
  LANGUAGES: { id: number; name: string }[];
}

const JobInformationStep: React.FC<JobInformationStepProps> = ({
  profileData,
  QUALIFICATIONS,
  TEAM_SIZES,
  LANGUAGES
}) => {
  return (
    <Card>
      <S.JobInfoTitle>Job Information</S.JobInfoTitle>
      <Row gutter={[16, 8]}>
        {profileData?.personalInfo && (
          <>
            <Col xs={24} sm={12} md={8}>
              <S.InfoItem>
                <S.InfoLabel>Hired On</S.InfoLabel>
                <S.InfoValue>{profileData.personalInfo.hireDate ? dayjs(profileData.personalInfo.hireDate).format(DATE_FORMATS.DISPLAY) : '-'}</S.InfoValue>
              </S.InfoItem>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <S.InfoItem>
                <S.InfoLabel>Employee ID</S.InfoLabel>
                <S.InfoValueWithIcon>
                  {profileData.personalInfo.employeeId || '-'}
                  {profileData.personalInfo.employeeId && (
                    <S.CopyIcon as={CopyOutlined} onClick={() => {
                      navigator.clipboard.writeText(profileData.personalInfo.employeeId);
                      message.success('Employee ID copied to clipboard');
                    }} />
                  )}
                </S.InfoValueWithIcon>
              </S.InfoItem>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <S.InfoItem>
                <S.InfoLabel>Department</S.InfoLabel>
                <S.InfoValue>{profileData.personalInfo.department || '-'}</S.InfoValue>
              </S.InfoItem>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <S.InfoItem>
                <S.InfoLabel>Position</S.InfoLabel>
                <S.InfoValue>{profileData.personalInfo.position || '-'}</S.InfoValue>
              </S.InfoItem>
            </Col>
          </>
        )}
        {profileData?.jobInfo && (
          <>
            <Col xs={24} sm={12} md={8}>
              <S.InfoItem>
                <S.InfoLabel>Employment Type</S.InfoLabel>
                <S.InfoValue>{profileData.jobInfo.employmentType || '-'}</S.InfoValue>
              </S.InfoItem>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <S.InfoItem>
                <S.InfoLabel>Work Schedule</S.InfoLabel>
                <S.InfoValue>{profileData.jobInfo.workSchedule || '-'}</S.InfoValue>
              </S.InfoItem>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <S.InfoItem>
                <S.InfoLabel>Work Location</S.InfoLabel>
                <S.InfoValue>{profileData.jobInfo.workLocation || '-'}</S.InfoValue>
              </S.InfoItem>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <S.InfoItem>
                <S.InfoLabel>Team Size</S.InfoLabel>
                <S.InfoValue>{profileData.personalInfo.teamSize || '-'}</S.InfoValue>
              </S.InfoItem>
            </Col>
          </>
        )}
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="languagesKnown" label="Languages Known">
            <Select mode="multiple" placeholder="Select languages" allowClear>{LANGUAGES.map(lang => <Option key={lang.id} value={lang.id}>{lang.name}</Option>)}</Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="qualification_level" label="Qualification Level" rules={[{ required: true, message: 'Select qualification level' }]}>
            <Select placeholder="Select qualification level">{QUALIFICATIONS.map(q => <Option key={q} value={q}>{q}</Option>)}</Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Form.Item name="degree_name" label="Degree/Field of Study" rules={[{ required: true, message: 'Enter degree or field' }]}>
            <Input placeholder="e.g., Computer Science, MBA" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default JobInformationStep;