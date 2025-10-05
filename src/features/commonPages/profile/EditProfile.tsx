import React, { useState } from 'react';
import {
  Row,
  Col,
  Typography,
  Tabs,
  Button,
  Upload,
  message,
  Flex,
  Form,
  Input,
  Select,
  DatePicker,
  Progress,
  Spin,
  Descriptions
} from 'antd';
import dayjs from 'dayjs';
import { DATE_FORMATS } from '../../../constants';
import { COUNTRY_CODES } from '../../../utils/constants';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  Camera,
  Heart,
  DollarSign,
  Award,
  Users,
  ArrowLeft,
  Save,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../services/api/api';
import { masterDataApi } from '../../../services/api/masterDataApi';
import { profileApi } from '../../../services/api/profileApi';
import EditProfileImageModal from './EditProfileImageModal';
import CroppedAvatar from '../../../components/CroppedAvatar';
import * as S from './styles';

const { Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

const EditProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const { isDarkMode } = useTheme();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Update image mutation
  const updateImageMutation = useMutation({
    mutationFn: (data: { avatar: string | null; coverImage: string | null; coverOffset?: number; profileCrop?: { scale: number; offsetX: number; offsetY: number } }) => 
      profileApi.updateProfileImages(data),
    onSuccess: (response, variables) => {
      setCoverImage(variables.coverImage);
      setAvatarImage(variables.avatar);
      setIsImageModalVisible(false);
      message.success('Profile images updated successfully!');
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['employee-profile'] });
      queryClient.refetchQueries({ queryKey: ['employee-profile'] });
    },
    onError: (error: any) => {
      message.error(error.message || 'Failed to update profile images');
    }
  });
  
  // Fetch current profile data
  const { data: employeeData, isLoading } = useQuery({
    queryKey: ['employee-profile'],
    queryFn: () => api.get('/api/employees/me/profile').then((res: any) => res.data),
  });
  
  // Fetch languages and technical skills
  const { data: languages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: () => masterDataApi.getLanguages().then(res => res.data)
  });
  
  const { data: technicalSkills = [] } = useQuery({
    queryKey: ['technical-skills'],
    queryFn: () => masterDataApi.getTechnicalSkills().then(res => res.data)
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => {
      console.log('Sending profile update data:', data);
      return api.put('/auth/profile/update', data);
    },
    onSuccess: (response) => {
      console.log('Profile update success:', response);
      message.success('Profile updated successfully');
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['employee-profile'] });
      queryClient.refetchQueries({ queryKey: ['employee-profile'] });
      navigate(getProfilePath());
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      console.error('Error response:', error.response?.data);
      message.error(`Failed to update profile: ${error.response?.data?.detail || error.message}`);
    }
  });
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip="Loading profile..." />
      </div>
    );
  }
  
  if (!employeeData) {
    return <div>Error loading profile data</div>;
  }

  const handleCoverUpload = (info: any) => {
    const file = info.file.originFileObj || info.file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setCoverImage(base64);
      // Immediately save to database
      updateProfileMutation.mutate({ cover_image_url: base64 });
    };
    reader.readAsDataURL(file);
    message.success('Cover image uploaded successfully');
  };

  const handleImageSave = (profileImage: string | null, coverImage: string | null, coverOffset?: number, profileCrop?: { scale: number; offsetX: number; offsetY: number }) => {
    updateImageMutation.mutate({
      avatar: profileImage,
      coverImage: coverImage,
      coverOffset: coverOffset,
      profileCrop: profileCrop
    });
  };

  const getProfilePath = () => {
    const currentPath = location.pathname;
    return currentPath.replace('/edit', '');
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      // Get all form data including nested forms
      const allFormData = form.getFieldsValue(true);
      
      // Flatten nested form values and merge with current data
      const payload: any = {};
      
      // Only include fields that have values
      const addField = (key: string, value: any) => {
        if (value !== undefined && value !== null && value !== '') {
          payload[key] = value;
        }
      };
      
      // User fields
      if (allFormData.name) {
        const nameParts = allFormData.name.split(' ');
        addField('first_name', nameParts[0]);
        addField('last_name', nameParts.slice(1).join(' '));
      }
      addField('email', allFormData.email);
      addField('phone', allFormData.phone);
      
      // Employee Details section fields
      addField('hire_date', allFormData.hireDate);
      addField('employment_type', allFormData.employmentType);
      addField('employee_id', allFormData.employeeId);
      addField('manager', allFormData.manager);
      
      // Employee fields - Personal Info
      addField('position', allFormData.position);
      addField('work_location', allFormData.location);
      addField('qualification', allFormData.qualification);
      addField('blood_group', allFormData.bloodGroup);
      addField('gender', allFormData.gender);
      if (allFormData.dateOfBirth) {
        addField('date_of_birth', dayjs(allFormData.dateOfBirth).format('YYYY-MM-DD'));
      }
      addField('marital_status', allFormData.maritalStatus);
      addField('nationality', allFormData.nationality);
      addField('religion', allFormData.religion);
      if (allFormData.languagesKnown && Array.isArray(allFormData.languagesKnown)) {
        const languageNames = allFormData.languagesKnown.map((langId: number) => {
          const language = languages.find((l: any) => l.id === langId);
          return language ? language.name : langId.toString();
        });
        addField('languages_known', languageNames.join(', '));
      }
      addField('hobbies', allFormData.hobbies);
      addField('address', allFormData.address);
      addField('office_address', allFormData.officeAddress);
      addField('personal_email', allFormData.personalEmail);
      
      // Job info
      addField('employment_status', allFormData.employmentStatus);
      addField('work_location', allFormData.workLocation); // Job tab work location
      addField('work_schedule', allFormData.workSchedule);
      if (allFormData.teamSize) {
        addField('team_size', parseInt(allFormData.teamSize));
      }
      addField('education_level', allFormData.educationLevel);
      
      // Education & Skills
      addField('university', allFormData.university);
      if (allFormData.graduationYear) {
        addField('graduation_year', parseInt(allFormData.graduationYear));
      }
      addField('certifications', allFormData.certifications);
      addField('skills_summary', allFormData.skillsSummary);
      if (allFormData.technicalSkills && Array.isArray(allFormData.technicalSkills)) {
        const skillNames = allFormData.technicalSkills.map((skillId: number) => {
          const skill = technicalSkills.find((s: any) => s.id === skillId);
          return skill ? skill.name : skillId.toString();
        });
        addField('technical_skills', skillNames);
      }
      
      // Compensation
      if (allFormData.salary) {
        const salaryNum = parseFloat(allFormData.salary.toString().replace(/[^0-9.]/g, ''));
        if (!isNaN(salaryNum)) {
          addField('salary', salaryNum);
        }
      }
      addField('bonus_target', allFormData.bonusTarget);
      addField('stock_options', allFormData.stockOptions);
      addField('next_review_date', allFormData.nextReview);
      
      // Images
      if (avatarImage) addField('avatar_url', avatarImage);
      if (coverImage) addField('cover_image_url', coverImage);
      
      if (Object.keys(payload).length > 0) {
        updateProfileMutation.mutate(payload);
      } else {
        message.info('No changes to save');
      }
    }).catch(errorInfo => {
      console.log('Validation failed:', errorInfo);
    });
  };

  const handleClearEmergencyContact = () => {
    form.setFieldsValue({
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
      emergencyContactWorkPhone: '',
      emergencyContactHomePhone: '',
      emergencyContactAddress: ''
    });
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      return false; // Prevent default upload, handle manually
    },
    showUploadList: false,
    customRequest: () => {}, // Prevent default upload
  };

  return (
    <S.PageContainer isDarkMode={isDarkMode}>
      <Form form={form} layout="vertical" initialValues={{
        ...employeeData?.personalInfo,
        ...employeeData?.jobInfo,
        ...employeeData?.compensation,
        dateOfBirth: employeeData?.personalInfo?.dateOfBirth ? dayjs(employeeData.personalInfo.dateOfBirth) : null,
        // Emergency contact fields
        emergencyContactName: employeeData?.personalInfo?.emergency_contact_name,
        emergencyContactPhone: employeeData?.personalInfo?.emergency_contact_phone,
        emergencyContactRelationship: employeeData?.personalInfo?.emergency_contact_relationship,
        emergencyContactWorkPhone: employeeData?.personalInfo?.emergency_contact_work_phone,
        emergencyContactHomePhone: employeeData?.personalInfo?.emergency_contact_home_phone,
        emergencyContactAddress: employeeData?.personalInfo?.emergency_contact_address,
        // Technical skills
        technicalSkills: employeeData?.personalInfo?.technical_skills || [],
        // Office address
        officeAddress: employeeData?.personalInfo?.office_address
      }}>
        <S.StyledCard bodyStyle={{ padding: 0 }} isDarkMode={isDarkMode}>
        <S.CoverSection bgImage={coverImage || employeeData?.personalInfo?.coverImage || employeeData?.personalInfo?.cover_image_url || undefined} isDarkMode={isDarkMode}>
          {(coverImage || employeeData?.personalInfo?.coverImage) && (
            <img 
              src={coverImage || employeeData?.personalInfo?.coverImage} 
              alt="Cover" 
              style={{
                width: '100%',
                height: 'auto',
                minHeight: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translateY(${employeeData?.personalInfo?.coverOffset || 0}px)`
              }}
            />
          )}
          <Button
            type="primary"
            icon={<Camera size={16} />}
            onClick={() => setIsImageModalVisible(true)}
            style={{ 
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(0, 0, 0, 0.6)',
              border: 'none',
              zIndex: 2
            }}
          >
            Edit Profile Image
          </Button>
        </S.CoverSection>

        <S.ProfileCard isDarkMode={isDarkMode}>
          <S.ProfileContent>
            <S.UserInfoContainer align="flex-end">
              <S.AvatarContainer>
                <CroppedAvatar
                  size={140}
                  src={avatarImage || employeeData?.personalInfo?.avatar || employeeData?.personalInfo?.avatar_url}
                  crop={employeeData?.personalInfo?.profileCrop}
                />
              </S.AvatarContainer>

              <S.UserInfo>
                <Form.Item name="name" style={{ margin: 0 }}>
                  <Input
                    style={{ fontSize: '28px', fontWeight: 600, color: isDarkMode ? 'white' : '#262626', border: 'none', background: 'transparent', padding: 0 }}
                    bordered={false}
                  />
                </Form.Item>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <S.UserDetailItem>
                    <Briefcase size={18} color="#1890ff" />
                    <Form.Item name="position" style={{ margin: 0, marginBottom: 0 }}>
                      <Input
                        style={{ color: '#555', border: 'none', background: 'transparent', padding: 0 }}
                        bordered={false}
                      />
                    </Form.Item>
                  </S.UserDetailItem>
                  <S.UserDetailItem>
                    <MapPin size={18} color="#ff4d4f" />
                    <Form.Item name="location" style={{ margin: 0, marginBottom: 0 }}>
                      <Input
                        style={{ color: '#555', border: 'none', background: 'transparent', padding: 0 }}
                        bordered={false}
                      />
                    </Form.Item>
                  </S.UserDetailItem>
                </div>
              </S.UserInfo>

              <Flex gap="small">
                <Button
                  type="default"
                  icon={<ArrowLeft size={16} />}
                  onClick={() => navigate(getProfilePath())}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  icon={<Save size={16} />}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </Flex>
            </S.UserInfoContainer>

            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col xs={24} md={8}>
                <S.StyledCard title="Employee Details" isDarkMode={isDarkMode}>
                  <Descriptions 
                    column={1} 
                    bordered={false}
                    colon={false}
                    layout="vertical"
                    labelStyle={{ fontWeight: 'bold', color: '#000', marginBottom: '0px' }}
                    style={{ marginBottom: '8px' }}
                  >
                    <Descriptions.Item label="Email">{employeeData?.personalInfo?.email || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Contact Number">
                      <S.FormItem name="phone" isDarkMode={isDarkMode} style={{ margin: 0 }}>
                        <Input 
                          addonBefore={
                            <Form.Item name="country_code" noStyle initialValue="+92">
                              <Select style={{ width: 100 }}>
                                {COUNTRY_CODES.map(cc => <Option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</Option>)}
                              </Select>
                            </Form.Item>
                          }
                        />
                      </S.FormItem>
                    </Descriptions.Item>
                    <Descriptions.Item label="Hired Date">{employeeData?.personalInfo?.hireDate ? dayjs(employeeData.personalInfo.hireDate).format(DATE_FORMATS.DISPLAY) : '-'}</Descriptions.Item>
                    <Descriptions.Item label="Employment type">{employeeData?.jobInfo?.employmentType || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Employee ID">{employeeData?.personalInfo?.employeeId || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Manager">{employeeData?.personalInfo?.manager || '-'}</Descriptions.Item>
                    <Descriptions.Item label="Office Address" span={3}>
                      <S.FormItem name="officeAddress" isDarkMode={isDarkMode} style={{ margin: 0 }}>
                        <TextArea rows={2} placeholder="Enter office address" style={{ width: '100%', minWidth: '300px' }} />
                      </S.FormItem>
                    </Descriptions.Item>
                  </Descriptions>
                </S.StyledCard>
              </Col>

              <Col xs={24} md={16}>
                <S.StyledTabs activeKey={activeTab} onChange={setActiveTab} isDarkMode={isDarkMode}>
                  <TabPane
                    tab={
                      <span>
                        <User size={16} style={{ marginRight: 8, color: '#1890ff' }} />
                        Personal
                      </span>
                    }
                    key="personal"
                  >
                    <S.StyledCard title="Personal Information" isDarkMode={isDarkMode}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.FormItem name="gender" label="Gender" isDarkMode={isDarkMode} rules={[{ required: true, message: 'Select gender' }]}>
                            <Select allowClear>
                              <Option value="male">Male</Option>
                              <Option value="female">Female</Option>
                              <Option value="other">Other</Option>
                            </Select>
                          </S.FormItem>
                          <S.FormItem name="dateOfBirth" label="Date of Birth" isDarkMode={isDarkMode} rules={[{ required: true, message: 'Select date of birth' }]}>
                            <DatePicker 
                              style={{ width: '100%' }} 
                              format={DATE_FORMATS.DISPLAY}
                              placeholder="Select date of birth"
                            />
                          </S.FormItem>
                          <S.FormItem name="maritalStatus" label="Marital Status" isDarkMode={isDarkMode} rules={[{ required: true, message: 'Select marital status' }]}>
                            <Select allowClear>
                              <Option value="single">Single</Option>
                              <Option value="married">Married</Option>
                              <Option value="divorced">Divorced</Option>
                              <Option value="widowed">Widowed</Option>
                            </Select>
                          </S.FormItem>
                          <S.FormItem name="bloodGroup" label="Blood Group" isDarkMode={isDarkMode}>
                            <Select allowClear>
                              <Option value="A+">A+</Option>
                              <Option value="A-">A-</Option>
                              <Option value="B+">B+</Option>
                              <Option value="B-">B-</Option>
                              <Option value="AB+">AB+</Option>
                              <Option value="AB-">AB-</Option>
                              <Option value="O+">O+</Option>
                              <Option value="O-">O-</Option>
                            </Select>
                          </S.FormItem>
                          <S.FormItem name="nationality" label="Nationality" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name="religion" label="Religion" isDarkMode={isDarkMode} rules={[{ required: true, message: 'Enter religion' }]}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name="languagesKnown" label="Languages Known" isDarkMode={isDarkMode}>
                            <Select mode="multiple" allowClear placeholder="Select languages">
                              {languages.map((lang: any) => <Option key={lang.id} value={lang.id}>{lang.name}</Option>)}
                            </Select>
                          </S.FormItem>
                          <S.FormItem name="hobbies" label="Hobbies" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name="personalEmail" label="Personal Email" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name="address" label="Address" isDarkMode={isDarkMode}>
                            <TextArea rows={2} />
                          </S.FormItem>
                        </Col>
                      </Row>
                    </S.StyledCard>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <Heart size={16} style={{ marginRight: 8, color: '#ff4d4f' }} />
                        Emergency Contacts
                      </span>
                    }
                    key="emergency"
                  >
                    <S.StyledCard title="Emergency Contact Information" isDarkMode={isDarkMode}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.FormItem name="emergencyContactName" label="Contact Name" isDarkMode={isDarkMode} rules={[{ required: true, message: 'Enter contact name' }]}>
                            <Input />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name="emergencyContactRelationship" label="Relationship" isDarkMode={isDarkMode} rules={[{ required: true, message: 'Select relationship' }]}>
                            <Select allowClear>
                              <Option value="spouse">Spouse</Option>
                              <Option value="parent">Parent</Option>
                              <Option value="sibling">Sibling</Option>
                              <Option value="child">Child</Option>
                              <Option value="friend">Friend</Option>
                              <Option value="other">Other</Option>
                            </Select>
                          </S.FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.FormItem name="emergencyContactPhone" label="Mobile Number" isDarkMode={isDarkMode} rules={[{ required: true, message: 'Enter mobile number' }]}>
                            <Input 
                              addonBefore={
                                <Form.Item name="emergencyMobileCountryCode" noStyle initialValue="+92">
                                  <Select style={{ width: 100 }} allowClear>
                                    {COUNTRY_CODES.map(cc => <Option key={cc.code} value={cc.code}>{cc.flag} {cc.code}</Option>)}
                                  </Select>
                                </Form.Item>
                              }
                            />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name="emergencyContactHomePhone" label="Home Phone" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={24}>
                          <S.FormItem name="emergencyContactAddress" label="Address" isDarkMode={isDarkMode}>
                            <TextArea rows={3} />
                          </S.FormItem>
                        </Col>
                      </Row>
                    </S.StyledCard>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <Briefcase size={16} style={{ marginRight: 8, color: '#faad14' }} />
                        Job
                      </span>
                    }
                    key="job"
                  >
                    <S.StyledCard title="Job Information" isDarkMode={isDarkMode}>
                      <Descriptions 
                        column={2} 
                        bordered={false}
                        colon={false}
                        layout="vertical"
                        labelStyle={{ fontWeight: 'bold', color: '#000', marginBottom: '0px' }}
                        style={{ marginBottom: '8px' }}
                      >
                        <Descriptions.Item label="Employment Status">{employeeData?.jobInfo?.employmentStatus || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Work Location">{employeeData?.jobInfo?.workLocation || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Work Schedule">{employeeData?.jobInfo?.workSchedule || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Team Size">{employeeData?.personalInfo?.teamSize || '-'}</Descriptions.Item>
                      </Descriptions>
                    </S.StyledCard>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <DollarSign size={16} style={{ marginRight: 8, color: '#52c41a' }} />
                        Compensation
                      </span>
                    }
                    key="compensation"
                  >
                    <S.StyledCard title="Compensation Details" isDarkMode={isDarkMode}>
                      <Descriptions 
                        column={2} 
                        bordered={false}
                        colon={false}
                        layout="vertical"
                        labelStyle={{ fontWeight: 'bold', color: '#000', marginBottom: '0px' }}
                        style={{ marginBottom: '8px' }}
                      >
                        <Descriptions.Item label="Base Salary">{employeeData?.compensation?.salary || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Bonus Target">{employeeData?.compensation?.bonusTarget || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Stock Options">{employeeData?.compensation?.stockOptions || '-'}</Descriptions.Item>
                        <Descriptions.Item label="Next Review">{employeeData?.compensation?.nextReview || '-'}</Descriptions.Item>
                      </Descriptions>
                    </S.StyledCard>
                  </TabPane>

                  <TabPane
                    tab={
                      <span>
                        <Award size={16} style={{ marginRight: 8, color: '#722ed1' }} />
                        Education & Skills
                      </span>
                    }
                    key="education"
                  >
                    <S.StyledCard title="Education & Skills" isDarkMode={isDarkMode}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.FormItem name="university" label="University" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name="educationLevel" label="Education Level" isDarkMode={isDarkMode}>
                            <Select allowClear>
                              <Option value="high_school">High School</Option>
                              <Option value="bachelor">Bachelor's Degree</Option>
                              <Option value="master">Master's Degree</Option>
                              <Option value="phd">PhD</Option>
                            </Select>
                          </S.FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.FormItem name="qualification" label="Qualification" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name="graduationYear" label="Graduation Year" isDarkMode={isDarkMode}>
                            <Input type="number" />
                          </S.FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.FormItem name="certifications" label="Certifications" isDarkMode={isDarkMode}>
                            <TextArea rows={2} />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name="skillsSummary" label="Skills Summary" isDarkMode={isDarkMode}>
                            <TextArea rows={2} />
                          </S.FormItem>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={24}>
                          <S.FormItem name="technicalSkills" label="Technical Skills" isDarkMode={isDarkMode}>
                            <Select
                              mode="multiple"
                              allowClear
                              placeholder="Select your technical skills"
                              style={{ width: '100%' }}
                            >
                              {technicalSkills.map((skill: any) => <Option key={skill.id} value={skill.id}>{skill.name}</Option>)}
                            </Select>
                          </S.FormItem>
                        </Col>
                      </Row>
                    </S.StyledCard>
                  </TabPane>
                </S.StyledTabs>
              </Col>
            </Row>
          </S.ProfileContent>
        </S.ProfileCard>
        </S.StyledCard>
        
        <EditProfileImageModal
          visible={isImageModalVisible}
          onCancel={() => setIsImageModalVisible(false)}
          onSave={handleImageSave}
          loading={updateImageMutation.isPending}
          currentProfileImage={avatarImage || employeeData?.personalInfo?.avatar}
          currentCoverImage={coverImage || employeeData?.personalInfo?.coverImage}
        />
      </Form>
    </S.PageContainer>
  );
};

export default EditProfile;