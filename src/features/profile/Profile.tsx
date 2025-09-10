import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tabs,
  Avatar,
  Button,
  Flex,
  List,
  Progress,
  Dropdown,
  Menu,
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
  Heart,
  MoreVertical,
  DollarSign,
  Award,
  Users,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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
`;

const ProfileContent = styled.div`
  padding: 0 24px;
  margin-top: -80px;
  position: relative;
  z-index: 1;
`;

const ProfileCard = styled(Card) <{ isDarkMode: boolean }>`
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

const UserName = styled(Title) <{ isDarkMode: boolean }>`
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

const StyledTabs = styled(Tabs) <{ isDarkMode: boolean }>`
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

const StyledCard = styled(Card) <{ isDarkMode: boolean }>`
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

const AvatarContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const AvatarImage = styled(Avatar)`
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

// Mock data for HRM employee profile
const employeeData: any = {
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
    manager: "Michael Johnson (CEO)"
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

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState(employeeData.emergencyContacts);
  const navigate = useNavigate();

  const handleDeleteContact = (contactId: number) => {
    setEmergencyContacts(emergencyContacts.filter((contact: any) => contact.id !== contactId));
  };

  return (
    <PageContainer isDarkMode={isDarkMode}>
      <StyledCard bodyStyle={{ padding: 0 }} isDarkMode={isDarkMode}>
        <CoverSection bgImage={employeeData.personalInfo.coverImage} isDarkMode={isDarkMode} />

        <ProfileCard isDarkMode={isDarkMode}>
          <ProfileContent>
            <UserInfoContainer align="flex-end">
              <AvatarContainer>
                <AvatarImage
                  size={140}
                  src={employeeData.personalInfo.avatar || "https://images.unsplash.com/photo-1580489944761-15a19d65463f?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                />
              </AvatarContainer>

              <UserInfo>
                <UserName level={2} isDarkMode={isDarkMode}>
                  {employeeData.personalInfo.name}
                </UserName>
                <UserDetailsVertical>
                  <UserDetailItem>
                    <Briefcase size={18} color="#1890ff" />
                    <Text>{employeeData.personalInfo.position}</Text>
                  </UserDetailItem>
                  <UserDetailItem>
                    <MapPin size={18} color="#ff4d4f" />
                    <Text>{employeeData.personalInfo.location}</Text>
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
                  type="primary"
                  icon={<Edit size={16} />}
                  onClick={() => navigate('/profile/edit')}
                >
                  Edit Profile
                </Button>
              </Flex>
            </UserInfoContainer>

            <Row gutter={24} style={{ marginTop: 24 }}>
              <Col xs={24} md={8}>
                <StyledCard title="Employee Details" isDarkMode={isDarkMode}>
                  <SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Mail size={16} style={{ marginRight: 8, color: '#52c41a' }} />
                      Email
                    </div>
                    <a href={`mailto:${employeeData.personalInfo.email}`} className="value">
                      {employeeData.personalInfo.email}
                    </a>
                  </SideInfoItem>

                  <SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Phone size={16} style={{ marginRight: 8, color: '#1890ff' }} />
                      Phone
                    </div>
                    <a href={`tel:${employeeData.personalInfo.phone}`} className="value">
                      {employeeData.personalInfo.phone}
                    </a>
                  </SideInfoItem>

                  <SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Calendar size={16} style={{ marginRight: 8, color: '#faad14' }} />
                      Hired on
                    </div>
                    <div className="value">{employeeData.personalInfo.hireDate}</div>
                  </SideInfoItem>

                  <SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Clock size={16} style={{ marginRight: 8, color: '#722ed1' }} />
                      Employment type
                    </div>
                    <div className="value">{employeeData.personalInfo.employmentType}</div>
                  </SideInfoItem>

                  <SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <Users size={16} style={{ marginRight: 8, color: '#13c2c2' }} />
                      Employee ID
                    </div>
                    <div className="value">{employeeData.personalInfo.employeeId}</div>
                  </SideInfoItem>

                  <SideInfoItem isDarkMode={isDarkMode}>
                    <div className="label">
                      <User size={16} style={{ marginRight: 8, color: '#eb2f96' }} />
                      Manager
                    </div>
                    <div className="value">{employeeData.personalInfo.manager}</div>
                  </SideInfoItem>
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
                      <Row gutter={16}>
                        <Col span={12}>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Full Name</div>
                            <div className="value">{employeeData.personalInfo.name}</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Email</div>
                            <div className="value">{employeeData.personalInfo.email}</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Phone</div>
                            <div className="value">{employeeData.personalInfo.phone}</div>
                          </SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Location</div>
                            <div className="value">{employeeData.personalInfo.location}</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Employee ID</div>
                            <div className="value">{employeeData.personalInfo.employeeId}</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Department</div>
                            <div className="value">{employeeData.personalInfo.department}</div>
                          </SideInfoItem>
                        </Col>
                      </Row>
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
                    >
                      {emergencyContacts.map((contact: any) => (
                        <ContactInfoContainer key={contact.id} isDarkMode={isDarkMode}>
                          <Row align="middle">
                            <Col flex="auto">
                              <Title level={4} style={{ marginBottom: 0 }}>{contact.name}</Title>
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
                      {emergencyContacts.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                          <Heart size={48} color="#d9d9d9" />
                          <p>No emergency contacts added yet</p>
                        </div>
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
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Title</div>
                            <div className="value">{employeeData.jobInfo.title}</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Department</div>
                            <div className="value">{employeeData.jobInfo.department}</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Reports To</div>
                            <div className="value">{employeeData.jobInfo.reportsTo}</div>
                          </SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Team Size</div>
                            <div className="value">{employeeData.jobInfo.teamSize} people</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Work Schedule</div>
                            <div className="value">{employeeData.jobInfo.workSchedule}</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Location</div>
                            <div className="value">{employeeData.jobInfo.location}</div>
                          </SideInfoItem>
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
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Base Salary</div>
                            <div className="value">{employeeData.compensation.salary}</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Bonus Target</div>
                            <div className="value">{employeeData.compensation.bonus}</div>
                          </SideInfoItem>
                        </Col>
                        <Col span={12}>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Stock Options</div>
                            <div className="value">{employeeData.compensation.stockOptions}</div>
                          </SideInfoItem>
                          <SideInfoItem isDarkMode={isDarkMode}>
                            <div className="label">Next Review</div>
                            <div className="value">{employeeData.compensation.nextReview}</div>
                          </SideInfoItem>
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
                      {employeeData.skills.map((skill: any, index: any) => (
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

export default Profile;