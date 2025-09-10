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
  Dropdown
} from 'antd';
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
import styled from 'styled-components';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

// Styled Components
const PageContainer = styled.div<{ isDarkMode: boolean }>`
  background: ${props => props.isDarkMode ? '#141414' : '#f0f2f5'};
  min-height: 100vh;
  padding: 24px;
  color: ${props => props.isDarkMode ? 'white' : 'inherit'};
`;

const CoverSection = styled.div<{ bgImage?: string; isDarkMode: boolean }>`
  height: 250px;
  background: ${props => props.bgImage 
    ? `url(${props.bgImage}) center/cover` 
    : props.isDarkMode 
      ? 'linear-gradient(135deg, #434343 0%, #000000 100%)' 
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  position: relative;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 24px;
`;

const CoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 8px 8px 0 0;
  
  &:hover {
    opacity: 1;
  }
`;

const ProfileContent = styled.div`
  padding: 0 24px;
  margin-top: -80px;
  position: relative;
  z-index: 1;
`;

const ProfileCard = styled(Card)<{ isDarkMode: boolean }>`
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  
  .ant-card-body {
    background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
    color: ${props => props.isDarkMode ? 'white' : 'inherit'};
  }
`;

const UserInfoContainer = styled(Flex)`
  margin-top: 16px;
`;

const UserInfo = styled.div`
  flex: 1;
  margin-left: 24px;
`;

const UserName = styled(Title)<{ isDarkMode: boolean }>`
  margin-bottom: 0 !important;
  font-weight: 600 !important;
  color: ${props => props.isDarkMode ? 'white' : '#262626'} !important;
  font-size: 28px !important;
`;

const UserDetailsVertical = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const UserDetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 14px;
`;

const StyledTabs = styled(Tabs)<{ isDarkMode: boolean }>`
  margin-top: 24px;
  
  .ant-tabs-nav {
    margin-bottom: 0;
    background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  }
  
  .ant-tabs-tab {
    padding: 12px 16px;
    font-size: 16px;
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'inherit'};
  }
  
  .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #1890ff !important;
    font-weight: 500;
  }
  
  .ant-tabs-ink-bar {
    background: #1890ff;
  }
`;

const StyledCard = styled(Card)<{ isDarkMode: boolean }>`
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  margin-bottom: 24px;
  transition: box-shadow 0.3s;
  background: ${props => props.isDarkMode ? '#1f1f1f' : 'white'};
  border: ${props => props.isDarkMode ? '1px solid #434343' : 'none'};
  
  .ant-card-head {
    border-bottom: 1px solid ${props => props.isDarkMode ? '#434343' : '#f0f0f0'};
    color: ${props => props.isDarkMode ? 'white' : 'inherit'};
  }
  
  .ant-card-body {
    color: ${props => props.isDarkMode ? 'white' : 'inherit'};
  }
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const AvatarEditOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: #1890ff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid white;
`;

const AvatarImage = styled(Avatar)`
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const FormItem = styled(Form.Item)<{ isDarkMode: boolean }>`
  .ant-form-item-label > label {
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'inherit'};
  }
`;

const SideInfoItem = styled.div<{ isDarkMode: boolean }>`
  margin-bottom: 16px;
  padding: 8px 0;
  
  .label {
    display: flex;
    align-items: center;
    font-weight: 500;
    color: ${props => props.isDarkMode ? 'rgba(255, 255, 255, 0.65)' : '#666'};
    margin-bottom: 4px;
  }
  
  .value {
    color: ${props => props.isDarkMode ? 'white' : '#262626'};
    font-size: 16px;
  }
  
  a {
    color: ${props => props.isDarkMode ? '#1890ff' : '#1890ff'};
  }
`;

const EmergencyContactCard = styled(StyledCard)`
  .ant-card-head-title {
    font-weight: 600;
    font-size: 16px;
  }
  
  .ant-card-extra {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ContactInfoContainer = styled.div<{ isDarkMode: boolean }>`
  padding: 16px;
  border-radius: 8px;
  background: ${props => props.isDarkMode ? '#2a2a2a' : '#fafafa'};
  margin-bottom: 16px;
  position: relative;
  border: ${props => props.isDarkMode ? '1px solid #434343' : 'none'};
`;

const ContactDetails = styled.div`
  margin-top: 8px;
  
  br {
    margin-bottom: 8px;
    display: block;
    content: '';
  }
`;

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [employeeData, setEmployeeData] = useState(initialEmployeeData);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [form] = Form.useForm();
  const [emergencyForm] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're editing an existing contact
  React.useEffect(() => {
    if (location.state && location.state.editingContact) {
      setEditingContact(location.state.editingContact);
      setIsEditingContact(true);
      setActiveTab('emergency');
    }
  }, [location.state]);

  const handleCoverUpload = (info: any) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result as string);
      };
      reader.readAsDataURL(info.file.originFileObj);
      message.success('Cover image uploaded successfully');
    }
  };

  const handleAvatarUpload = (info: any) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImage(e.target?.result as string);
      };
      reader.readAsDataURL(info.file.originFileObj);
      message.success('Profile picture updated successfully');
    }
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      // Update the employee data with form values
      setEmployeeData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...values }
      }));
      message.success('Profile updated successfully');
      navigate('/profile');
    }).catch(errorInfo => {
      console.log('Validation failed:', errorInfo);
    });
  };

  const handleAddEmergencyContact = (values: any) => {
    const newContact = {
      id: editingContact ? editingContact.id : Date.now(),
      ...values
    };
    
    if (editingContact) {
      // Update existing contact
      setEmployeeData(prev => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.map(contact => 
          contact.id === editingContact.id ? newContact : contact
        )
      }));
      message.success('Emergency contact updated successfully');
    } else {
      // Add new contact
      setEmployeeData(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, newContact]
      }));
      message.success('Emergency contact added successfully');
    }
    
    setIsEditingContact(false);
    setEditingContact(null);
    emergencyForm.resetFields();
  };

  const handleDeleteContact = (contactId: number) => {
    setEmployeeData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(contact => contact.id !== contactId)
    }));
    message.success('Emergency contact deleted successfully');
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
      }
      return isImage;
    },
    showUploadList: false,
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
    <PageContainer isDarkMode={isDarkMode}>
      <StyledCard bodyStyle={{ padding: 0 }} isDarkMode={isDarkMode}>
        <CoverSection bgImage={coverImage || employeeData.personalInfo.coverImage || undefined} isDarkMode={isDarkMode}>
          <CoverOverlay>
            <Upload {...uploadProps} onChange={handleCoverUpload}>
              <Button type="primary" icon={<Camera size={16} />}>
                Change Cover
              </Button>
            </Upload>
          </CoverOverlay>
        </CoverSection>

        <ProfileCard isDarkMode={isDarkMode}>
          <ProfileContent>
            <UserInfoContainer align="flex-end">
              <AvatarContainer>
                <AvatarImage
                  size={140}
                  src={avatarImage || employeeData.personalInfo.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d65463f?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                />
                <Upload {...uploadProps} onChange={handleAvatarUpload}>
                  <AvatarEditOverlay>
                    <Camera size={16} color="white" />
                  </AvatarEditOverlay>
                </Upload>
              </AvatarContainer>
              
              <UserInfo>
                <Form form={form} initialValues={employeeData.personalInfo}>
                  <Form.Item name="name">
                    <Input 
                      style={{ fontSize: '28px', fontWeight: 600, color: isDarkMode ? 'white' : '#262626', border: 'none', background: 'transparent', padding: 0 }} 
                      bordered={false}
                    />
                  </Form.Item>
                </Form>
                <UserDetailsVertical>
                  <UserDetailItem>
                    <Briefcase size={18} color="#1890ff" />
                    <Form form={form} initialValues={employeeData.personalInfo}>
                      <Form.Item name="position" style={{ margin: 0 }}>
                        <Input 
                          style={{ color: '#555', border: 'none', background: 'transparent', padding: 0 }} 
                          bordered={false}
                        />
                      </Form.Item>
                    </Form>
                  </UserDetailItem>
                  <UserDetailItem>
                    <MapPin size={18} color="#ff4d4f" />
                    <Form form={form} initialValues={employeeData.personalInfo}>
                      <Form.Item name="location" style={{ margin: 0 }}>
                        <Input 
                          style={{ color: '#555', border: 'none', background: 'transparent', padding: 0 }} 
                          bordered={false}
                        />
                      </Form.Item>
                    </Form>
                  </UserDetailItem>
                </UserDetailsVertical>
              </UserInfo>
              
              <Flex gap="small">
                <Button 
                  type="default" 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </Button>
                <Button 
                  type="default" 
                  icon={<ArrowLeft size={16} />}
                  onClick={() => navigate('/profile')}
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
            </UserInfoContainer>

            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col xs={24} md={8}>
                <StyledCard title="Employee Details" isDarkMode={isDarkMode}>
                  <Form form={form} layout="vertical" initialValues={employeeData.personalInfo}>
                    <FormItem name="email" label="Email" isDarkMode={isDarkMode}>
                      <Input prefix={<Mail />} />
                    </FormItem>
                    
                    <FormItem name="phone" label="Phone" isDarkMode={isDarkMode}>
                      <Input prefix={<Phone />} />
                    </FormItem>
                    
                    <FormItem name="hireDate" label="Hired on" isDarkMode={isDarkMode}>
                      <Input prefix={<Calendar />} />
                    </FormItem>
                    
                    <FormItem name="employmentType" label="Employment type" isDarkMode={isDarkMode}>
                      <Input prefix={<Clock />} />
                    </FormItem>
                    
                    <FormItem name="employeeId" label="Employee ID" isDarkMode={isDarkMode}>
                      <Input prefix={<Users />} />
                    </FormItem>
                    
                    <FormItem name="manager" label="Manager" isDarkMode={isDarkMode}>
                      <Input prefix={<User />} />
                    </FormItem>
                  </Form>
                </StyledCard>
              </Col>

              <Col xs={24} md={16}>
                <StyledTabs activeKey={activeTab} onChange={setActiveTab} isDarkMode={isDarkMode}>
                  <TabPane 
                    tab={
                      <span>
                        <User size={16} style={{ marginRight: 8, color: '#1890ff' }} />
                        Personal
                      </span>
                    } 
                    key="personal"
                  >
                    <StyledCard title="Personal Information" isDarkMode={isDarkMode}>
                      <Form form={form} layout="vertical" initialValues={employeeData.personalInfo}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <FormItem name="name" label="Full Name" isDarkMode={isDarkMode}>
                              <Input prefix={<User />} />
                            </FormItem>
                            <FormItem name="email" label="Email" isDarkMode={isDarkMode}>
                              <Input prefix={<Mail />} />
                            </FormItem>
                            <FormItem name="phone" label="Phone" isDarkMode={isDarkMode}>
                              <Input prefix={<Phone />} />
                            </FormItem>
                          </Col>
                          <Col span={12}>
                            <FormItem name="location" label="Location" isDarkMode={isDarkMode}>
                              <Input prefix={<MapPin />} />
                            </FormItem>
                            <FormItem name="employeeId" label="Employee ID" isDarkMode={isDarkMode}>
                              <Input prefix={<Users />} />
                            </FormItem>
                            <FormItem name="department" label="Department" isDarkMode={isDarkMode}>
                              <Input prefix={<Briefcase />} />
                            </FormItem>
                          </Col>
                        </Row>
                      </Form>
                    </StyledCard>
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
                    <EmergencyContactCard
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
                          <Form.Item name="relationship" label="Relationship" rules={[{ required: true }]}>
                            <Input />
                          </Form.Item>
                          <Form.Item name="mobile" label="Mobile Number" rules={[{ required: true }]}>
                            <Input />
                          </Form.Item>
                          <Form.Item name="workPhone" label="Work Phone">
                            <Input />
                          </Form.Item>
                          <Form.Item name="homePhone" label="Home Phone">
                            <Input />
                          </Form.Item>
                          <Form.Item name="address" label="Address" rules={[{ required: true }]}>
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
                          {employeeData.emergencyContacts.map((contact) => (
                            <ContactInfoContainer key={contact.id} isDarkMode={isDarkMode}>
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
                              <ContactDetails>
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
                              </ContactDetails>
                            </ContactInfoContainer>
                          ))}
                          {employeeData.emergencyContacts.length === 0 && (
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
                    </EmergencyContactCard>
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
                    <StyledCard title="Job Information" isDarkMode={isDarkMode}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <FormItem name={['jobInfo', 'title']} label="Title" isDarkMode={isDarkMode}>
                            <Input prefix={<Briefcase />} />
                          </FormItem>
                          <FormItem name={['jobInfo', 'department']} label="Department" isDarkMode={isDarkMode}>
                            <Input prefix={<Users />} />
                          </FormItem>
                          <FormItem name={['jobInfo', 'reportsTo']} label="Reports To" isDarkMode={isDarkMode}>
                            <Input prefix={<User />} />
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem name={['jobInfo', 'teamSize']} label="Team Size" isDarkMode={isDarkMode}>
                            <Input prefix={<Users />} />
                          </FormItem>
                          <FormItem name={['jobInfo', 'workSchedule']} label="Work Schedule" isDarkMode={isDarkMode}>
                            <Input prefix={<Clock />} />
                          </FormItem>
                          <FormItem name={['jobInfo', 'location']} label="Location" isDarkMode={isDarkMode}>
                            <Input prefix={<MapPin />} />
                          </FormItem>
                        </Col>
                      </Row>
                    </StyledCard>
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
                    <StyledCard title="Compensation Details" isDarkMode={isDarkMode}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <FormItem name={['compensation', 'salary']} label="Base Salary" isDarkMode={isDarkMode}>
                            <Input prefix={<DollarSign />} />
                          </FormItem>
                          <FormItem name={['compensation', 'bonus']} label="Bonus Target" isDarkMode={isDarkMode}>
                            <Input />
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem name={['compensation', 'stockOptions']} label="Stock Options" isDarkMode={isDarkMode}>
                            <Input />
                          </FormItem>
                          <FormItem name={['compensation', 'nextReview']} label="Next Review" isDarkMode={isDarkMode}>
                            <Input prefix={<Calendar />} />
                          </FormItem>
                        </Col>
                      </Row>
                    </StyledCard>
                  </TabPane>
                  
                  <TabPane 
                    tab={
                      <span>
                        <Award size={16} style={{ marginRight: 8, color: '#722ed1' }} />
                        Skills
                      </span>
                    } 
                    key="skills"
                  >
                    <StyledCard title="Skills & Competencies" isDarkMode={isDarkMode}>
                      {employeeData.skills.map((skill, index) => (
                        <SideInfoItem key={index} isDarkMode={isDarkMode}>
                          <div className="label">{skill.name}</div>
                          <Progress percent={skill.level} showInfo={true} />
                        </SideInfoItem>
                      ))}
                    </StyledCard>
                  </TabPane>
                </StyledTabs>
              </Col>
            </Row>
          </ProfileContent>
        </ProfileCard>
      </StyledCard>
    </PageContainer>
  );
};

export default EditProfile;