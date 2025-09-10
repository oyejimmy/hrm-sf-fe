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
import { useTheme } from '../../contexts/ThemeContext';
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

  const getProfilePath = () => {
    const currentPath = location.pathname;
    return currentPath.replace('/edit', '');
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
      navigate(getProfilePath());
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
    <S.PageContainer isDarkMode={isDarkMode}>
      <S.StyledCard bodyStyle={{ padding: 0 }} isDarkMode={isDarkMode}>
        <S.CoverSection bgImage={coverImage || employeeData.personalInfo.coverImage || undefined} isDarkMode={isDarkMode}>
          <S.CoverOverlay>
            <Upload {...uploadProps} onChange={handleCoverUpload}>
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
                  src={avatarImage || employeeData.personalInfo.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d65463f?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                />
                <Upload {...uploadProps} onChange={handleAvatarUpload}>
                  <S.AvatarEditOverlay>
                    <Camera size={16} color="white" />
                  </S.AvatarEditOverlay>
                </Upload>
              </S.AvatarContainer>

              <S.UserInfo>
                <Form form={form} initialValues={employeeData.personalInfo}>
                  <Form.Item name="name">
                    <Input
                      style={{ fontSize: '28px', fontWeight: 600, color: isDarkMode ? 'white' : '#262626', border: 'none', background: 'transparent', padding: 0 }}
                      bordered={false}
                    />
                  </Form.Item>
                </Form>
                <S.UserDetailsVertical>
                  <S.UserDetailItem>
                    <Briefcase size={18} color="#1890ff" />
                    <Form form={form} initialValues={employeeData.personalInfo}>
                      <Form.Item name="position" style={{ margin: 0 }}>
                        <Input
                          style={{ color: '#555', border: 'none', background: 'transparent', padding: 0 }}
                          bordered={false}
                        />
                      </Form.Item>
                    </Form>
                  </S.UserDetailItem>
                  <S.UserDetailItem>
                    <MapPin size={18} color="#ff4d4f" />
                    <Form form={form} initialValues={employeeData.personalInfo}>
                      <Form.Item name="location" style={{ margin: 0 }}>
                        <Input
                          style={{ color: '#555', border: 'none', background: 'transparent', padding: 0 }}
                          bordered={false}
                        />
                      </Form.Item>
                    </Form>
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
                  <Form form={form} layout="vertical" initialValues={employeeData.personalInfo}>
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
                  </Form>
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
                      <Form form={form} layout="vertical" initialValues={employeeData.personalInfo}>
                        <Row gutter={16}>
                          <Col span={12}>
                            <S.FormItem name="name" label="Full Name" isDarkMode={isDarkMode}>
                              <Input prefix={<User />} />
                            </S.FormItem>
                            <S.FormItem name="email" label="Email" isDarkMode={isDarkMode}>
                              <Input prefix={<Mail />} />
                            </S.FormItem>
                            <S.FormItem name="phone" label="Phone" isDarkMode={isDarkMode}>
                              <Input prefix={<Phone />} />
                            </S.FormItem>
                          </Col>
                          <Col span={12}>
                            <S.FormItem name="location" label="Location" isDarkMode={isDarkMode}>
                              <Input prefix={<MapPin />} />
                            </S.FormItem>
                            <S.FormItem name="employeeId" label="Employee ID" isDarkMode={isDarkMode}>
                              <Input prefix={<Users />} />
                            </S.FormItem>
                            <S.FormItem name="department" label="Department" isDarkMode={isDarkMode}>
                              <Input prefix={<Briefcase />} />
                            </S.FormItem>
                          </Col>
                        </Row>
                      </Form>
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
                          {employeeData.emergencyContacts.map((contact) => (
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
                          <S.FormItem name={['jobInfo', 'title']} label="Title" isDarkMode={isDarkMode}>
                            <Input prefix={<Briefcase />} />
                          </S.FormItem>
                          <S.FormItem name={['jobInfo', 'department']} label="Department" isDarkMode={isDarkMode}>
                            <Input prefix={<Users />} />
                          </S.FormItem>
                          <S.FormItem name={['jobInfo', 'reportsTo']} label="Reports To" isDarkMode={isDarkMode}>
                            <Input prefix={<User />} />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name={['jobInfo', 'teamSize']} label="Team Size" isDarkMode={isDarkMode}>
                            <Input prefix={<Users />} />
                          </S.FormItem>
                          <S.FormItem name={['jobInfo', 'workSchedule']} label="Work Schedule" isDarkMode={isDarkMode}>
                            <Input prefix={<Clock />} />
                          </S.FormItem>
                          <S.FormItem name={['jobInfo', 'location']} label="Location" isDarkMode={isDarkMode}>
                            <Input prefix={<MapPin />} />
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
                          <S.FormItem name={['compensation', 'salary']} label="Base Salary" isDarkMode={isDarkMode}>
                            <Input prefix={<DollarSign />} />
                          </S.FormItem>
                          <S.FormItem name={['compensation', 'bonus']} label="Bonus Target" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                        </Col>
                        <Col span={12}>
                          <S.FormItem name={['compensation', 'stockOptions']} label="Stock Options" isDarkMode={isDarkMode}>
                            <Input />
                          </S.FormItem>
                          <S.FormItem name={['compensation', 'nextReview']} label="Next Review" isDarkMode={isDarkMode}>
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
                        Skills
                      </span>
                    }
                    key="skills"
                  >
                    <S.StyledCard title="Skills & Competencies" isDarkMode={isDarkMode}>
                      {employeeData.skills.map((skill, index) => (
                        <S.SideInfoItem key={index} isDarkMode={isDarkMode}>
                          <div className="label">{skill.name}</div>
                          <Progress percent={skill.level} showInfo={true} />
                        </S.SideInfoItem>
                      ))}
                    </S.StyledCard>
                  </TabPane>
                </S.StyledTabs>
              </Col>
            </Row>
          </S.ProfileContent>
        </S.ProfileCard>
      </S.StyledCard>
    </S.PageContainer>
  );
};

export default EditProfile;