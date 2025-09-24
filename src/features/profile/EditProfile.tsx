import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tabs,
  Avatar,
  Button,
  Upload,
  message,
  Flex,
  Form,
  Input,
  Select,
  DatePicker,
  Modal,
  Progress,
  List,
  Menu,
  Dropdown,
  Spin
} from 'antd';
import dayjs from 'dayjs';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  FileText,
  Plus,
  Edit,
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
import { useTheme } from '../../contexts/ThemeContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api/api';
import * as S from './styles';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// Mock data for HRM employee profile
const initialEmployeeData = {
  personalInfo: {
    name: "Simona Clapan",
    position: "COO",
    department: "Executive",
    location: "Kyiv, Ukraine",
    email: "simona.clapan@company.com",
    phone: "+380950830332",
    hireDate: "Mar 05, 2021",
    employmentType: "Full Time",
    employeeId: "EMP-0234",
    manager: "Michael Johnson (CEO)",
    coverImage: "",
    avatar: ""
  },
  emergencyContacts: [
    {
      id: 1,
      name: "Yulia Kitsmans",
      relationship: "Sister",
      mobile: "+380 95 083 03 22",
      workPhone: "+322 095 083 03 21",
      homePhone: "71-22-22",
      address: "Ukraine, Kyiv, Velyka Vasilikvska str. 30, 3d floor, ap. 4"
    }
  ],
  jobInfo: {
    title: "Chief Operating Officer",
    department: "Executive",
    reportsTo: "CEO",
    teamSize: 45,
    startDate: "Mar 05, 2021",
    employmentType: "Full Time",
    workSchedule: "Standard (9:00 AM - 6:00 PM)",
    location: "Kyiv Office"
  },
  compensation: {
    salary: "$12,500 monthly",
    bonus: "15% annual target",
    stockOptions: "10,000 shares",
    lastIncrease: "Jun 15, 2023 (5%)",
    nextReview: "Jun 15, 2024"
  },
  skills: [
    { name: "Strategic Planning", level: 95 },
    { name: "Operations Management", level: 90 },
    { name: "Team Leadership", level: 92 },
    { name: "Budget Management", level: 88 },
    { name: "Process Improvement", level: 85 }
  ],
  documents: [
    { name: "Employment Contract", date: "Mar 01, 2021", type: "Contract" },
    { name: "NDA Agreement", date: "Mar 02, 2021", type: "Legal" },
    { name: "Performance Review 2023", date: "Dec 15, 2023", type: "Review" },
    { name: "Compensation Plan", date: "Jun 15, 2023", type: "Compensation" }
  ]
};

const EditProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const { isDarkMode } = useTheme();
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [form] = Form.useForm();
  const [emergencyForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Fetch current profile data
  const { data: employeeData, isLoading } = useQuery({
    queryKey: ['employee-profile'],
    queryFn: () => api.get('/api/employees/me/profile').then(res => res.data),
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
  
  // Check if we're editing an existing contact
  React.useEffect(() => {
    if (location.state && location.state.editingContact) {
      setEditingContact(location.state.editingContact);
      setIsEditingContact(true);
      setActiveTab('emergency');
    }
  }, [location.state]);
  
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

  const handleAvatarUpload = (info: any) => {
    const file = info.file.originFileObj || info.file;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setAvatarImage(base64);
      // Immediately save to database
      updateProfileMutation.mutate({ avatar_url: base64 });
    };
    reader.readAsDataURL(file);
    message.success('Profile picture updated successfully');
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
      addField('languages_known', allFormData.languagesKnown);
      addField('hobbies', allFormData.hobbies);
      addField('address', allFormData.address);
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

  const handleAddEmergencyContact = (values: any) => {
    // Update emergency contact fields in profile
    const updateData = {
      emergency_contact_name: values.name,
      emergency_contact_phone: values.mobile,
      emergency_contact_relationship: values.relationship,
      emergency_contact_work_phone: values.workPhone,
      emergency_contact_home_phone: values.homePhone,
      emergency_contact_address: values.address
    };
    
    updateProfileMutation.mutate(updateData);
    setIsEditingContact(false);
    setEditingContact(null);
    emergencyForm.resetFields();
  };

  const handleDeleteContact = (contactId: number) => {
    const updateData = {
      emergency_contact_name: null,
      emergency_contact_phone: null,
      emergency_contact_relationship: null,
      emergency_contact_work_phone: null,
      emergency_contact_home_phone: null,
      emergency_contact_address: null
    };
    
    updateProfileMutation.mutate(updateData);
  };

  const handleEditContact = (contact: any) => {
    setEditingContact(contact);
    setIsEditingContact(true);
    emergencyForm.setFieldsValue(contact);
  };

  const handleCancelEditContact = () => {
    setIsEditingContact(false);
    setEditingContact(null);
    emergencyForm.resetFields();
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

  const dropdownMenu = (contact: any) => (
    <Menu>
      <Menu.Item key="edit" icon={<Edit size={16} />} onClick={() => handleEditContact(contact)}>
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        icon={<Trash2 size={16} />}
        danger
        onClick={() => handleDeleteContact(contact.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <S.PageContainer isDarkMode={isDarkMode}>
      <Form form={form} layout="vertical" initialValues={{
        ...employeeData?.personalInfo,
        ...employeeData?.jobInfo,
        ...employeeData?.compensation,
        dateOfBirth: employeeData?.personalInfo?.dateOfBirth ? dayjs(employeeData.personalInfo.dateOfBirth) : null
      }}>
        <S.StyledCard bodyStyle={{ padding: 0 }} isDarkMode={isDarkMode}>
        <S.CoverSection bgImage={coverImage || employeeData?.personalInfo?.coverImage || employeeData?.personalInfo?.cover_image_url || undefined} isDarkMode={isDarkMode}>
          <S.CoverOverlay>
            <Upload {...uploadProps} onChange={handleCoverUpload} accept="image/*">
              <Button type="primary" icon={<Camera size={16} />}>
                Change Cover
              </Button>
            </Upload>
          </S.CoverOverlay>
        </S.CoverSection>

        <S.ProfileCard isDarkMode={isDarkMode}>
          <S.ProfileContent>
            <S.UserInfoContainer align="flex-end">
              <S.AvatarContainer>
                <S.AvatarImage
                  size={140}
                  src={avatarImage || employeeData?.personalInfo?.avatar || employeeData?.personalInfo?.avatar_url || "https://images.unsplash.com/photo-1580489944761-15a19d65463f?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                />
                <Upload {...uploadProps} onChange={handleAvatarUpload} accept="image/*">
                  <S.AvatarEditOverlay>
                    <Camera size={16} color="white" />
                  </S.AvatarEditOverlay>
                </Upload>
              </S.AvatarContainer>

              <S.UserInfo>
                <Form.Item name="name">
                  <Input
                    style={{ fontSize: '28px', fontWeight: 600, color: isDarkMode ? 'white' : '#262626', border: 'none', background: 'transparent', padding: 0 }}
                    bordered={false}
                  />
                </Form.Item>
                <S.UserDetailsVertical>
                  <S.UserDetailItem>
                    <Briefcase size={18} color="#1890ff" />
                    <Form.Item name="position" style={{ margin: 0 }}>
                      <Input
                        style={{ color: '#555', border: 'none', background: 'transparent', padding: 0 }}
                        bordered={false}
                      />
                    </Form.Item>
                  </S.UserDetailItem>
                  <S.UserDetailItem>
                    <MapPin size={18} color="#ff4d4f" />
                    <Form.Item name="location" style={{ margin: 0 }}>
                      <Input
                        style={{ color: '#555', border: 'none', background: 'transparent', padding: 0 }}
                        bordered={false}
                      />
                    </Form.Item>
                  </S.UserDetailItem>
                </S.UserDetailsVertical>
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
                  <S.FormItem name="email" label="Email" isDarkMode={isDarkMode}>
                    <Input prefix={<Mail />} />
                  </S.FormItem>

                  <S.FormItem name="phone" label="Phone" isDarkMode={isDarkMode}>
                    <Input prefix={<Phone />} />
                  </S.FormItem>

                  <S.FormItem name="hireDate" label="Hired on" isDarkMode={isDarkMode}>
                    <Input prefix={<Calendar />} />
                  </S.FormItem>

                  <S.FormItem name="employmentType" label="Employment type" isDarkMode={isDarkMode}>
                    <Input prefix={<Clock />} />
                  </S.FormItem>

                  <S.FormItem name="employeeId" label="Employee ID" isDarkMode={isDarkMode}>
                    <Input prefix={<Users />} />
                  </S.FormItem>

                  <S.FormItem name="manager" label="Manager" isDarkMode={isDarkMode}>
                    <Input prefix={<User />} />
                  </S.FormItem>
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
                          <S.FormItem name="gender" label="Gender" isDarkMode={isDarkMode}>
                            <Select>
                              <Option value="male">Male</Option>
                              <Option value="female">Female</Option>
                              <Option value="other">Other</Option>
                            </Select>
                          </S.FormItem>
                          <S.FormItem name="dateOfBirth" label="Date of Birth" isDarkMode={isDarkMode}>
                            <DatePicker 
                              style={{ width: '100%' }} 
                              format="YYYY-MM-DD"
                              placeholder="Select date of birth"
                            />
                          </S.FormItem>
                          <S.FormItem name="maritalStatus" label="Marital Status" isDarkMode={isDarkMode}>
                            <Select>
                              <Option value="single">Single</Option>
                              <Option value="married">Married</Option>
                              <Option value="divorced">Divorced</Option>
                              <Option value="widowed">Widowed</Option>
                            </Select>
                          </S.FormItem>
                          <S.FormItem name="bloodGroup" label="Blood Group" isDarkMode={isDarkMode}>
                            <Select>
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
                          <S.FormItem name="religion" label="Religion" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name="languagesKnown" label="Languages Known" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name="hobbies" label="Hobbies" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name="address" label="Address" isDarkMode={isDarkMode}>
                            <TextArea rows={2} />
                          </S.FormItem>
                          <S.FormItem name="personalEmail" label="Personal Email" isDarkMode={isDarkMode}>
                            <Input prefix={<Mail />} />
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
                    <S.EmergencyContactCard
                      title="Emergency Contacts"
                      isDarkMode={isDarkMode}
                      extra={
                        !isEditingContact && (
                          <Button
                            type="primary"
                            icon={<Plus size={16} />}
                            onClick={() => setIsEditingContact(true)}
                          >
                            Add Contact
                          </Button>
                        )
                      }
                    >
                      {isEditingContact ? (
                        <Form
                          form={emergencyForm}
                          layout="vertical"
                          onFinish={handleAddEmergencyContact}
                          initialValues={editingContact || {}}
                        >
                          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                            <Input />
                          </Form.Item>
                          <Form.Item name="relationship" label="Relationship" >
                            <Input />
                          </Form.Item>
                          <Form.Item name="mobile" label="Mobile Number" >
                            <Input />
                          </Form.Item>
                          <Form.Item name="workPhone" label="Work Phone">
                            <Input />
                          </Form.Item>
                          <Form.Item name="homePhone" label="Home Phone">
                            <Input />
                          </Form.Item>
                          <Form.Item name="address" label="Address" >
                            <TextArea rows={3} />
                          </Form.Item>
                          <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                              {editingContact ? 'Update' : 'Add'} Contact
                            </Button>
                            <Button onClick={handleCancelEditContact}>
                              Cancel
                            </Button>
                          </Form.Item>
                        </Form>
                      ) : (
                        <>
                          {(employeeData?.emergencyContacts || []).map((contact: any) => (
                            <S.ContactInfoContainer key={contact.id} isDarkMode={isDarkMode}>
                              <Row align="middle">
                                <Col flex="auto">
                                  <Title level={4} style={{ marginBottom: 0 }}>{contact.name}</Title>
                                </Col>
                                <Col>
                                  <Dropdown overlay={dropdownMenu(contact)} trigger={['click']}>
                                    <Button type="text" icon={<MoreVertical />} />
                                  </Dropdown>
                                </Col>
                              </Row>
                              <S.ContactDetails>
                                <Text strong>Relationship:</Text> {contact.relationship} <br />
                                <Text strong>Mobile Number:</Text> {contact.mobile} <br />
                                {contact.workPhone && (
                                  <>
                                    <Text strong>Work Phone:</Text> {contact.workPhone} <br />
                                  </>
                                )}
                                {contact.homePhone && (
                                  <>
                                    <Text strong>Home Phone:</Text> {contact.homePhone} <br />
                                  </>
                                )}
                                <Text strong>Address:</Text> {contact.address}
                              </S.ContactDetails>
                            </S.ContactInfoContainer>
                          ))}
                          {(!employeeData?.emergencyContacts || employeeData.emergencyContacts.length === 0) && (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                              <Heart size={48} color="#d9d9d9" />
                              <p>No emergency contacts added yet</p>
                              <Button
                                type="primary"
                                icon={<Plus size={16} />}
                                onClick={() => setIsEditingContact(true)}
                              >
                                Add Contact
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </S.EmergencyContactCard>
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
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.FormItem name="employmentStatus" label="Employment Status" isDarkMode={isDarkMode}>
                            <Select>
                              <Option value="full_time">Full Time</Option>
                              <Option value="part_time">Part Time</Option>
                              <Option value="contract">Contract</Option>
                              <Option value="intern">Intern</Option>
                            </Select>
                          </S.FormItem>
                          <S.FormItem name="workLocation" label="Work Location" isDarkMode={isDarkMode}>
                            <Select>
                              <Option value="office">Office</Option>
                              <Option value="remote">Remote</Option>
                              <Option value="hybrid">Hybrid</Option>
                              <Option value="field">Field</Option>
                            </Select>
                          </S.FormItem>
                          <S.FormItem name="teamSize" label="Team Size" isDarkMode={isDarkMode}>
                            <Input type="number" />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name="workSchedule" label="Work Schedule" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name="qualification" label="Qualification" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name="educationLevel" label="Education Level" isDarkMode={isDarkMode}>
                            <Select>
                              <Option value="high_school">High School</Option>
                              <Option value="bachelor">Bachelor's Degree</Option>
                              <Option value="master">Master's Degree</Option>
                              <Option value="phd">PhD</Option>
                            </Select>
                          </S.FormItem>
                        </Col>
                      </Row>
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
                      <Row gutter={16}>
                        <Col span={12}>
                          <S.FormItem name="salary" label="Base Salary" isDarkMode={isDarkMode}>
                            <Input prefix={<DollarSign />} />
                          </S.FormItem>
                          <S.FormItem name="bonusTarget" label="Bonus Target" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name="stockOptions" label="Stock Options" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name="nextReview" label="Next Review" isDarkMode={isDarkMode}>
                            <Input prefix={<Calendar />} />
                          </S.FormItem>
                        </Col>
                      </Row>
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
                          <S.FormItem name="graduationYear" label="Graduation Year" isDarkMode={isDarkMode}>
                            <Input type="number" />
                          </S.FormItem>
                          <S.FormItem name="certifications" label="Certifications" isDarkMode={isDarkMode}>
                            <TextArea rows={2} />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name="skillsSummary" label="Skills Summary" isDarkMode={isDarkMode}>
                            <TextArea rows={4} />
                          </S.FormItem>
                        </Col>
                      </Row>
                      <div style={{ marginTop: 16 }}>
                        <Text strong>Technical Skills:</Text>
                        {(employeeData?.skills || []).map((skill: any, index: number) => (
                          <S.SideInfoItem key={index} isDarkMode={isDarkMode}>
                            <div className="label">{skill.name}</div>
                            <Progress percent={skill.level} showInfo={true} />
                          </S.SideInfoItem>
                        ))}
                      </div>
                    </S.StyledCard>
                  </TabPane>
                </S.StyledTabs>
              </Col>
            </Row>
          </S.ProfileContent>
        </S.ProfileCard>
        </S.StyledCard>
      </Form>
    </S.PageContainer>
  );
};

export default EditProfile;