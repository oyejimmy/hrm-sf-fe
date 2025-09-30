import React, { useState } from 'react';
import { Steps, Form, Input, Select, DatePicker, Upload, Button, Row, Col, Card, message, Tooltip, AutoComplete } from 'antd';
import { UserOutlined, UploadOutlined, InfoCircleOutlined, CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
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
  const [selectedDepartment, setSelectedDepartment] = useState<string>();
  const [managerOptions, setManagerOptions] = useState<any[]>([]);
  const [managerLoading, setManagerLoading] = useState(false);

  const onboardingMutation = useOnboarding();
  
  const handleOnboardingSuccess = () => {
    navigate('/employee/dashboard');
  };

  const steps = [
    {
      title: 'Personal Information',
      content: (
        <Card>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
              <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please select your title' }]}>
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
              <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Please enter your first name' }]}>
                <Input placeholder="Enter your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={9} md={11}>
              <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Please enter your last name' }]}>
                <Input placeholder="Enter your last name" />
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
                  <Form.Item name="phone_number" noStyle rules={[{ required: true, message: 'Please enter your contact number' }]}>
                    <Input style={{ width: '80%' }} placeholder="Enter your contact number" />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="personal_email" label="Personal Email" rules={[{ required: true, message: 'Please enter your personal email' }, { type: 'email', message: 'Please enter a valid email address' }]}>
                <Input placeholder="Enter your personal email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select your gender' }]}>
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="date_of_birth" label="Date of Birth" rules={[{ required: true, message: 'Please select your date of birth' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="Select date" format="DD MMM, YYYY" showToday={false} changeOnBlur />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="marital_status" label="Marital Status" rules={[{ required: true, message: 'Please select your marital status' }]}>
                <Select placeholder="Select status">
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
                <Input placeholder="Enter nationality" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="religion" label="Religion">
                <Input placeholder="Enter religion (optional)" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="address" label="Address">
                <TextArea rows={3} placeholder="Enter your complete residential address" />
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
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="hire_date" label={<span>Hired On <Tooltip title="Please confirm your hiring date with HR department to ensure accuracy in your employment records."><QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} /></Tooltip></span>} rules={[{ required: true, message: 'Please select your hiring date' }]}>
                <DatePicker style={{ width: '100%' }} placeholder="Select your joining date" format="DD MMM, YYYY" showToday={false} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please select your department' }]}>
                <Select placeholder="Select your department" showSearch filterOption={(input, option) => String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())} onChange={(value) => { setSelectedDepartment(value); form.setFieldsValue({ position: undefined }); }}>
                  <Option value="Artificial Intelligence">Artificial Intelligence</Option>
                  <Option value="Backend Development">Backend Development</Option>
                  <Option value="Business Analysis">Business Analysis</Option>
                  <Option value="Data Analytics">Data Analytics</Option>
                  <Option value="Data Engineering">Data Engineering</Option>
                  <Option value="Data Science">Data Science</Option>
                  <Option value="DevOps">DevOps</Option>
                  <Option value="Finance">Finance</Option>
                  <Option value="Frontend Development">Frontend Development</Option>
                  <Option value="Full Stack Development">Full Stack Development</Option>
                  <Option value="Human Resources">Human Resources</Option>
                  <Option value="Information Technology">Information Technology</Option>
                  <Option value="LLM">LLM</Option>
                  <Option value="Machine Learning">Machine Learning</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Mobile Development">Mobile Development</Option>
                  <Option value="Product Management">Product Management</Option>
                  <Option value="Quality Assurance">Quality Assurance</Option>
                  <Option value="Sales">Sales</Option>
                  <Option value="Software Development">Software Development</Option>
                  <Option value="Technical Support">Technical Support</Option>
                  <Option value="UI/UX Design">UI/UX Design</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Please select your position' }]}>
                <Select placeholder="Select your position" showSearch filterOption={(input, option) => String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
                  {selectedDepartment === 'Artificial Intelligence' && [
                    <Option key="ai-engineer" value="AI Engineer">AI Engineer</Option>,
                    <Option key="ai-researcher" value="AI Researcher">AI Researcher</Option>,
                    <Option key="ai-specialist" value="AI Specialist">AI Specialist</Option>
                  ]}
                  {selectedDepartment === 'Backend Development' && [
                    <Option key="backend-dev" value="Backend Developer">Backend Developer</Option>,
                    <Option key="senior-backend" value="Senior Backend Developer">Senior Backend Developer</Option>,
                    <Option key="backend-lead" value="Backend Team Lead">Backend Team Lead</Option>
                  ]}
                  {selectedDepartment === 'Frontend Development' && [
                    <Option key="frontend-dev" value="Frontend Developer">Frontend Developer</Option>,
                    <Option key="senior-frontend" value="Senior Frontend Developer">Senior Frontend Developer</Option>,
                    <Option key="frontend-lead" value="Frontend Team Lead">Frontend Team Lead</Option>
                  ]}
                  {selectedDepartment === 'Full Stack Development' && [
                    <Option key="fullstack-dev" value="Full Stack Developer">Full Stack Developer</Option>,
                    <Option key="senior-fullstack" value="Senior Full Stack Developer">Senior Full Stack Developer</Option>,
                    <Option key="fullstack-lead" value="Full Stack Team Lead">Full Stack Team Lead</Option>
                  ]}
                  {selectedDepartment === 'Data Science' && [
                    <Option key="data-scientist" value="Data Scientist">Data Scientist</Option>,
                    <Option key="senior-data-scientist" value="Senior Data Scientist">Senior Data Scientist</Option>,
                    <Option key="data-science-lead" value="Data Science Lead">Data Science Lead</Option>
                  ]}
                  {selectedDepartment === 'Machine Learning' && [
                    <Option key="ml-engineer" value="ML Engineer">ML Engineer</Option>,
                    <Option key="senior-ml" value="Senior ML Engineer">Senior ML Engineer</Option>,
                    <Option key="ml-lead" value="ML Team Lead">ML Team Lead</Option>
                  ]}
                  {selectedDepartment === 'DevOps' && [
                    <Option key="devops-engineer" value="DevOps Engineer">DevOps Engineer</Option>,
                    <Option key="senior-devops" value="Senior DevOps Engineer">Senior DevOps Engineer</Option>,
                    <Option key="devops-lead" value="DevOps Lead">DevOps Lead</Option>
                  ]}
                  {selectedDepartment === 'Quality Assurance' && [
                    <Option key="qa-engineer" value="QA Engineer">QA Engineer</Option>,
                    <Option key="senior-qa" value="Senior QA Engineer">Senior QA Engineer</Option>,
                    <Option key="qa-lead" value="QA Lead">QA Lead</Option>
                  ]}
                  {selectedDepartment === 'UI/UX Design' && [
                    <Option key="ui-designer" value="UI Designer">UI Designer</Option>,
                    <Option key="ux-designer" value="UX Designer">UX Designer</Option>,
                    <Option key="senior-designer" value="Senior UI/UX Designer">Senior UI/UX Designer</Option>
                  ]}
                  {selectedDepartment === 'Product Management' && [
                    <Option key="product-manager" value="Product Manager">Product Manager</Option>,
                    <Option key="senior-pm" value="Senior Product Manager">Senior Product Manager</Option>,
                    <Option key="product-lead" value="Product Lead">Product Lead</Option>
                  ]}
                  {selectedDepartment === 'Human Resources' && [
                    <Option key="hr-specialist" value="HR Specialist">HR Specialist</Option>,
                    <Option key="hr-manager" value="HR Manager">HR Manager</Option>,
                    <Option key="hr-director" value="HR Director">HR Director</Option>
                  ]}
                  {selectedDepartment === 'Marketing' && [
                    <Option key="marketing-specialist" value="Marketing Specialist">Marketing Specialist</Option>,
                    <Option key="marketing-manager" value="Marketing Manager">Marketing Manager</Option>,
                    <Option key="digital-marketer" value="Digital Marketing Specialist">Digital Marketing Specialist</Option>
                  ]}
                  {selectedDepartment === 'Sales' && [
                    <Option key="sales-rep" value="Sales Representative">Sales Representative</Option>,
                    <Option key="sales-manager" value="Sales Manager">Sales Manager</Option>,
                    <Option key="account-manager" value="Account Manager">Account Manager</Option>
                  ]}
                  {selectedDepartment === 'LLM' && [
                    <Option key="llm-engineer" value="LLM Engineer">LLM Engineer</Option>,
                    <Option key="senior-llm" value="Senior LLM Engineer">Senior LLM Engineer</Option>,
                    <Option key="llm-lead" value="LLM Team Lead">LLM Team Lead</Option>
                  ]}
                  {selectedDepartment === 'Business Analysis' && [
                    <Option key="business-analyst" value="Business Analyst">Business Analyst</Option>,
                    <Option key="senior-ba" value="Senior Business Analyst">Senior Business Analyst</Option>,
                    <Option key="ba-lead" value="Business Analysis Lead">Business Analysis Lead</Option>
                  ]}
                  {selectedDepartment === 'Data Analytics' && [
                    <Option key="data-analyst" value="Data Analyst">Data Analyst</Option>,
                    <Option key="senior-data-analyst" value="Senior Data Analyst">Senior Data Analyst</Option>,
                    <Option key="data-analytics-lead" value="Data Analytics Lead">Data Analytics Lead</Option>
                  ]}
                  {selectedDepartment === 'Data Engineering' && [
                    <Option key="data-engineer" value="Data Engineer">Data Engineer</Option>,
                    <Option key="senior-data-engineer" value="Senior Data Engineer">Senior Data Engineer</Option>,
                    <Option key="data-engineering-lead" value="Data Engineering Lead">Data Engineering Lead</Option>
                  ]}
                  {selectedDepartment === 'Finance' && [
                    <Option key="finance-analyst" value="Finance Analyst">Finance Analyst</Option>,
                    <Option key="finance-manager" value="Finance Manager">Finance Manager</Option>,
                    <Option key="finance-director" value="Finance Director">Finance Director</Option>
                  ]}
                  {selectedDepartment === 'Information Technology' && [
                    <Option key="it-specialist" value="IT Specialist">IT Specialist</Option>,
                    <Option key="it-manager" value="IT Manager">IT Manager</Option>,
                    <Option key="it-director" value="IT Director">IT Director</Option>
                  ]}
                  {selectedDepartment === 'Mobile Development' && [
                    <Option key="mobile-developer" value="Mobile Developer">Mobile Developer</Option>,
                    <Option key="senior-mobile" value="Senior Mobile Developer">Senior Mobile Developer</Option>,
                    <Option key="mobile-lead" value="Mobile Team Lead">Mobile Team Lead</Option>
                  ]}
                  {selectedDepartment === 'Software Development' && [
                    <Option key="software-developer" value="Software Developer">Software Developer</Option>,
                    <Option key="senior-software" value="Senior Software Developer">Senior Software Developer</Option>,
                    <Option key="software-lead" value="Software Team Lead">Software Team Lead</Option>
                  ]}
                  {selectedDepartment === 'Technical Support' && [
                    <Option key="support-specialist" value="Technical Support Specialist">Technical Support Specialist</Option>,
                    <Option key="support-manager" value="Technical Support Manager">Technical Support Manager</Option>,
                    <Option key="support-lead" value="Technical Support Lead">Technical Support Lead</Option>
                  ]}
                  {!selectedDepartment && [
                    <Option key="select-dept" value="" disabled>Please select a department first</Option>
                  ]}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item name="employment_type" label="Employment Type">
                <Select placeholder="Select employment type">
                  <Option value="permanent">Permanent</Option>
                  <Option value="contract">Contract</Option>
                  <Option value="temporary">Temporary</Option>
                  <Option value="internship">Internship</Option>
                  <Option value="freelance">Freelance</Option>
                  <Option value="consultant">Consultant</Option>
                  <Option value="probationary">Probationary</Option>
                  <Option value="seasonal">Seasonal</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="employee_id" label={<span>Employee ID <Tooltip title="Please contact HR department to obtain your official employee identification number. This is required for system access and payroll processing."><QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} /></Tooltip></span>} rules={[{ required: true, message: 'Please enter your employee ID' }]}>
                <Input placeholder="Enter your employee ID" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="manager" label={<span>Manager <Tooltip title="Please ask HR for your assigned manager's name."><QuestionCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} /></Tooltip></span>} rules={[{ required: true, message: 'Please enter your manager name' }]}>
                <AutoComplete
                  placeholder="Enter your reporting manager's name"
                  options={managerOptions}
                  onSearch={async (value) => {
                    if (value.length >= 3) {
                      setManagerLoading(true);
                      try {
                        const response = await fetch(`http://localhost:8000/api/employees/search?query=${encodeURIComponent(value)}`, {
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                          }
                        });
                        const data = await response.json();
                        if (data.employees && data.employees.length > 0) {
                          setManagerOptions(data.employees);
                        } else {
                          setManagerOptions([]);
                          message.error('No manager found with this name. Please contact HR.');
                        }
                      } catch (error) {
                        message.error('Error searching managers. Please try again.');
                        setManagerOptions([]);
                      }
                      setManagerLoading(false);
                    } else {
                      setManagerOptions([]);
                    }
                  }}
                  filterOption={false}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="employment_status" label="Employment Status" rules={[{ required: true, message: 'Please select employment status' }]}>
                <Select placeholder="Select status">
                  <Option value="full_time">Full Time</Option>
                  <Option value="part_time">Part Time</Option>
                  <Option value="contract">Contract</Option>
                  <Option value="casual">Casual</Option>
                  <Option value="on_call">On Call</Option>
                  <Option value="remote">Remote</Option>
                  <Option value="hybrid">Hybrid</Option>
                  <Option value="apprentice">Apprentice</Option>
                  <Option value="trainee">Trainee</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="work_schedule" label="Work Schedule" rules={[{ required: true, message: 'Please select work schedule' }]}>
                <Select placeholder="Select work schedule">
                  <Option value="Standard (9:00 AM - 6:00 PM)">Standard (9:00 AM - 6:00 PM)</Option>
                  <Option value="Flexible">Flexible</Option>
                  <Option value="Shift Work">Shift Work</Option>
                  <Option value="Morning Shift (6:00 AM - 2:00 PM)">Morning Shift (6:00 AM - 2:00 PM)</Option>
                  <Option value="Evening Shift (2:00 PM - 10:00 PM)">Evening Shift (2:00 PM - 10:00 PM)</Option>
                  <Option value="Night Shift (10:00 PM - 6:00 AM)">Night Shift (10:00 PM - 6:00 AM)</Option>
                  <Option value="Compressed (4 x 10 hours)">Compressed (4 x 10 hours)</Option>
                  <Option value="Part-time (4 hours)">Part-time (4 hours)</Option>
                  <Option value="Part-time (6 hours)">Part-time (6 hours)</Option>
                  <Option value="Rotational Shifts">Rotational Shifts</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="work_type" label="Work Type" rules={[{ required: true, message: 'Please select work type' }]}>
                <Select placeholder="Select work type">
                  <Option value="office">Office</Option>
                  <Option value="remote">Remote</Option>
                  <Option value="hybrid">Hybrid</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="work_location" label="Work Location" rules={[{ required: true, message: 'Please select work location' }]}>
                <Select placeholder="Select work location">
                  <Option value="Islamabad Office">Islamabad Office</Option>
                  <Option value="Peshawar Office">Peshawar Office</Option>
                  <Option value="Dubai Office">Dubai Office</Option>
                  <Option value="Lahore Office">Lahore Office</Option>
                  <Option value="Karachi Office">Karachi Office</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="qualification_level" label="Qualification Level" rules={[{ required: true, message: 'Please select your qualification level' }]}>
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
              <Form.Item name="degree_name" label="Degree/Field of Study" rules={[{ required: true, message: 'Please enter your degree or field of study' }]}>
                <Input placeholder="e.g., Computer Science, Business Administration" />
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
              <Form.Item name="emergency_contact_name" label="Contact Name" rules={[{ required: true, message: 'Please enter emergency contact name' }]}>
                <Input placeholder="Enter emergency contact's full name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="emergency_contact_relationship" label="Relationship" rules={[{ required: true, message: 'Please enter relationship' }]}>
                <Input placeholder="Enter relationship (e.g., Father, Mother, Spouse)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="emergency_contact_phone" label="Mobile Number" rules={[{ required: true, message: 'Please enter mobile number' }]}>
                <Input placeholder="Enter mobile number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="emergency_contact_work_phone" label="Work Phone">
                <Input placeholder="Enter work phone (optional)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
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
        <Card>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="university" label="University/College" rules={[{ required: true, message: 'Please enter your university name' }]}>
                <Input placeholder="Enter your university/college name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="graduation_year" label="Graduation Date" rules={[{ required: true, message: 'Please select your graduation date' }]}>
                <DatePicker picker="month" style={{ width: '100%' }} placeholder="Select graduation month and year" format="MMM YYYY" />
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
              <Form.Item name="technical_skills" label="Technical Skills" rules={[{ required: true, message: 'Please add at least one technical skill' }]}>
                <Select mode="tags" placeholder="Add your technical skills (type and press enter)" showSearch filterOption={(input, option) => String(option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
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
      hire_date: allValues.hire_date?.format('YYYY-MM-DD') || null,
      date_of_birth: allValues.date_of_birth?.format('YYYY-MM-DD') || null,
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