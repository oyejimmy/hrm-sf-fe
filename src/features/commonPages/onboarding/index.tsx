import React, { useState, useEffect } from 'react';
import { Steps, Form, Button, Space, Typography, Spin, message } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';
import { useOnboarding } from '../../../hooks/api/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../../services/api/authApi';
import { getDashboardRoute } from '../../../utils/authHelpers';
import { DATE_FORMATS } from '../../../constants';
import { UserInfoFormData } from './types';
import * as S from './components/styles';
import api from '../../../services/api/api';
import { masterDataApi } from '../../../services/api/masterDataApi';
import dayjs from 'dayjs';

// Step Components
import PersonalInformationStep from './components/PersonalInformationStep';
import JobInformationStep from './components/JobInformationStep';
import EmergencyContactStep from './components/EmergencyContactStep';
import EducationSkillsStep from './components/EducationSkillsStep';

const { Step } = Steps;
const { Title, Text } = Typography;

// Constants
const TITLES = ['Mr', 'Mrs', 'Miss', 'Dr', 'Prof'];

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];
const MARITAL_STATUS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' }
];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const QUALIFICATIONS = ['Associate Degree', "Bachelor's Degree", 'Diploma', 'Doctorate/PhD', 'High School', "Master's Degree", 'Professional Certificate', 'Other'];
const TEAM_SIZES = [
  { value: 1, label: '1 (Individual Contributor)' },
  { value: 2, label: '2-5 members' },
  { value: 6, label: '6-10 members' },
  { value: 11, label: '11-20 members' },
  { value: 21, label: '21-50 members' },
  { value: 51, label: '50+ members' }
];


// UserInfoForm Component
export const UserInfoForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const completeProfileMutation = useMutation({
    mutationFn: (data: UserInfoFormData) => authApi.completeProfile(data),
    onSuccess: () => {
      message.success('Profile completed successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      navigate('/employee/dashboard');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.detail || 'Failed to complete profile');
    },
  });

  return (
    <S.UserFormContainer>
      <S.UserFormCard>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <S.UserFormTitle level={2}>Complete Your Profile</S.UserFormTitle>
            <Text type="secondary">Please provide your information to get started with the HRM system</Text>
          </div>
          <Form form={form} layout="vertical" onFinish={completeProfileMutation.mutate} requiredMark={false} size="large">
            <PersonalInformationStep 
              imageUrl=""
              setImageUrl={() => {}}
              form={form}
              TITLES={TITLES}
              GENDERS={GENDERS}
              MARITAL_STATUS={MARITAL_STATUS}
              BLOOD_GROUPS={BLOOD_GROUPS}
            />
            <Form.Item>
              <S.UserFormButton type="primary" htmlType="submit" block size="large" loading={completeProfileMutation.isPending}>
                Complete Profile
              </S.UserFormButton>
            </Form.Item>
          </Form>
        </Space>
      </S.UserFormCard>
    </S.UserFormContainer>
  );
};

// OnboardingWrapper Component
export const OnboardingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: profileStatus, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfileStatus,
    retry: false
  });

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (profileStatus && !(profileStatus as any).profile_completed) {
    return <UserInfoForm />;
  }

  return <>{children}</>;
};

// MinimalOnboarding Component
export const MinimalOnboarding: React.FC = () => {
  const { user, completeProfile, isCompleteProfileLoading } = useAuthContext();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await completeProfile(values);
      const dashboardRoute = getDashboardRoute(user?.role || 'employee');
      navigate(dashboardRoute, { replace: true });
    } catch (error) {
      console.error('Profile completion failed:', error);
    }
  };

  return (
    <S.MinimalContainer>
      <S.MinimalCard>
        <S.MinimalHeader>
          <Title level={2}>Complete Your Profile</Title>
          <Text type="secondary">Please provide your information to continue</Text>
        </S.MinimalHeader>
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ first_name: user?.first_name || '', last_name: user?.last_name || '', phone: user?.phone || '', role: user?.role || 'employee' }}>
          <PersonalInformationStep 
            imageUrl=""
            setImageUrl={() => {}}
            form={form}
            TITLES={TITLES}
            GENDERS={GENDERS}
            MARITAL_STATUS={MARITAL_STATUS}
            BLOOD_GROUPS={BLOOD_GROUPS}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={isCompleteProfileLoading}>
              Complete Profile
            </Button>
          </Form.Item>
        </Form>
      </S.MinimalCard>
    </S.MinimalContainer>
  );
};

// Main StepOnboarding Component
const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [imageUrl, setImageUrl] = useState<string>();
  const onboardingMutation = useOnboarding();
  
  const { data: languages = [] } = useQuery({
    queryKey: ['languages'],
    queryFn: () => masterDataApi.getLanguages().then(res => res.data)
  });
  
  const { data: technicalSkills = [] } = useQuery({
    queryKey: ['technical-skills'],
    queryFn: () => masterDataApi.getTechnicalSkills().then(res => res.data)
  });
  
  const { data: profileData } = useQuery({
    queryKey: ['employee-profile'],
    queryFn: () => api.get('/api/employees/me/profile').then((res: any) => res.data),
    retry: false
  });
  
  useEffect(() => {
    if (profileData?.personalInfo) {
      const data = profileData.personalInfo;
      const initialValues: any = {
        title: data.title || '',
        first_name: data.name?.split(' ')[0] || user?.first_name || '',
        last_name: data.name?.split(' ').slice(1).join(' ') || user?.last_name || '',
        phone_number: user?.phone || '',
        personal_email: data.personalEmail || '',
        gender: data.gender || '',
        date_of_birth: data.dateOfBirth ? dayjs(data.dateOfBirth) : null,
        marital_status: data.maritalStatus || '',
        blood_group: data.bloodGroup || '',
        nationality: data.nationality || '',
        religion: data.religion || '',
        address: data.address || '',
        teamSize: data.teamSize || null,
        languagesKnown: data.languagesKnown || [],
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_relationship: data.emergency_contact_relationship || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
        emergency_contact_work_phone: data.emergency_contact_work_phone || '',
        emergency_contact_home_phone: data.emergency_contact_home_phone || '',
        emergency_contact_address: data.emergency_contact_address || '',
        university: data.university || '',
        graduation_year: data.graduationYear ? dayjs().year(data.graduationYear) : null,
        certifications: data.certifications || '',
        skills_summary: data.skillsSummary || ''
      };
      
      if (data.avatar) {
        setImageUrl(data.avatar);
        initialValues.profile_picture = data.avatar;
      }
      
      form.setFieldsValue(initialValues);
    }
  }, [profileData, user, form]);

  const steps = [
    {
      title: 'Personal Information',
      content: <PersonalInformationStep 
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        form={form}
        TITLES={TITLES}
        GENDERS={GENDERS}
        MARITAL_STATUS={MARITAL_STATUS}
        BLOOD_GROUPS={BLOOD_GROUPS}
      />
    },
    {
      title: 'Job Information',
      content: <JobInformationStep 
        profileData={profileData}
        QUALIFICATIONS={QUALIFICATIONS}
        TEAM_SIZES={TEAM_SIZES}
        LANGUAGES={languages}
      />
    },
    {
      title: 'Emergency Contact',
      content: <EmergencyContactStep />
    },
    {
      title: 'Education & Skills',
      content: <EducationSkillsStep TECHNICAL_SKILLS={technicalSkills} />
    }
  ];

  const next = () => {
    form.validateFields().then(() => setCurrentStep(currentStep + 1)).catch(() => message.error('Please fill in all required fields'));
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const handleCompleteOnboarding = () => {
    const allValues = form.getFieldsValue(true);
    const formattedData = {
      ...allValues,
      hire_date: allValues.hire_date?.format(DATE_FORMATS.INPUT) || null,
      date_of_birth: allValues.date_of_birth?.format(DATE_FORMATS.INPUT) || null,
      graduation_year: allValues.graduation_year || null,
      technical_skills: allValues.technical_skills?.map(String) || [],
      qualification: allValues.qualification_level && allValues.degree_name ? `${allValues.qualification_level} in ${allValues.degree_name}` : '',
      phone: allValues.country_code && allValues.phone_number ? `${allValues.country_code}${allValues.phone_number.replace(/^0+/, '')}` : '',
      teamSize: allValues.teamSize || null,
      languagesKnown: allValues.languagesKnown || [],
    };
    
    delete formattedData.qualification_level;
    delete formattedData.degree_name;
    delete formattedData.country_code;
    delete formattedData.phone_number;
    
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === undefined) delete formattedData[key];
    });
    
    onboardingMutation.mutate(formattedData, {
      onSuccess: () => navigate('/employee/dashboard')
    });
  };

  return (
    <S.Container>
      <S.HeaderCard>
        <S.HeaderIcon as={InfoCircleOutlined} />
        <S.HeaderTitle>Complete Your Profile</S.HeaderTitle>
        <S.HeaderText>
          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} />
          Please fill out all required information to proceed to your dashboard
        </S.HeaderText>
      </S.HeaderCard>
      <S.StyledSteps current={currentStep}>
        {steps.map(item => <Step key={item.title} title={item.title} />)}
      </S.StyledSteps>
      <Form form={form} layout="vertical">
        <S.StepContent>{steps[currentStep].content}</S.StepContent>
        <S.ButtonContainer>
          {currentStep > 0 && <S.PrevButton onClick={prev}>Previous</S.PrevButton>}
          {currentStep < steps.length - 1 && <S.NextButton type="primary" onClick={next}>Next</S.NextButton>}
          {currentStep === steps.length - 1 && <S.CompleteButton type="primary" onClick={handleCompleteOnboarding} loading={onboardingMutation.isPending}>Complete Onboarding</S.CompleteButton>}
        </S.ButtonContainer>
      </Form>
    </S.Container>
  );
};

export default Onboarding;