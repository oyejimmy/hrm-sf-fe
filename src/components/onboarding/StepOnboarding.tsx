import React, { useState, useEffect } from 'react';
import { Steps, Form, Input, Select, DatePicker, Upload, Button, Row, Col, Card, message, Tooltip, AutoComplete, Descriptions } from 'antd';
import { UserOutlined, UploadOutlined, InfoCircleOutlined, CheckCircleOutlined, QuestionCircleOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useOnboarding } from '../../hooks/api/useAuth';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api/api';
import dayjs from 'dayjs';
import { DATE_FORMATS } from '../../constants';

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
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [managerOptions, setManagerOptions] = useState<any[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);

  const onboardingMutation = useOnboarding();
  
  // Fetch existing profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['employee-profile'],
    queryFn: () => api.get('/api/employees/me/profile').then(res => res.data),
    retry: false
  });
  
  const handleOnboardingSuccess = () => {
    navigate('/employee/dashboard');
  };
  
  // Initialize form with existing data when profile data is loaded
  useEffect(() => {
    if (profileData && profileData.personalInfo) {
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
        department: data.department || '',
        position: data.position || '',
        hire_date: data.hireDate ? dayjs(data.hireDate) : null,
        employee_id: data.employeeId || '',
        manager: data.manager || '',
        employment_status: profileData.jobInfo?.employmentStatus || '',
        work_schedule: profileData.jobInfo?.workSchedule || '',
        work_location: profileData.jobInfo?.workLocation || '',
        qualification: data.qualification || '',
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
      
      // Set avatar if exists
      if (data.avatar) {
        setImageUrl(data.avatar);
        initialValues.profile_picture = data.avatar;
      }
      
      form.setFieldsValue(initialValues);
      
      // Set department for position filtering
      if (data.department) {
        setSelectedDepartment(data.department);
      }
    }
  }, [profileData, user, form]);

  const steps = [
    {
      title: 'Personal Information',
      content: (
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Form.Item name="profile_picture" rules={[{ required: true, message: 'Please upload a profile picture' }]}>
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
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px dashed #d9d9d9', background: imageUrl ? 'none' : '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  {imageUrl ? (
                    <img src={imageUrl} alt="avatar" style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'center' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#999' }}>
                      <UserOutlined style={{ fontSize: '20px' }} />
                      <div style={{ fontSize: '12px' }}>Upload</div>
                    </div>
                  )}
                </div>
              </Upload>
            </Form.Item>
          </div>
          <Row gutter={16}>
            <Col xs={24} sm={6} md={3}>
              <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Select title' }]}>
                <Select placeholder="Select title">
                  <Option value="Mr">Mr</Option>
                  <Option value="Mrs">Mrs</Option>
                  <Option value="Miss">Miss</Option>
                  <Option value="Dr">Dr</Option>
                  <Option value="Prof">Prof</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={9} md={10}>
              <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Enter first name' }]}>
                <Input placeholder="First name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={9} md={11}>
              <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Enter last name' }]}>
                <Input placeholder="Last name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="phone" label="Contact Number">
                <Input.Group compact>
                  <Form.Item name="country_code" noStyle initialValue="+92">
                    <Select style={{ width: '20%' }} placeholder="Code">
                      <Option value="+1">🇺🇸 +1</Option>
                      <Option value="+44">🇬🇧 +44</Option>
                      <Option value="+91">🇮🇳 +91</Option>
                      <Option value="+92">🇵🇰 +92</Option>
                      <Option value="+86">🇨🇳 +86</Option>
                      <Option value="+49">🇩🇪 +49</Option>
                      <Option value="+33">🇫🇷 +33</Option>
                      <Option value="+81">🇯🇵 +81</Option>
                      <Option value="+82">🇰🇷 +82</Option>
                      <Option value="+61">🇦🇺 +61</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="phone_number" noStyle rules={[{ required: true, message: 'Enter contact number' }]}>
                    <Input style={{ width: '80%' }} placeholder="Contact number" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="personal_email" label="Personal Email" rules={[{ required: true, message: 'Enter personal email' }, { type: 'email', message: 'Enter valid email' }]}>
                <Input placeholder="Personal email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Select gender' }]}>
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="date_of_birth" label="Date of Birth" rules={[{ required: true, message: 'Select date of birth' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="Select date of birth" format={DATE_FORMATS.DISPLAY} showToday={false} changeOnBlur />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="marital_status" label="Marital Status" rules={[{ required: true, message: 'Select marital status' }]}>
                <Select placeholder="Select marital status">
                  <Option value="single">Single</Option>
                  <Option value="married">Married</Option>
                  <Option value="divorced">Divorced</Option>
                  <Option value="widowed">Widowed</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="blood_group" label="Blood Group">
                <Select placeholder="Select blood group">
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
            <Col span={24}>
              <Form.Item name="address" label="Address">
                <TextArea rows={3} placeholder="Complete residential address" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      title: 'Job Information',
      content: (
        <Card>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: '600' }}>Job Information</h3>
          <Row gutter={[24, 16]}>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Hired On</div>
                <div style={{ color: '#595959' }}>{profileData?.personalInfo?.hireDate ? dayjs(profileData.personalInfo.hireDate).format(DATE_FORMATS.DISPLAY) : '-'}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Department</div>
                <div style={{ color: '#595959' }}>{profileData?.personalInfo?.department || '-'}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Position</div>
                <div style={{ color: '#595959' }}>{profileData?.personalInfo?.position || '-'}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Employment Type</div>
                <div style={{ color: '#595959' }}>{profileData?.jobInfo?.employmentType || '-'}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Employee ID</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#595959' }}>
                  {profileData?.personalInfo?.employeeId || '-'}
                  {profileData?.personalInfo?.employeeId && (
                    <CopyOutlined 
                      style={{ cursor: 'pointer', color: '#1890ff' }}
                      onClick={() => {
                        navigator.clipboard.writeText(profileData.personalInfo.employeeId);
                        message.success('Employee ID copied to clipboard');
                      }}
                    />
                  )}
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Manager</div>
                <div style={{ color: '#595959' }}>{profileData?.personalInfo?.manager || '-'}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Employment Status</div>
                <div style={{ color: '#595959' }}>{profileData?.jobInfo?.employmentStatus || '-'}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Work Schedule</div>
                <div style={{ color: '#595959' }}>{profileData?.jobInfo?.workSchedule || '-'}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Work Type</div>
                <div style={{ color: '#595959' }}>{profileData?.jobInfo?.workType || '-'}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#262626' }}>Work Location</div>
                <div style={{ color: '#595959' }}>{profileData?.jobInfo?.workLocation || '-'}</div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="qualification_level" label="Qualification Level" rules={[{ required: true, message: 'Select qualification level' }]}>
                <Select placeholder="Select qualification level">
                  <Option value="Associate Degree">Associate Degree</Option>
                  <Option value="Bachelor's Degree">Bachelor's Degree</Option>
                  <Option value="Diploma">Diploma</Option>
                  <Option value="Doctorate/PhD">Doctorate/PhD</Option>
                  <Option value="High School">High School</Option>
                  <Option value="Master's Degree">Master's Degree</Option>
                  <Option value="Professional Certificate">Professional Certificate</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="degree_name" label="Degree/Field of Study" rules={[{ required: true, message: 'Enter degree or field' }]}>
                <Input placeholder="e.g., Computer Science, MBA" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },

    {
      title: 'Emergency Contact',
      content: (
        <Card>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="emergency_contact_name" label="Contact Name" rules={[{ required: true, message: 'Enter contact name' }]}>
                <Input placeholder="Full name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="emergency_contact_relationship" label="Relationship" rules={[{ required: true, message: 'Enter relationship' }]}>
                <Input placeholder="e.g., Father, Mother, Spouse" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="emergency_contact_phone" label="Mobile Number" rules={[{ required: true, message: 'Enter mobile number' }]}>
                <Input placeholder="Mobile number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="emergency_contact_work_phone" label="Work Phone">
                <Input placeholder="Work phone (optional)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="emergency_contact_home_phone" label="Home Phone">
                <Input placeholder="Home phone (optional)" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="emergency_contact_address" label="Address">
                <TextArea rows={3} placeholder="Complete address" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      ),
    },
    {
      title: 'Education & Skills',
      content: (
        <Card>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="university" label="University/College" rules={[{ required: true, message: 'Enter university name' }]}>
                <Input placeholder="University/College name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="graduation_year" label="Graduation Date" rules={[{ required: true, message: 'Select graduation date' }]}>
                <DatePicker picker="month" style={{ width: '100%' }} placeholder="Select graduation month/year" format={DATE_FORMATS.MONTH_YEAR} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="certifications" label="Certifications">
                <TextArea rows={2} placeholder="e.g., AWS Certified, PMP, etc." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="skills_summary" label="Skills Summary">
                <TextArea rows={3} placeholder="Brief summary of key skills and expertise" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="technical_skills" label="Technical Skills" rules={[{ required: true, message: 'Add at least one technical skill' }]}>
                <Select mode="tags" placeholder="Add technical skills (type and press enter)" showSearch filterOption={(input, option) => String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
                  <Option value="Adobe XD">Adobe XD</Option>
                  <Option value="Algorithms">Algorithms</Option>
                  <Option value="Android">Android</Option>
                  <Option value="Angular">Angular</Option>
                  <Option value="Ansible">Ansible</Option>
                  <Option value="API Design">API Design</Option>
                  <Option value="Automation Testing">Automation Testing</Option>
                  <Option value="AWS">AWS</Option>
                  <Option value="CSS">CSS</Option>
                  <Option value="Cypress">Cypress</Option>
                  <Option value="Data Analysis">Data Analysis</Option>
                  <Option value="Data Visualization">Data Visualization</Option>
                  <Option value="Deep Learning">Deep Learning</Option>
                  <Option value="Django">Django</Option>
                  <Option value="Docker">Docker</Option>
                  <Option value="Express.js">Express.js</Option>
                  <Option value="FastAPI">FastAPI</Option>
                  <Option value="Figma">Figma</Option>
                  <Option value="Flutter">Flutter</Option>
                  <Option value="Git">Git</Option>
                  <Option value="HTML">HTML</Option>
                  <Option value="Illustrator">Illustrator</Option>
                  <Option value="iOS">iOS</Option>
                  <Option value="Java">Java</Option>
                  <Option value="JavaScript">JavaScript</Option>
                  <Option value="Jenkins">Jenkins</Option>
                  <Option value="Jest">Jest</Option>
                  <Option value="Jupyter">Jupyter</Option>
                  <Option value="Keras">Keras</Option>
                  <Option value="Kotlin">Kotlin</Option>
                  <Option value="Kubernetes">Kubernetes</Option>
                  <Option value="Linux">Linux</Option>
                  <Option value="Machine Learning">Machine Learning</Option>
                  <Option value="Manual Testing">Manual Testing</Option>
                  <Option value="Matplotlib">Matplotlib</Option>
                  <Option value="Microservices">Microservices</Option>
                  <Option value="MLOps">MLOps</Option>
                  <Option value="Model Deployment">Model Deployment</Option>
                  <Option value="MongoDB">MongoDB</Option>
                  <Option value="Monitoring">Monitoring</Option>
                  <Option value="Neural Networks">Neural Networks</Option>
                  <Option value="Next.js">Next.js</Option>
                  <Option value="Nginx">Nginx</Option>
                  <Option value="NLP">NLP</Option>
                  <Option value="Node.js">Node.js</Option>
                  <Option value="NumPy">NumPy</Option>
                  <Option value="OpenCV">OpenCV</Option>
                  <Option value="Pandas">Pandas</Option>
                  <Option value="Performance Testing">Performance Testing</Option>
                  <Option value="Photoshop">Photoshop</Option>
                  <Option value="Postman">Postman</Option>
                  <Option value="Prototyping">Prototyping</Option>
                  <Option value="Python">Python</Option>
                  <Option value="PyTorch">PyTorch</Option>
                  <Option value="R">R</Option>
                  <Option value="React">React</Option>
                  <Option value="React Native">React Native</Option>
                  <Option value="Redux">Redux</Option>
                  <Option value="REST API">REST API</Option>
                  <Option value="SASS">SASS</Option>
                  <Option value="Scikit-learn">Scikit-learn</Option>
                  <Option value="Selenium">Selenium</Option>
                  <Option value="Sketch">Sketch</Option>
                  <Option value="Spring Boot">Spring Boot</Option>
                  <Option value="SQL">SQL</Option>
                  <Option value="Statistics">Statistics</Option>
                  <Option value="Swift">Swift</Option>
                  <Option value="TensorFlow">TensorFlow</Option>
                  <Option value="Terraform">Terraform</Option>
                  <Option value="Test Planning">Test Planning</Option>
                  <Option value="TestNG">TestNG</Option>
                  <Option value="TypeScript">TypeScript</Option>
                  <Option value="Unit Testing">Unit Testing</Option>
                  <Option value="User Research">User Research</Option>
                  <Option value="UX Design">UX Design</Option>
                  <Option value="Vue.js">Vue.js</Option>
                  <Option value="Wireframing">Wireframing</Option>
                  <Option value="Xamarin">Xamarin</Option>
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
      hire_date: allValues.hire_date?.format(DATE_FORMATS.INPUT) || null,
      date_of_birth: allValues.date_of_birth?.format(DATE_FORMATS.INPUT) || null,
      graduation_year: allValues.graduation_year?.year() || null,
      technical_skills: allValues.technical_skills || [],
      qualification: allValues.qualification_level && allValues.degree_name ? `${allValues.qualification_level} in ${allValues.degree_name}` : '',
      phone: allValues.country_code && allValues.phone_number ? `${allValues.country_code}${allValues.phone_number.replace(/^0+/, '')}` : '',
    };
    
    // Remove the separate fields
    delete formattedData.qualification_level;
    delete formattedData.degree_name;
    delete formattedData.country_code;
    delete formattedData.phone_number;
    
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
      <div style={{ textAlign: 'center', marginBottom: '24px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <InfoCircleOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
        <h3 style={{ margin: 0, color: '#262626', fontSize: '18px', fontWeight: '600' }}>Complete Your Profile</h3>
        <p style={{ margin: '8px 0 0 0', color: '#595959', fontSize: '14px' }}>
          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '6px' }} />
          Please fill out all required information to proceed to your dashboard
        </p>
      </div>
      <Steps current={currentStep} style={{ marginBottom: '32px' }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
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