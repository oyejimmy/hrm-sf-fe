import React, { useState } from 'react';
import { Steps, Form, Input, Select, DatePicker, Upload, Button, Row, Col, Card, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useOnboarding } from '../../hooks/api/useAuth';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

interface OnboardingData {
  // Personal Information
  title?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  phone: string;
  profile_picture?: string;
  
  // Job Information
  department: string;
  position: string;
  hire_date: string;
  employment_type: string;
  employee_id?: string;
  manager?: string;
  employment_status: string;
  work_schedule: string;
  work_location: string;
  qualification: string;
  
  // Personal Details
  gender: string;
  religion?: string;
  date_of_birth: string;
  marital_status: string;
  blood_group: string;
  nationality: string;
  personal_email: string;
  address: string;
  
  // Emergency Contact
  emergency_contact_name: string;
  emergency_contact_work_phone?: string;
  emergency_contact_relationship: string;
  emergency_contact_home_phone?: string;
  emergency_contact_phone: string;
  emergency_contact_address: string;
  
  // Education & Skills
  university?: string;
  graduation_year?: number;
  certifications?: string;
  skills_summary?: string;
  technical_skills?: string[];
}

const StepOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [imageUrl, setImageUrl] = useState<string>();

  const onboardingMutation = useOnboarding();
  
  const handleOnboardingSuccess = () => {
    navigate('/employee/dashboard');
  };

  const steps = [
    {
      title: 'Personal Information',
      content: (
        <div>
          <Card title="Personal Information" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={24} style={{ textAlign: 'center', marginBottom: 24 }}>
                <Form.Item name="profile_picture">
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setImageUrl(e.target?.result as string);
                        form.setFieldsValue({ profile_picture: e.target?.result });
                      };
                      reader.readAsDataURL(file);
                      return false;
                    }}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt="avatar" style={{ width: '100%', borderRadius: '50%' }} />
                    ) : (
                      <div>
                        <UserOutlined />
                        <div style={{ marginTop: 8 }}>Upload Photo</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="title" label="Title">
                  <Select placeholder="Select your title">
                    <Option value="Mr">Mr</Option>
                    <Option value="Mrs">Mrs</Option>
                    <Option value="Miss">Miss</Option>
                    <Option value="Dr">Dr</Option>
                    <Option value="Prof">Prof</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="first_name" label="First Name">
                  <Input placeholder="Enter your first name" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="middle_name" label="Middle Name">
                  <Input placeholder="Enter middle name (optional)" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="last_name" label="Last Name">
                  <Input placeholder="Enter your last name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Phone Number">
                  <Input placeholder="Enter your phone number" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Personal Details">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="gender" label="Gender">
                  <Select placeholder="Select your gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="religion" label="Religion">
                  <Input placeholder="Enter your religion (optional)" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="date_of_birth" label="Date of Birth">
                  <DatePicker style={{ width: '100%' }} placeholder="Select your date of birth" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="marital_status" label="Marital Status">
                  <Select placeholder="Select marital status">
                    <Option value="single">Single</Option>
                    <Option value="married">Married</Option>
                    <Option value="divorced">Divorced</Option>
                    <Option value="widowed">Widowed</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="blood_group" label="Blood Group">
                  <Select placeholder="Select your blood group">
                    <Option value="A+">A+</Option>
                    <Option value="A-">A-</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B-">B-</Option>
                    <Option value="AB+">AB+</Option>
                    <Option value="AB-">AB-</Option>
                    <Option value="O+">O+</Option>
                    <Option value="O-">O-</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="nationality" label="Nationality">
                  <Input placeholder="Enter your nationality" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="personal_email" label="Personal Email">
                  <Input placeholder="Enter your personal email address" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="address" label="Address">
                  <TextArea rows={3} placeholder="Enter your complete residential address" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </div>
      ),
    },
    {
      title: 'Job Information',
      content: (
        <Card title="Job Information">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="Department">
                <Select placeholder="Select your department">
                  <Option value="Human Resources">Human Resources</Option>
                  <Option value="Information Technology">Information Technology</Option>
                  <Option value="Finance">Finance</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Sales">Sales</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="position" label="Position">
                <Input placeholder="Enter your job position/title" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hire_date" label="Hired On">
                <DatePicker style={{ width: '100%' }} placeholder="Select your joining date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employment_type" label="Employment Type">
                <Select placeholder="Select employment type">
                  <Option value="permanent">Permanent</Option>
                  <Option value="contract">Contract</Option>
                  <Option value="temporary">Temporary</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="employee_id" label="Employee ID">
                <Input placeholder="Enter employee ID (if assigned)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="manager" label="Manager">
                <Input placeholder="Enter your reporting manager's name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="employment_status" label="Employment Status">
                <Select placeholder="Select status">
                  <Option value="full_time">Full Time</Option>
                  <Option value="part_time">Part Time</Option>
                  <Option value="contract">Contract</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="work_schedule" label="Work Schedule">
                <Select placeholder="Select work schedule">
                  <Option value="Standard (9:00 AM - 6:00 PM)">Standard (9:00 AM - 6:00 PM)</Option>
                  <Option value="Flexible">Flexible</Option>
                  <Option value="Shift Work">Shift Work</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="work_location" label="Work Location">
                <Select placeholder="Select work location">
                  <Option value="office">Office</Option>
                  <Option value="remote">Remote</Option>
                  <Option value="hybrid">Hybrid</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="qualification" label="Qualification">
                <Input placeholder="Enter your highest qualification (e.g., Bachelor's in Computer Science)" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },

    {
      title: 'Emergency Contact',
      content: (
        <Card title="Emergency Contact Information">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="emergency_contact_name" label="Contact Name">
                <Input placeholder="Enter emergency contact's full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="emergency_contact_relationship" label="Relationship">
                <Input placeholder="Enter relationship (e.g., Father, Mother, Spouse)" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="emergency_contact_phone" label="Mobile Number">
                <Input placeholder="Enter mobile number" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="emergency_contact_work_phone" label="Work Phone">
                <Input placeholder="Enter work phone (optional)" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="emergency_contact_home_phone" label="Home Phone">
                <Input placeholder="Enter home phone (optional)" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="emergency_contact_address" label="Address">
                <TextArea rows={3} placeholder="Enter emergency contact's complete address" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      title: 'Education & Skills',
      content: (
        <Card title="Education & Skills">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="university" label="University">
                <Input placeholder="Enter your university/college name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="graduation_year" label="Graduation Year">
                <Input type="number" placeholder="Enter graduation year (e.g., 2020)" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="certifications" label="Certifications">
                <TextArea rows={2} placeholder="List your professional certifications (e.g., AWS Certified, PMP, etc.)" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="skills_summary" label="Skills Summary">
                <TextArea rows={3} placeholder="Provide a brief summary of your key skills and expertise" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="technical_skills" label="Technical Skills">
                <Select mode="tags" placeholder="Add your technical skills (type and press enter)">
                  <Option value="JavaScript">JavaScript</Option>
                  <Option value="Python">Python</Option>
                  <Option value="Java">Java</Option>
                  <Option value="React">React</Option>
                  <Option value="Node.js">Node.js</Option>
                  <Option value="SQL">SQL</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
  ];

  const next = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    }).catch(() => {
      message.error('Please fill in all required fields');
    });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleCompleteOnboarding = () => {
    // Get all form values including from all steps
    const allValues = form.getFieldsValue(true);
    
    const formattedData = {
      ...allValues,
      hire_date: allValues.hire_date?.format('YYYY-MM-DD') || null,
      date_of_birth: allValues.date_of_birth?.format('YYYY-MM-DD') || null,
      technical_skills: allValues.technical_skills || [],
    };
    
    // Remove undefined values
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === undefined) {
        delete formattedData[key];
      }
    });
    
    console.log('Submitting all onboarding data:', formattedData);
    
    onboardingMutation.mutate(formattedData, {
      onSuccess: handleOnboardingSuccess
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Steps current={currentStep} style={{ marginBottom: '32px' }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          first_name: user?.first_name,
          last_name: user?.last_name,
          phone: user?.phone,
        }}
      >
        <div style={{ minHeight: '400px' }}>
          {steps[currentStep].content}
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          {currentStep > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={prev}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button 
              type="primary" 
              onClick={handleCompleteOnboarding}
              loading={onboardingMutation.isPending}
            >
              Complete Onboarding
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default StepOnboarding;